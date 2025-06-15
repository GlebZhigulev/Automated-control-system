import asyncio
import websockets
import subprocess
import json
import time
import os
import requests
from pymavlink import mavutil

# === Константы ===
SERVER_URL = "ws://your-server.com/flight/drone/ws/drone"
LOGIN_URL = "https://your-server.com/auth/login"
CREDENTIALS_PATH = "drone_credentials.json"
TOKEN_PATH = "token.txt"
CONFIG_PATH = "mission_config.json"
STATUS_PATH = "mission_state.json"
VIDEO_PATH = "/home/pi/missions/flight.mp4"
TELEMETRY_PATH = "/home/pi/missions/telemetry.csv"
ABORT_FLAG = "abort.flag"

# === Загрузка учётных данных ===
with open(CREDENTIALS_PATH) as f:
    creds = json.load(f)
DRONE_ID = creds["drone_id"]
PASSWORD = creds["password"]
USERNAME = DRONE_ID

# === Работа со статусом ===
def save_status(status):
    with open(STATUS_PATH, "w") as f:
        json.dump({"status": status}, f)

def load_status():
    if not os.path.exists(STATUS_PATH):
        save_status("Готов к подключению")
    with open(STATUS_PATH) as f:
        return json.load(f).get("status", "Готов к подключению")

async def send_status(ws, status):
    save_status(status)
    await ws.send(json.dumps({"type": "status", "status": status}))

# === Фоновая отправка статуса
async def status_heartbeat(ws, interval=5):
    last_status = None
    while True:
        try:
            current = load_status()
            await ws.send(json.dumps({"type": "status", "status": current}))
            if current != last_status:
                print(f"[↪] Статус обновлён: {current}")
                last_status = current
            await asyncio.sleep(interval)
        except Exception as e:
            print(f"[!] Ошибка при отправке статуса: {e}")
            break

# === Получение токена ===
def get_jwt_token():
    try:
        response = requests.post(LOGIN_URL, json={
            "username": USERNAME,
            "password": PASSWORD
        })
        if response.status_code == 200:
            token = response.json()["access_token"]
            with open(TOKEN_PATH, "w") as f:
                f.write(token)
            return token
        else:
            print(f"[❌] Ошибка авторизации: {response.status_code} {response.text}")
            return None
    except Exception as e:
        print(f"[❌] Ошибка при получении токена: {e}")
        return None

# === Отправка телеметрии ===
async def send_telemetry(ws, connection):
    while True:
        msg = connection.recv_match(type='GLOBAL_POSITION_INT', blocking=True, timeout=1)
        if msg:
            telemetry = {
                "type": "telemetry",
                "data": {
                    "lat": msg.lat / 1e7,
                    "lon": msg.lon / 1e7,
                    "alt": msg.relative_alt / 1000.0
                }
            }
            await ws.send(json.dumps(telemetry))
        await asyncio.sleep(1)

# === Аварийная посадка ===
def perform_emergency_land():
    print("[🛬] Аварийная посадка")
    try:
        connection = mavutil.mavlink_connection("udp:localhost:14540")
        connection.wait_heartbeat()
        connection.mav.command_long_send(
            1, 1,
            mavutil.mavlink.MAV_CMD_NAV_LAND,
            0, 0, 0, 0, 0, 0, 0
        )
        save_status("Полет прерван")
        with open(ABORT_FLAG, "w") as f:
            f.write("abort")
    except Exception as e:
        print(f"[!] Ошибка посадки: {e}")

# === Очистка файлов ===
def cleanup_and_shutdown():
    for path in [TOKEN_PATH, ABORT_FLAG, VIDEO_PATH, TELEMETRY_PATH]:
        try:
            os.remove(path)
        except FileNotFoundError:
            continue
    save_status("Готов к выключению")
    print("[✓] Очистка завершена")

# === Обработка команд ===
async def listen(ws):
    mission_prepared = False
    await send_status(ws, "Готов к подключению")

    while True:
        try:
            message = await ws.recv()
            data = json.loads(message)
            command = data.get("command")

            if command == "prepare_mission":
                print("[📥] Подготовка миссии")
                config = {
                    "route": data.get("route", []),
                    "video_path": VIDEO_PATH,
                    "telemetry_path": TELEMETRY_PATH
                }
                with open(CONFIG_PATH, "w") as f:
                    json.dump(config, f, indent=2)
                await send_status(ws, "Готов к полёту")
                mission_prepared = True

            elif command == "start" and mission_prepared:
                print("[🚀] Старт миссии")
                await send_status(ws, "Выполнение маршрута")
                subprocess.Popen(["python3", "start_mission.py"])
                mav_conn = mavutil.mavlink_connection("udp:localhost:14540")
                mav_conn.wait_heartbeat()
                asyncio.create_task(send_telemetry(ws, mav_conn))

            elif command == "Emergency_stop":
                perform_emergency_land()
                await send_status(ws, "Полет прерван")

            elif command == "mission_complete":
                print("[📤] Запуск загрузки данных на сервер...")

                result = subprocess.run(["python3", "upload_data.py"])

                if result.returncode == 0:
                    print("[✅] Данные успешно загружены. Завершаем миссию.")
                    await send_status(ws, "Полет выполнен")
                else:
                    print("[❌] Ошибка загрузки данных. Статус не обновлён.")

            elif command == "shutdown":
                print("[⛔] Завершение")
                cleanup_and_shutdown()
                await send_status(ws, "Готов к выключению")
                break

            else:
                print(f"[⚠] Неизвестная команда: {command}")

        except Exception as e:
            print(f"[!] Ошибка обработки команды: {e}")
            break

# === Подключение к WebSocket ===
async def connect():
    token = get_jwt_token()
    if not token:
        return

    ws_url = f"{SERVER_URL}?drone_id={DRONE_ID}&token={token}"

    while True:
        try:
            async with websockets.connect(ws_url) as ws:
                print("[✓] WebSocket подключён")
                await asyncio.gather(
                    listen(ws),
                    status_heartbeat(ws)
                )
        except Exception as e:
            print(f"[x] Ошибка подключения: {e}")
            save_status("Ошибка соединения")
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(connect())
