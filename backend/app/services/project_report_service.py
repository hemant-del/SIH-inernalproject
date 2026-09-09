from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
import io

def generate_pdf_report(report_data: dict, business_info: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle', parent=styles['Title'], textColor=colors.navy, spaceAfter=20
    )
    header_style = ParagraphStyle(
        'HeaderStyle', parent=styles['Heading2'], textColor=colors.darkblue, spaceBefore=10, spaceAfter=10
    )
    
    story = []
    
    title = f"Project Report - {business_info.get('business_type', 'Business')}"
    story.append(Paragraph(title, title_style))
    
    sections = [
        ("Executive Summary", report_data.get('executive_summary', '')),
        ("Business Description", report_data.get('business_description', '')),
        ("Equipment Requirements", report_data.get('equipment_requirements', '')),
        ("Revenue Projection", report_data.get('revenue_projection', '')),
        ("Profit Estimate", report_data.get('profit_estimate', '')),
        ("Risk Assessment", report_data.get('risks', '')),
        ("Loan Requirement", report_data.get('loan_requirement', ''))
    ]
    
    for heading, text in sections:
        if text:
            story.append(Paragraph(heading, header_style))
            story.append(Paragraph(str(text), styles['Normal']))
            story.append(Spacer(1, 0.2 * inch))
            
    # Sample tables for breakdown and expenses
    story.append(Paragraph("Investment Breakdown", header_style))
    inv_data = [["Item", "Estimated Cost"], ["Total Investment", str(business_info.get('investment_amount', 0))]]
    t = Table(inv_data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.navy),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    story.append(t)
    story.append(Spacer(1, 0.2 * inch))
    
    footer = Paragraph("<i>This is a computer-generated draft. All financial figures are ESTIMATES.</i>", styles['Normal'])
    story.append(Spacer(1, 0.5 * inch))
    story.append(footer)
    
    doc.build(story)
    buffer.seek(0)
    return buffer
