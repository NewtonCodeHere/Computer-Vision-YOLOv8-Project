import os
import io
import csv
import datetime
from typing import List
from models import ScanRecord, DetectionItem
from config import settings

def generate_csv_report(scans: List[ScanRecord]) -> str:
    """Generates a CSV string containing detailed detection and scan data."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "Scan ID", "Timestamp (UTC)", "Operator", "Total Objects",
        "Clean Seeds", "Impurities Detected", "Purity Rate (%)",
        "Impurity Details [Class: Center_X, Center_Y, Conf]"
    ])
    
    for scan in scans:
        imp_details = []
        for d in scan.detections:
            if d.is_impurity:
                imp_details.append(f"{d.class_name} (x:{d.center_x:.0f}, y:{d.center_y:.0f}, {d.confidence*100:.0f}%)")
        
        writer.writerow([
            scan.id,
            scan.timestamp.strftime("%Y-%m-%d %H:%M:%S") if scan.timestamp else "",
            scan.operator or "Admin",
            scan.total_objects,
            scan.clean_count,
            scan.impurity_count,
            f"{scan.purity_rate:.2f}%",
            "; ".join(imp_details) if imp_details else "None"
        ])
    
    return output.getvalue()


def generate_pdf_report(scans: List[ScanRecord], filename: str = None) -> bytes:
    """Generates a PDF inspection report using ReportLab or fallback styling."""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            name='DocTitle',
            parent=styles['Heading1'],
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#1e293b")
        )
        subtitle_style = ParagraphStyle(
            name='DocSubtitle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#64748b")
        )
        
        elements.append(Paragraph("Bengal Gram Quality Inspection Report", title_style))
        elements.append(Paragraph(f"AI-Powered YOLOv8 Impurity Detection System — Generated {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", subtitle_style))
        elements.append(Spacer(1, 16))
        
        # Summary statistics
        total_scans = len(scans)
        total_clean = sum(s.clean_count for s in scans)
        total_impurities = sum(s.impurity_count for s in scans)
        total_items = total_clean + total_impurities
        overall_purity = (total_clean / total_items * 100) if total_items > 0 else 100.0

        summary_data = [
            ["Total Batches / Scans", str(total_scans), "Overall Purity Rate", f"{overall_purity:.2f}%"],
            ["Total Grains Inspected", str(total_items), "Foreign Objects Ejected", str(total_impurities)],
        ]
        
        summary_table = Table(summary_data, colWidths=[150, 100, 150, 100])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor("#334155")),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 20))
        
        # Detailed Scan Table
        elements.append(Paragraph("Inspection Log History", styles['Heading2']))
        elements.append(Spacer(1, 8))
        
        table_data = [["ID", "Date & Time", "Clean", "Impurities", "Purity", "Status"]]
        for scan in scans[:30]:  # Top 30
            status = "PASSED" if scan.impurity_count == 0 else f"EJECTED ({scan.impurity_count})"
            table_data.append([
                str(scan.id),
                scan.timestamp.strftime("%Y-%m-%d %H:%M") if scan.timestamp else "-",
                str(scan.clean_count),
                str(scan.impurity_count),
                f"{scan.purity_rate:.1f}%",
                status
            ])
            
        scan_table = Table(table_data, colWidths=[40, 140, 70, 70, 80, 120])
        scan_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f1f5f9")]),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(scan_table)
        
        doc.build(elements)
        return buffer.getvalue()
    except ImportError:
        # Fallback text representation wrapped in simple PDF header
        text_report = f"""%PDF-1.4
Bengal Gram Quality Inspection Report
Generated: {datetime.datetime.utcnow().isoformat()}
Total Scans: {len(scans)}
"""
        return text_report.encode("utf-8")
