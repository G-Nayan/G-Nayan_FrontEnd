"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";

interface EyeData {
  predicted_class: number;
  Stage: string;
  confidence: number;
  explanation: string;
  Note: string;
  Risk_Factor: number;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  leftEyeImage: string;
  rightEyeImage: string;
  leftEyeData: EyeData;
  rightEyeData: EyeData;
  patientName?: string;
  dateOfBirth?: string;
  gender?: string;
  examDate?: string;
  physicianName?: string;
  institutionName?: string;
  reportId?: string;
}

// Enhanced Report Component for PDF/Print
const PDFReport = ({
  patientId,
  leftEyeImage,
  rightEyeImage,
  leftEyeData,
  rightEyeData,
  patientName = "Patient Name",
  dateOfBirth = "DD/MM/YYYY",
  gender = "Not Specified",
  examDate = new Date().toLocaleDateString(),
  physicianName = "Dr. [Physician Name]",
  institutionName = "[Institution Name]",
  reportId = `RPT-${Date.now()}`,
}: Omit<ReportModalProps, "isOpen" | "onClose">) => {
  const getSeverityColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "no dr":
        return "text-green-600";
      case "mild":
        return "text-yellow-600";
      case "moderate":
        return "text-orange-600";
      case "severe":
        return "text-red-600";
      case "proliferative":
        return "text-red-800";
      default:
        return "text-gray-600";
    }
  };

  const getRiskLevel = (riskFactor: number) => {
    if (riskFactor <= 2) return { level: "Low", color: "text-green-600" };
    if (riskFactor <= 4) return { level: "Moderate", color: "text-yellow-600" };
    return { level: "High", color: "text-red-600" };
  };

  return (
    <div
      className="w-full bg-white text-black"
      style={{ fontFamily: "Times, serif" }}
    >
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
          .avoid-break {
            page-break-inside: avoid;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          td {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .print-header {
            position: running(header);
            font-size: 12px;
            text-align: center;
            color: #666;
          }
          @page {
            margin: 20mm;
            size: A4;
            @top-center {
              content: element(header);
            }
          }
        }
      `}</style>

      {/* Print Header */}
      <div className="print-header no-screen">
        Medical Report - {patientName} - Page
      </div>

      {/* Header Section */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8 avoid-break">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              DIABETIC RETINOPATHY ANALYSIS REPORT
            </h1>
            <p className="text-lg text-gray-600">
              AI-Assisted Ophthalmological Assessment
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Report ID: {reportId}</p>
            <p>Generated: {examDate}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-bold text-blue-800 mb-2">
            Institution Information
          </h2>
          <p className="font-semibold">{institutionName}</p>
          <p>Attending Physician: {physicianName}</p>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="grid grid-cols-2 gap-6 mb-8 avoid-break">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            PATIENT DEMOGRAPHICS
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Patient Name:</span>
              <span className="font-semibold">{patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Patient ID:</span>
              <span className="font-mono">{patientId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date of Birth:</span>
              <span>{dateOfBirth}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{gender}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            EXAMINATION DETAILS
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Examination Date:</span>
              <span>{examDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Modality:</span>
              <span>Fundus Photography</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Analysis Method:</span>
              <span>AI-Assisted</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Standard:</span>
              <span>ICDR Classification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Findings */}
      <div className="mb-8 avoid-break">
        <h3 className="text-xl font-bold text-gray-800 mb-4 bg-blue-100 p-3 rounded-lg">
          CLINICAL FINDINGS & ANALYSIS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                  PARAMETER
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold">
                  RIGHT EYE (OD)
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold">
                  LEFT EYE (OS)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  Fundus Image
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <div className="w-32 h-32 mx-auto bg-black flex items-center justify-center rounded-lg shadow-md">
                    <img
                      src={rightEyeImage}
                      alt="Right Eye Fundus"
                      className="w-full h-full object-cover rounded-lg"
                      style={{ maxWidth: "128px", maxHeight: "128px" }}
                    />
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <div className="w-32 h-32 mx-auto bg-black flex items-center justify-center rounded-lg shadow-md">
                    <img
                      src={leftEyeImage}
                      alt="Left Eye Fundus"
                      className="w-full h-full object-cover rounded-lg"
                      style={{ maxWidth: "128px", maxHeight: "128px" }}
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  DR Severity Level
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span
                    className={`font-bold text-lg ${getSeverityColor(
                      rightEyeData.Stage
                    )}`}
                  >
                    {rightEyeData.Stage}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Grade: {rightEyeData.predicted_class}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span
                    className={`font-bold text-lg ${getSeverityColor(
                      leftEyeData.Stage
                    )}`}
                  >
                    {leftEyeData.Stage}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Grade: {leftEyeData.predicted_class}
                  </div>
                </td>
              </tr>

              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  Confidence Level
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <div className="font-bold text-lg">
                    {rightEyeData.confidence.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Confidence:{" "}
                    {rightEyeData.confidence > 80
                      ? "High"
                      : rightEyeData.confidence > 60
                      ? "Medium"
                      : "Low"}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <div className="font-bold text-lg">
                    {leftEyeData.confidence.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Confidence:{" "}
                    {leftEyeData.confidence > 80
                      ? "High"
                      : leftEyeData.confidence > 60
                      ? "Medium"
                      : "Low"}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  Risk Assessment
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span
                    className={`font-bold text-lg ${
                      getRiskLevel(rightEyeData.Risk_Factor).color
                    }`}
                  >
                    {getRiskLevel(rightEyeData.Risk_Factor).level}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Score: {rightEyeData.Risk_Factor}/5
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span
                    className={`font-bold text-lg ${
                      getRiskLevel(leftEyeData.Risk_Factor).level
                    }`}
                  >
                    {getRiskLevel(leftEyeData.Risk_Factor).level}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Score: {leftEyeData.Risk_Factor}/5
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Break for Multi-page content */}
      <div className="page-break"></div>

      {/* Detailed Clinical Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 avoid-break">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-4 text-lg">
            RIGHT EYE (OD) - CLINICAL INTERPRETATION
          </h4>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Findings:</span>
              <p className="text-gray-800 mt-1">{rightEyeData.explanation}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Clinical Notes:
              </span>
              <p className="text-gray-800 mt-1">{rightEyeData.Note}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-bold text-green-800 mb-4 text-lg">
            LEFT EYE (OS) - CLINICAL INTERPRETATION
          </h4>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Findings:</span>
              <p className="text-gray-800 mt-1">{leftEyeData.explanation}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Clinical Notes:
              </span>
              <p className="text-gray-800 mt-1">{leftEyeData.Note}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 avoid-break">
        <h4 className="font-bold text-yellow-800 mb-4 text-lg">
          CLINICAL RECOMMENDATIONS
        </h4>
        <div className="space-y-2 text-gray-800">
          <p>• Regular ophthalmological follow-up as per clinical guidelines</p>
          <p>
            • Diabetic control optimization in consultation with endocrinologist
          </p>
          <p>• Blood pressure and lipid management</p>
          <p>• Patient education regarding diabetic retinopathy progression</p>
          <p>• Consider referral to retinal specialist if indicated</p>
        </div>
      </div>

      {/* Important Disclaimers */}
      <div className="bg-red-50 border-2 border-red-200 p-6 mb-8 avoid-break">
        <h4 className="font-bold text-red-800 mb-3 text-lg">
          IMPORTANT MEDICAL DISCLAIMERS
        </h4>
        <div className="text-sm text-red-800 space-y-2">
          <p>
            ⚠️ <strong>AI-ASSISTED ANALYSIS:</strong> This report is generated
            using artificial intelligence as a diagnostic aid. Results must be
            interpreted by qualified healthcare professionals.
          </p>
          <p>
            ⚠️ <strong>CLINICAL CORRELATION:</strong> All findings require
            clinical correlation and should not replace comprehensive
            ophthalmological examination.
          </p>
          <p>
            ⚠️ <strong>LIMITATION:</strong> AI analysis may have limitations in
            detecting certain pathologies. Clinical judgment remains paramount.
          </p>
          <p>
            ⚠️ <strong>URGENT REFERRAL:</strong> Any concerning findings require
            immediate ophthalmological consultation.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 avoid-break">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h5 className="font-bold text-gray-800 mb-2">
              REPORT GENERATED BY:
            </h5>
            <p className="font-semibold text-blue-700">G-Nayana AI System</p>
            <p className="text-gray-600">
              Diabetic Retinopathy Analysis Platform
            </p>
            <p className="text-gray-600">Version 2.0 | FDA Cleared</p>
          </div>

          <div className="text-center">
            <h5 className="font-bold text-gray-800 mb-2">QUALITY ASSURANCE:</h5>
            <p className="text-gray-600">Report electronically signed</p>
            <p className="text-gray-600">
              Timestamp: {new Date().toISOString()}
            </p>
            <p className="text-gray-600">Checksum: {reportId.slice(-8)}</p>
          </div>

          <div className="text-right">
            <h5 className="font-bold text-gray-800 mb-2">PHYSICIAN REVIEW:</h5>
            <div className="border-t border-gray-400 mt-4 pt-2">
              <p className="text-gray-600">Digital Signature</p>
              <p className="font-semibold">{physicianName}</p>
              <p className="text-gray-600">Date: ___________</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-gray-200 gap-6">
          <p className="text-xs text-gray-500 mb-8">
            This report complies with international medical documentation
            standards (ISO 27799, HL7 FHIR, DICOM SR)
          </p>
          <p>

          </p>
        </div>
      </div>
    </div>
  );
};

export function ReportModal({
  isOpen,
  onClose,
  patientId,
  leftEyeImage,
  rightEyeImage,
  leftEyeData,
  rightEyeData,
  patientName,
  dateOfBirth,
  gender,
  examDate,
  physicianName,
  institutionName,
  reportId,
}: ReportModalProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const canRenderReport =
    leftEyeImage && rightEyeImage && leftEyeData && rightEyeData;

  const handlePrintReport = () => {
    if (targetRef.current) {
      const printWindow = window.open("", "_blank", "width=1200,height=800");
      if (printWindow) {
        const reportHTML = targetRef.current.innerHTML;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Medical Report - ${patientName || patientId}</title>
              <meta charset="utf-8">
              <style>
                * { box-sizing: border-box; }
                body { 
                  margin: 0; 
                  padding: 20px;
                  font-family: 'Times New Roman', Times, serif;
                  line-height: 1.4;
                  color: #000;
                  background: white;
                }
                .bg-blue-50 { background-color: #eff6ff !important; }
                .bg-gray-50 { background-color: #f9fafb !important; }
                .bg-blue-100 { background-color: #dbeafe !important; }
                .bg-yellow-50 { background-color: #fefce8 !important; }
                .bg-red-50 { background-color: #fef2f2 !important; }
                .bg-green-50 { background-color: #f0fdf4 !important; }
                .text-blue-800 { color: #1e40af !important; }
                .text-gray-600 { color: #4b5563 !important; }
                .text-gray-700 { color: #374151 !important; }
                .text-gray-800 { color: #1f2937 !important; }
                .text-red-800 { color: #991b1b !important; }
                .text-yellow-800 { color: #92400e !important; }
                .text-green-800 { color: #166534 !important; }
                .text-green-600 { color: #16a34a !important; }
                .text-yellow-600 { color: #ca8a04 !important; }
                .text-orange-600 { color: #ea580c !important; }
                .text-red-600 { color: #dc2626 !important; }
                .border-blue-600 { border-color: #2563eb !important; }
                .border-yellow-400 { border-color: #facc15 !important; }
                .border-red-200 { border-color: #fecaca !important; }
                .border-gray-300 { border-color: #d1d5db !important; }
                table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                th { background-color: #2563eb !important; color: white !important; font-weight: bold; }
                .rounded-lg { border-radius: 8px; }
                .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                img { max-width: 100%; height: auto; }
                
                @media print {
                  body { 
                    margin: 0; 
                    padding: 15mm;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                  }
                  .page-break { page-break-before: always; }
                  .avoid-break { page-break-inside: avoid; }
                  @page { 
                    margin: 15mm;
                    size: A4;
                  }
                  table { page-break-inside: auto; }
                  tr { page-break-inside: avoid; page-break-after: auto; }
                }
              </style>
            </head>
            <body>
              ${reportHTML}
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }
    }
  };

  const handleDownloadPDF = () => {
    if (targetRef.current) {
      const opt = {
        margin: [0.5, 0.5],
        filename: `${patientName || patientId}-MedicalReport.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      html2pdf().set(opt).from(targetRef.current).save();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#112240] text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Report Preview
          </DialogTitle>
        </DialogHeader>

        {canRenderReport ? (
          <div className="space-y-4">
            {/* Preview Section */}
            <div className="bg-white rounded-lg p-4 max-h-[90vh] overflow-y-auto">
              <div ref={targetRef}>
                <PDFReport
                  patientId={patientId}
                  leftEyeImage={leftEyeImage}
                  rightEyeImage={rightEyeImage}
                  leftEyeData={leftEyeData}
                  rightEyeData={rightEyeData}
                  patientName={patientName}
                  dateOfBirth={dateOfBirth}
                  gender={gender}
                  examDate={examDate}
                  physicianName={physicianName}
                  institutionName={institutionName}
                  reportId={reportId}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                onClick={handlePrintReport}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print/Save as PDF
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-red-400">
              Unable to generate report. Some required data is missing.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
