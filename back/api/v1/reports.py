from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from back.database import get_db
from back.crud import crud_reports
import os

router = APIRouter(prefix="/reports", tags=["reports"])

PDF_DIR = "generated_reports"
os.makedirs(PDF_DIR, exist_ok=True)

@router.post("/")
def create_report(data: dict, db: Session = Depends(get_db)):
    video_id = data.get("video_id")
    flight_plan_id = data.get("flight_plan_id")
    generated_by = data.get("generated_by")

    if not (video_id and flight_plan_id and generated_by):
        raise HTTPException(status_code=400, detail="Недостаточно данных")

    pdf_path = f"{PDF_DIR}/report_{video_id}_{flight_plan_id}.pdf"
    with open(pdf_path, "w") as f:
        f.write("PDF CONTENT")  # Заглушка

    report = crud_reports.create_report(db, video_id, flight_plan_id, generated_by, pdf_path)

    return {
        "report_id": report.id,
        "status": report.status,
        "created_at": report.created_at
    }

@router.get("/")
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

@router.get("/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = crud_reports.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Отчёт не найден")
    return {
        "report_id": report.id,
        "video_id": report.video_id,
        "flight_plan_id": report.flight_plan_id,
        "summary": "Обнаружено 5 дефектов",
        "defects": [
            {
                "coordinates": [57.162247, 65.498206],
                "confidence": 0.91,
                "mask_path": "/masks/defect_201.png"
            },
            {
                "coordinates": [57.162655, 65.499365],
                "confidence": 0.87,
                "mask_path": "/masks/defect_202.png"
            }
        ],
        "created_at": report.created_at,
        "pdf_path": report.pdf_path
    }

@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db)):
    report = crud_reports.get_report_by_id(db, report_id)
    if not report or not os.path.isfile(report.pdf_path):
        raise HTTPException(status_code=404, detail="Файл отчёта не найден")
    return FileResponse(report.pdf_path, media_type="application/pdf", filename=os.path.basename(report.pdf_path))