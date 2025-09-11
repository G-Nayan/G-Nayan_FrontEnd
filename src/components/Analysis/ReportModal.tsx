// src/components/Analysis/ReportModal.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import Gnayanlogo from "../../assets/Gnayanalogo.png";

// ---------------- Types ----------------
interface EyeData {
  predicted_class?: number;
  stage?: string;
  Stage?: string;
  confidence?: number;
  explanation?: string;
  note?: string;
  Note?: string;
  risk_factor?: number;
  Risk_Factor?: number;
  timestamp?: string;
  image_url?: string;
  image_filename?: string;
  eye_scan_id?: string;
  doctor_diagnosis?: string;
  recommendations?: string;
  review_status?: string;
  fundus_image?: string;
  image?: string;
  [key: string]: any;
}

interface CombinedReport {
  composite_id?: string;
  name?: string;
  gender?: string;
  Date_of_registration?: string;
  Hospital_name?: string;
  patient_id?: string | number;
  left_eye?: EyeData | null;
  right_eye?: EyeData | null;
  [key: string]: any;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  combinedReport?: CombinedReport;
  leftEyeImage?: string;
  rightEyeImage?: string;
  leftEyeData?: EyeData;
  rightEyeData?: EyeData;
  patientName?: string;
  gender?: string;
  examDate?: string;
  institutionName?: string;
  reportId?: string;
  physicianName?: string;
}

// ---------------- Utility functions ----------------
const getSeverityColor = (stage?: string) => {
  if (!stage) return "text-gray-600";
  switch (stage.toLowerCase()) {
    case "no dr":
    case "normal":
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

const getRiskLevel = (riskFactor?: number) => {
  if (riskFactor == null || Number.isNaN(riskFactor))
    return { level: "N/A", color: "text-gray-600" };
  if (riskFactor <= 2) return { level: "Low", color: "text-green-600" };
  if (riskFactor <= 4) return { level: "Moderate", color: "text-yellow-600" };
  return { level: "High", color: "text-red-600" };
};

// ---------------- PDFReport (new layout) ----------------
const PDFReport = ({
  patientId,
  leftEyeImage,
  rightEyeImage,
  leftEyeData,
  rightEyeData,
  patientName = "Patient Name",
  gender = "Not Specified",
  examDate = new Date().toLocaleDateString(),
  physicianName = "Dr. [Physician Name]",
  institutionName = "[Institution Name]",
  reportId = `RPT-${Date.now()}`,
}: Omit<ReportModalProps, "isOpen" | "onClose" | "combinedReport"> & {
  patientId?: string;
}) => {
  return (
    <div className="w-full bg-white text-black">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-4 avoid-break">
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
            <img
              src={Gnayanlogo}
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <div className="mt-1 text-center ">
              <p className="font-semibold text-blue-700">G-Nayana AI System</p>
              <p className="text-gray-600">
                Diabetic Retinopathy Analysis Platform
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg flex gap-2 mb-2">
          <h2 className="font-bold text-blue-800 mb-2">Hospital Name :</h2>
          <p className="font-semibold">{institutionName || "Not mentioned"}</p>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="grid grid-cols-2 gap-3 mb-4 avoid-break">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            PATIENT DEMOGRAPHICS
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Patient Name:</span>
              <span className="font-semibold">{patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Patient ID:</span>
              <span className="font-mono">{patientId}</span>
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
          <div className="space-y-2 text-sm">
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
          </div>
        </div>
      </div>

      {/* Clinical Findings */}
      <div className="mb-4 avoid-break">
        <h3 className="text-xl font-bold text-gray-800 mb-4 p-3 rounded-lg">
          CLINICAL FINDINGS & ANALYSIS
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-gray-300 text-sm">
            <thead>
              <tr className="bg-blue-100 text-gray-900">
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
                  {rightEyeImage ? (
                    <img
                      src={rightEyeImage}
                      alt="Right Eye Fundus"
                      className="mx-auto w-44 h-44 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {leftEyeImage ? (
                    <img
                      src={leftEyeImage}
                      alt="Left Eye Fundus"
                      className="mx-auto w-44 h-44 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  DR Severity Level
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {rightEyeData?.Stage ? (
                    <span
                      className={`font-bold ${getSeverityColor(
                        rightEyeData.Stage
                      )}`}
                    >
                      {rightEyeData.Stage}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {leftEyeData?.Stage ? (
                    <span
                      className={`font-bold ${getSeverityColor(
                        leftEyeData.Stage
                      )}`}
                    >
                      {leftEyeData.Stage}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  Confidence Level
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {rightEyeData?.confidence
                    ? `${rightEyeData.confidence.toFixed(1)}%`
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {leftEyeData?.confidence
                    ? `${leftEyeData.confidence.toFixed(1)}%`
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  Risk Assessment
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {rightEyeData?.Risk_Factor != null
                    ? getRiskLevel(rightEyeData.Risk_Factor).level
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {leftEyeData?.Risk_Factor != null
                    ? getRiskLevel(leftEyeData.Risk_Factor).level
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ pageBreakBefore: "always" }}></div>
      {/* Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 avoid-break">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-4 text-lg">
            RIGHT EYE (OD)
          </h4>
          <p className="text-sm text-gray-800">
            {rightEyeData?.explanation || "N/A"}
          </p>
          <p className="text-sm text-gray-800 mt-2">
            <strong>Notes:</strong> {rightEyeData?.Note || "N/A"}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-bold text-green-800 mb-4 text-lg">
            LEFT EYE (OS)
          </h4>
          <p className="text-sm text-gray-800">
            {leftEyeData?.explanation || "N/A"}
          </p>
          <p className="text-sm text-gray-800 mt-2">
            <strong>Notes:</strong> {leftEyeData?.Note || "N/A"}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 avoid-break">
        <h4 className="font-bold text-yellow-800 mb-2 text-lg">
          CLINICAL RECOMMENDATIONS
        </h4>
        <ul className="list-disc list-inside text-sm text-gray-800">
          <li>Regular ophthalmological follow-up</li>
          <li>Diabetic control optimization</li>
          <li>Blood pressure and lipid management</li>
          <li>Patient education regarding DR progression</li>
          <li>Referral to retinal specialist if indicated</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border-2 border-red-200 p-2 mb-4 avoid-break text-sm text-red-800">
        <strong>⚠️ AI-ASSISTED ANALYSIS:</strong> This report is generated using
        AI as a diagnostic aid. Results must be verified by a qualified
        ophthalmologist.
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-3 mb-3 avoid-break text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-bold text-gray-800 mb-2">
              REPORT GENERATED BY:
            </h5>
            <p className="font-semibold text-blue-700">G-Nayana AI System</p>
          </div>
          <div className="text-center">
            <h5 className="font-bold text-gray-800 mb-2">QUALITY ASSURANCE:</h5>
            <p className="text-gray-600">Report electronically signed</p>
            <p className="text-gray-600">Checksum: {reportId.slice(-8)}</p>
          </div>
          <div className="text-right">
            <h5 className="font-bold text-gray-800 mb-2">PHYSICIAN REVIEW:</h5>
            <p className="font-semibold">{physicianName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- ReportModal ----------------
export function ReportModal(props: ReportModalProps) {
  const { isOpen, onClose, combinedReport, ...legacyProps } = props;

  // keep object URLs so we can revoke them on cleanup
  const createdObjectUrls = useRef<string[]>([]);

  const [leftEyeImage, setLeftEyeImage] = useState<string | undefined>();
  const [rightEyeImage, setRightEyeImage] = useState<string | undefined>();

  // configure base (adjust if different)
  const IMAGE_API_BASE =
    import.meta.env.VITE_API_BASE || "http://localhost:8000";
  const IMAGE_ENDPOINT = `${IMAGE_API_BASE}/Get_patient_Clinical_and_PREDICTION_data/patient-image`;

  // Helper: fetch a URL and return object URL (or undefined)
  const fetchUrlToObjectUrl = async (url: string) => {
    try {
      console.debug("[ReportModal] fetching URL -> blob:", url);
      const token = localStorage.getItem("token") || "";
      const res = await fetch(url, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            }
          : { "ngrok-skip-browser-warning": "true" },
      });
      if (!res.ok) {
        console.warn("[ReportModal] Image fetch returned non-ok", {
          url,
          status: res.status,
        });
        return undefined;
      }
      const blob = await res.blob();
      const obj = URL.createObjectURL(blob);
      createdObjectUrls.current.push(obj);
      return obj;
    } catch (err) {
      console.error("[ReportModal] Error fetching image:", { url, err });
      return undefined;
    }
  };

  /**
   * Resolve candidate into an object URL:
   * - If candidate looks like a full URL containing '/patient-image/', extract filename and call IMAGE_ENDPOINT/<encoded-filename>
   * - If candidate is a filename (contains '/'), encode and call IMAGE_ENDPOINT/<encoded-filename>
   * - If candidate is full URL but not containing '/patient-image/', try fetch directly
   * - Returns objectURL or undefined
   */
  const resolveImageCandidate = async (
    candidate?: string | null
  ): Promise<string | undefined> => {
    if (!candidate) return undefined;

    // candidate is something like: "P002-V001/left_image.jpg"
    // Or candidate may be "http://localhost:8000/patient-image/P002-V001/left_image.jpg"
    // 1) If it's a full URL and it contains '/patient-image/', prefer to extract path after that and call IMAGE_ENDPOINT/<encoded-filename>
    if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
      if (candidate.includes("/patient-image/")) {
        const parts = candidate.split("/patient-image/");
        const filename = parts[parts.length - 1]; // e.g. P002-V001/left_image.jpg
        if (filename) {
          const fileEndpoint = `${IMAGE_ENDPOINT}/${encodeURIComponent(
            filename
          )}`;
          const obj = await fetchUrlToObjectUrl(fileEndpoint);
          if (obj) return obj;
          // fallback: try the full candidate URL directly
          const directObj = await fetchUrlToObjectUrl(candidate);
          if (directObj) return directObj;
          return undefined;
        }
      } else {
        // If it doesn't include /patient-image/, try direct fetch first
        const directObj = await fetchUrlToObjectUrl(candidate);
        if (directObj) return directObj;
      }
    }

    // 2) If candidate contains slash (likely a filename), call IMAGE_ENDPOINT/<encoded>
    if (candidate.includes("/")) {
      const fileEndpoint = `${IMAGE_ENDPOINT}/${encodeURIComponent(candidate)}`;
      const obj = await fetchUrlToObjectUrl(fileEndpoint);
      if (obj) return obj;
    }

    // 3) Try encoding candidate as filename anyway (last resort)
    try {
      const fileEndpoint = `${IMAGE_ENDPOINT}/${encodeURIComponent(candidate)}`;
      const obj = await fetchUrlToObjectUrl(fileEndpoint);
      if (obj) return obj;
    } catch (e) {
      // ignore
    }

    return undefined;
  };

  // When modal opens or combinedReport changes, resolve images
  useEffect(() => {
    // cleanup previous object URLs before new load
    createdObjectUrls.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {
        /* ignore */
      }
    });
    createdObjectUrls.current = [];
    setLeftEyeImage(undefined);
    setRightEyeImage(undefined);

    if (!isOpen) {
      setLeftEyeImage(legacyProps.leftEyeImage);
      setRightEyeImage(legacyProps.rightEyeImage);
      return;
    }

    (async () => {
      if (!combinedReport) {
        setLeftEyeImage(legacyProps.leftEyeImage);
        setRightEyeImage(legacyProps.rightEyeImage);
        return;
      }

      // candidate order: image_filename (preferred), fundus_image/image/_leftImage or full image_url
      const leftCandidates = [
        combinedReport.left_eye?.image_filename,
        (combinedReport as any)._leftImage,
        combinedReport.left_eye?.image_url,
        combinedReport.left_eye?.fundus_image,
        combinedReport.left_eye?.image,
      ].filter(Boolean);

      const rightCandidates = [
        combinedReport.right_eye?.image_filename,
        (combinedReport as any)._rightImage,
        combinedReport.right_eye?.image_url,
        combinedReport.right_eye?.fundus_image,
        combinedReport.right_eye?.image,
      ].filter(Boolean);

      // attempt for left
      let leftObj: string | undefined = undefined;
      for (const c of leftCandidates) {
        leftObj = await resolveImageCandidate(c as string);
        if (leftObj) break;
      }
      if (!leftObj) {
        // fallback to legacy prop if provided
        leftObj = legacyProps.leftEyeImage;
      }
      setLeftEyeImage(leftObj);

      // attempt for right
      let rightObj: string | undefined = undefined;
      for (const c of rightCandidates) {
        rightObj = await resolveImageCandidate(c as string);
        if (rightObj) break;
      }
      if (!rightObj) {
        rightObj = legacyProps.rightEyeImage;
      }
      setRightEyeImage(rightObj);
    })();

    return () => {
      // revoke object URLs when unmounting or closing
      createdObjectUrls.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      createdObjectUrls.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, combinedReport]);

  // report metadata
  const patientId =
    combinedReport?.composite_id ?? legacyProps.patientName ?? "";
  const patientName = combinedReport?.name ?? legacyProps.patientName;
  const gender = combinedReport?.gender ?? legacyProps.gender;
  const examDate =
    combinedReport?.left_eye?.timestamp ??
    combinedReport?.right_eye?.timestamp ??
    legacyProps.examDate;
  const institutionName =
    combinedReport?.Hospital_name ?? legacyProps.institutionName;
  const reportId = combinedReport?.patient_id
    ? String(combinedReport.patient_id)
    : legacyProps.reportId;
  const leftEyeData = combinedReport?.left_eye ?? legacyProps.leftEyeData;
  const rightEyeData = combinedReport?.right_eye ?? legacyProps.rightEyeData;

  const canRenderReport = Boolean(
    leftEyeData || rightEyeData || leftEyeImage || rightEyeImage
  );

  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPDF = () => {
    if (!targetRef.current) return;

    html2pdf()
      .set({
        margin: [0.5, 0.5],
        filename: `${patientName || patientId}-MedicalReport.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(targetRef.current)
      .save()
      .catch((err: any) => {
        console.error("html2pdf error:", err);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="report-desc"
        className="bg-[#112240] text-white max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Report Preview
          </DialogTitle>
        </DialogHeader>

        <div
          id="report-desc"
          style={{
            position: "absolute",
            left: -9999,
            top: "auto",
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          Medical report preview dialog. Shows patient data and left/right
          fundus images (if available).
        </div>

        {canRenderReport ? (
          <div className="space-y-4 p-4">
            <div className="bg-white rounded-lg p-4 max-h-[70vh] overflow-y-auto text-black">
              <div ref={targetRef}>
                <PDFReport
                  patientId={combinedReport?.composite_id ?? ""}
                  patientName={patientName}
                  examDate={examDate}
                  institutionName={institutionName}
                  leftEyeImage={leftEyeImage}
                  rightEyeImage={rightEyeImage}
                  leftEyeData={leftEyeData}
                  rightEyeData={rightEyeData}
                  physicianName={props.physicianName ?? "Dr. [Physician Name]"}
                  reportId={reportId ?? `RPT-${Date.now()}`}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={onClose}
                className="bg-gray-200 text-black hover:bg-gray-300 ml-2"
              >
                Close
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

export default ReportModal;
