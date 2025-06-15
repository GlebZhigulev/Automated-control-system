import cv2
import sys
import signal

# Получаем путь к выходному файлу из аргументов
if len(sys.argv) < 2:
    print("❌ Укажите путь к выходному видеофайлу.")
    sys.exit(1)

output_path = sys.argv[1]

# Параметры видео
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FPS = 25.0

# Инициализация камеры
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
cap.set(cv2.CAP_PROP_FPS, FPS)

# Проверка подключения камеры
if not cap.isOpened():
    print("❌ Камера не обнаружена.")
    sys.exit(1)

# Настройка кодека и записи
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, FPS, (FRAME_WIDTH, FRAME_HEIGHT))

print(f"[📹] Запись видео: {output_path}")

running = True

def handle_sigint(sig, frame):
    global running
    running = False

signal.signal(signal.SIGINT, handle_sigint)

# Основной цикл записи
while running:
    ret, frame = cap.read()
    if not ret:
        print("Ошибка чтения кадра.")
        break
    out.write(frame)

# Очистка
cap.release()
out.release()
print("[✅] Видео сохранено.")
