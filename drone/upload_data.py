import requests
import sys
import os
import json

with open("drone_credentials.json") as f:
    DRONE_ID = json.load(f)["drone_id"]


# Параметры
SERVER_URL = f"https://your-server.com/api/videos/{DRONE_ID}/upload"
VIDEO_PATH = "/home/pi/missions/flight.mp4"
TELEMETRY_PATH = "/home/pi/missions/telemetry.csv"
TOKEN_PATH = "token.txt"

with open(TOKEN_PATH) as f:
    TOKEN = f.read().strip()

def upload_files(video_path, telemetry_path, server_url, token):
    if not os.path.exists(video_path) or not os.path.exists(telemetry_path):
        print("❌ Видео или лог-файл не найдены.")
        return

    files = {
        'video': open(video_path, 'rb'),
        'telemetry': open(telemetry_path, 'rb')
    }
    headers = {'Authorization': f'Bearer {token}'}

    print("[⇧] Отправка данных на сервер...")
    response = requests.post(server_url, files=files, headers=headers)

    if response.status_code == 200:
        print("✅ Данные успешно отправлены")
    else:
        print(f"❌ Ошибка загрузки: {response.status_code}, {response.text}")

if __name__ == "__main__":
    upload_files(VIDEO_PATH, TELEMETRY_PATH, SERVER_URL, TOKEN)
