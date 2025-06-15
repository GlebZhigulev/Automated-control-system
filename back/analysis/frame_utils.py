import cv2
import os
import pandas as pd

def extract_frames(video_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    count = 0
    frames = []

    while True:
        success, frame = cap.read()
        if not success:
            break
        frame_path = os.path.join(out_dir, f"frame_{count:03d}.png")
        cv2.imwrite(frame_path, frame)
        frames.append((count, frame_path))
        count += 1

    cap.release()
    return frames, fps

def load_telemetry(csv_path):
    return pd.read_csv(csv_path)

def get_coords_for_frame(n_frame, fps, start_timestamp, telemetry_df):
    t_frame = start_timestamp + n_frame / fps
    telemetry_df["time_diff"] = (telemetry_df["timestamp"] - t_frame).abs()
    closest = telemetry_df.loc[telemetry_df["time_diff"].idxmin()]
    return float(closest["latitude"]), float(closest["longitude"])
