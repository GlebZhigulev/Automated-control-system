from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_reports, crud_defects
import os

router = APIRouter(prefix="/reports", tags=["Отчёты"])

PDF_DIR = "generated_reports"
os.makedirs(PDF_DIR, exist_ok=True)

@router.post("/{video_id}", summary="Формирование отчета по видео")
def create_report(video_id: int, data: dict, db: Session = Depends(get_db)):
    flight_plan_id = data.get("flight_plan_id")
    generated_by = data.get("generated_by")

    if not (video_id and flight_plan_id and generated_by):
        raise HTTPException(status_code=400, detail="Недостаточно данных")

    pdf_path = f"{PDF_DIR}/report_{video_id}_{flight_plan_id}.pdf"

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF-файл не найден")

    report = crud_reports.create_report(db, video_id, flight_plan_id, generated_by, pdf_path)

    return {
        "report_id": report.id,
        "status": report.status,
        "created_at": report.created_at
    }

@router.get("/", summary="Получение списка отчетов")
def list_reports(db: Session = Depends(get_db)):
    reports = crud_reports.get_all_reports(db)
    return [
        {
            "report_id": r.id,
            "video_id": r.video_id,
            "flight_plan_id": r.flight_plan_id,
            "created_at": r.created_at,
            "pdf_path": r.pdf_path
        }
        for r in reports
    ]

@router.get("/{report_id}", summary="Просмотр отчета")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = crud_reports.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Отчёт не найден")

    defects = crud_defects.get_defects_by_video(db, report.video_id)

    return {
        "report_id": report.id,
        "video_id": report.video_id,
        "flight_plan_id": report.flight_plan_id,
        "summary": f"Обнаружено {len(defects)} дефектов",
        "defects": [
            {
                "id": d.id,
                "coordinates": [d.latitude, d.longitude],
                "defect_path": d.image_path,
                "original_image_path": d.original_image_path,
            }
            for d in defects
        ],
        "created_at": report.created_at,
        "pdf_path": report.pdf_path
    }

@router.get("/{report_id}/download", summary="Скачивание PDF-отчета")
def download_report(report_id: int, db: Session = Depends(get_db)):
    report = crud_reports.get_report_by_id(db, report_id)
    if not report or not os.path.isfile(report.pdf_path):
        raise HTTPException(status_code=404, detail="Файл отчёта не найден")
    return FileResponse(report.pdf_path, media_type="application/pdf", filename=os.path.basename(report.pdf_path))
