import subprocess
import os
import time
import json
import sys
from pymavlink import mavutil

VIDEO_SCRIPT = "record_video.py"
TELEMETRY_SCRIPT = "log_telemetry.py"
CONFIG_PATH = "mission_config.json"
ABORT_FLAG = "abort.flag"

# === Загрузка конфигурации ===
if not os.path.exists(CONFIG_PATH):
    print("❌ Файл конфигурации миссии не найден.")
    sys.exit(1)

with open(CONFIG_PATH) as f:
    config = json.load(f)

route = config["route"]
video_path = config.get("video_path", "/home/pi/missions/flight.mp4")
telemetry_path = config.get("telemetry_path", "/home/pi/missions/telemetry.csv")
speed = config.get("speed")

# === Подключение к PX4 ===
connection = mavutil.mavlink_connection('udp:localhost:14540')
connection.wait_heartbeat()
print("[📡] Подключено к автопилоту PX4")

# === Очистка миссии ===
connection.mav.mission_clear_all_send(1, 1)

# === Загрузка маршрута ===
for i, wp in enumerate(route):
    connection.mav.mission_item_int_send(
        1, 1, i,
        mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT_INT,
        mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        0, 1, 0, 0, 0, 0, 0,
        int(wp["lat"] * 1e7),
        int(wp["lon"] * 1e7),
        wp["alt"]
    )
    print(f"[+] Точка {i}: {wp['lat']}, {wp['lon']}, {wp['alt']}")

connection.mav.mission_count_send(1, 1, len(route))
print("[✓] Маршрут передан автопилоту")

# === Установка скорости ===
if speed:
    connection.mav.command_long_send(
        1, 1,
        mavutil.mavlink.MAV_CMD_DO_CHANGE_SPEED,
        0, 1, speed,
        -1, 0, 0, 0, 0
    )
    print(f"[→] Установлена скорость: {speed} м/с")
else:
    print("[ℹ] Используется стандартная скорость PX4")

# === Запуск миссии ===
time.sleep(2)
connection.mav.command_long_send(
    1, 1,
    mavutil.mavlink.MAV_CMD_MISSION_START,
    0, 0, 0, 0, 0, 0, 0
)
print("[▶] Миссия запущена")

# === Запуск записи ===
video_proc = subprocess.Popen(["python3", VIDEO_SCRIPT, video_path])
telemetry_proc = subprocess.Popen(["python3", TELEMETRY_SCRIPT, telemetry_path])

# === Ожидание завершения ===
while True:
    if os.path.exists(ABORT_FLAG):
        print("[🛑] Получен сигнал аварийной посадки. Завершение миссии.")
        break
    if video_proc.poll() is not None and telemetry_proc.poll() is not None:
        break
    time.sleep(1)

# === Завершение записи ===
for proc in [video_proc, telemetry_proc]:
    try:
        proc.terminate()
        proc.wait(timeout=5)
    except Exception:
        proc.kill()

print("[✅] Миссия завершена")
