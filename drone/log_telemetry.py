from pymavlink import mavutil
import csv
import time
import sys
import signal

# Получение пути к выходному файлу
if len(sys.argv) < 2:
    print("❌ Укажите путь к файлу telemetry.csv")
    sys.exit(1)

output_path = sys.argv[1]

# MAVLink соединение (смените на нужный порт, если нужно)
connection = mavutil.mavlink_connection('udp:localhost:14540')
connection.wait_heartbeat()
print("[📡] Подключено к автопилоту")

# Открытие CSV-файла
file = open(output_path, mode='w', newline='')
writer = csv.writer(file)
writer.writerow(['timestamp', 'latitude', 'longitude', 'altitude'])

running = True

def handle_sigint(sig, frame):
    global running
    running = False

signal.signal(signal.SIGINT, handle_sigint)

# Основной цикл логгирования
while running:
    msg = connection.recv_match(type='GLOBAL_POSITION_INT', blocking=True, timeout=1)
    if msg is None:
        continue

    timestamp = time.time()
    lat = msg.lat / 1e7         # Преобразование из int32 -> float
    lon = msg.lon / 1e7
    alt = msg.relative_alt / 1000.0  # мм → м

    writer.writerow([timestamp, lat, lon, alt])
    file.flush()

    print(f"[✓] {lat:.6f}, {lon:.6f}, {alt:.1f}m")

file.close()
print("[✅] Телеметрия сохранена.")
