import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from back.analysis.analyzer import analyze_video_and_save

class VideoReadyWatcher(FileSystemEventHandler):
    def __init__(self):
        self.ready_videos = {}

    def on_created(self, event):
        if event.is_directory:
            return

        path = event.src_path
        name = os.path.basename(path)

        if name.startswith("video_") and name.endswith(".mp4"):
            video_id = int(name.split("_")[1].split(".")[0])
            self.ready_videos.setdefault(video_id, {})["video"] = path

        if name.startswith("telemetry_") and name.endswith(".csv"):
            video_id = int(name.split("_")[1].split(".")[0])
            self.ready_videos.setdefault(video_id, {})["telemetry"] = path

        for video_id, files in self.ready_videos.items():
            if "video" in files and "telemetry" in files:
                print(f"[→] Готов к анализу: video_id = {video_id}")
                analyze_video_and_save(video_id)
                del self.ready_videos[video_id]

def run_watcher():
    observer = Observer()
    observer.schedule(VideoReadyWatcher(), path="storage/videos", recursive=True)
    observer.schedule(VideoReadyWatcher(), path="storage/telemetry", recursive=True)
    observer.start()
    print("[•] Watcher запущен")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()