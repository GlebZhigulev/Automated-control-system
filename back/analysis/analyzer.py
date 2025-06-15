import os
import cv2
import torch
import numpy as np
from sqlalchemy.orm import Session
from .model import load_model
from .frame_utils import extract_frames, load_telemetry, get_coords_for_frame
from back.crud.crud_defects import create_defect
from back.crud.crud_videos import get_video_by_id
from back.crud.crud_flight_plans import get_flight_plan_by_id
from back.database import SessionLocal

model = load_model()

def analyze_video_and_save(video_id: int):
    db: Session = SessionLocal()
    video = get_video_by_id(db, video_id)
    if not video:
        print(f"[!] Видео с id {video_id} не найдено")
        return

    flight = get_flight_plan_by_id(db, video.flight_request_id)
    if not flight or not flight.start_timestamp:
        print(f"[!] План полёта или start_timestamp не найден")
        return

    flight_id = flight.id


    video_path = video.file_path
    telemetry_path = f"storage/telemetry/flight_{flight_id}/telemetry_{video_id}.csv"
    screenshot_dir = f"storage/screenshots/video_{video_id}"
    defect_dir = f"storage/defects/video_{video_id}"

    os.makedirs(screenshot_dir, exist_ok=True)
    os.makedirs(defect_dir, exist_ok=True)

    telemetry_df = load_telemetry(telemetry_path)
    frames, fps = extract_frames(video_path, screenshot_dir)

    start_ts = float(telemetry_df["timestamp"].iloc[0])


    for n, frame_path in frames:
        image_bgr = cv2.imread(frame_path)
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        image_tensor = torch.from_numpy(image_rgb).permute(2, 0, 1).unsqueeze(0)

        with torch.no_grad():
            prediction = torch.sigmoid(model(image_tensor))
            mask = (prediction > 0.3).float()

        mask_np = mask.squeeze().numpy()
        mask_uint8 = (mask_np * 255).astype(np.uint8)
        contours, _ = cv2.findContours(mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if contours:
            defect_path = os.path.join(defect_dir, f"defect_{n:03d}.png")
            image_with_contours = image_bgr.copy()
            cv2.drawContours(image_with_contours, contours, -1, (0, 0, 255), 2)
            cv2.imwrite(defect_path, image_with_contours)

            lat, lon = get_coords_for_frame(n, fps, start_ts, telemetry_df)

            create_defect(
                db=db,
                video_id=video_id,
                image_path=defect_path,
                original_image_path=frame_path,
                latitude=lat,
                longitude=lon,
                confidence=1.0
            )

    db.close()
    print(f"[✓] Анализ видео {video_id} завершён.")