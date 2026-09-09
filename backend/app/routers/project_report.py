from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.common import ProjectReportInput
from app.services.gemini_service import gemini_service
from app.services.project_report_service import generate_pdf_report

router = APIRouter(prefix="/api/project-report", tags=["Project Report"])

@router.post("/generate")
async def generate_report(input: ProjectReportInput):
    data = input.model_dump()
    report = await gemini_service.generate_project_report(data)
    return report

@router.post("/pdf")
async def get_pdf(input: ProjectReportInput):
    data = input.model_dump()
    report_data = await gemini_service.generate_project_report(data)
    buffer = generate_pdf_report(report_data, data)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report.pdf"})
