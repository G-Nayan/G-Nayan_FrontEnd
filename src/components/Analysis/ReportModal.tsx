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
import AIRAlogo from "../../assets/G-nayanalogo.png";

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

// ------------- PDFReport (renders the content to print/export) -------------
const PDFReport = (props: Omit<ReportModalProps, "isOpen" | "onClose" | "combinedReport"> & { patientId?: string }) => {
  const {
    patientId,
    leftEyeImage,
    rightEyeImage,
    leftEyeData,
    rightEyeData,
    patientName = "Patient Name",
    gender = "Not Specified",
    examDate = new Date().toISOString(),
    physicianName = "Dr. [Physician Name]",
    institutionName = "[Institution Name]",
    reportId = `RPT-${Date.now()}`,
  } = props;

  const ImageBox = ({ src, alt }: { src?: string; alt?: string }) =>
    src ? (
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block", borderRadius: 6 }}
      />
    ) : (
      <div style={{
        width: "100%", height: 180, display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px dashed #ddd", background: "#fafafa", color: "#666", fontSize: 12, borderRadius: 6
      }}>
        No image available
      </div>
    );

  const renderEye = (label: string, img?: string, data?: EyeData) => {
    const stage = data?.stage ?? data?.Stage ?? "N/A";
    const confidence = data?.confidence != null ? `${Number(data.confidence).toFixed(2)}%` : "N/A";
    const risk = data?.risk_factor ?? data?.Risk_Factor ?? "N/A";
    const explanation = data?.explanation ?? data?.note ?? data?.Note ?? "No explanation provided";

    return (
      <div style={{ width: "48%", display: "inline-block", verticalAlign: "top" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{label}</div>
        <div style={{ marginBottom: 8 }}>
          <ImageBox src={img} alt={`${label} fundus`} />
        </div>
        <div style={{ fontSize: 12, color: "#222" }}>
          <p><strong>Stage:</strong> {stage}</p>
          <p><strong>Confidence:</strong> {confidence}</p>
          <p><strong>Risk factor:</strong> {risk}</p>
          <p style={{ marginTop: 6 }}><strong>Clinical notes:</strong><br />{explanation}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#fff", color: "#111", fontFamily: "Times, serif", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={AIRAlogo} alt="logo" style={{ height: 48 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{institutionName}</div>
            <div style={{ fontSize: 12, color: "#555" }}>Retinopathy Analysis Report</div>
          </div>
        </div>

        <div style={{ textAlign: "right", fontSize: 12 }}>
          <div><strong>Report ID:</strong> {reportId}</div>
          <div><strong>Date:</strong> {examDate ? new Date(examDate).toLocaleString() : new Date().toLocaleString()}</div>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: "1px solid #e6e6e6", margin: "10px 0 16px" }} />

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Patient Information</div>
        <div style={{ display: "flex", gap: 24, marginTop: 8, fontSize: 12 }}>
          <div><strong>Name:</strong> {patientName}</div>
          <div><strong>Composite ID:</strong> {patientId}</div>
          <div><strong>Gender:</strong> {gender}</div>
        </div>
      </div>

      <div style={{ marginTop: 6 }}>
        {renderEye("Left Eye", leftEyeImage, leftEyeData)}
        <div style={{ display: "inline-block", width: "4%" }} />
        {renderEye("Right Eye", rightEyeImage, rightEyeData)}
      </div>

      <div style={{ marginTop: 18, fontSize: 12 }}>
        <h4 style={{ marginBottom: 6 }}>Summary & Recommendations</h4>
        <p><strong>Left:</strong> {leftEyeData?.stage ?? leftEyeData?.Stage ?? "N/A"} — {leftEyeData?.explanation ?? leftEyeData?.note ?? "No notes"}.</p>
        <p><strong>Right:</strong> {rightEyeData?.stage ?? rightEyeData?.Stage ?? "N/A"} — {rightEyeData?.explanation ?? rightEyeData?.note ?? "No notes"}.</p>
        <div style={{ marginTop: 12 }}><strong>Physician:</strong> {physicianName}</div>
      </div>

      <div style={{ marginTop: 26, fontSize: 10, color: "#666" }}>
        <em>Note: This is an automated analysis. Clinical decisions should be verified by a qualified ophthalmologist.</em>
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
  const IMAGE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
  const IMAGE_ENDPOINT = `${IMAGE_API_BASE}/Get_patient_Clinical_and_PREDICTION_data/patient-image`;

  // Helper: fetch a URL and return object URL (or undefined)
  const fetchUrlToObjectUrl = async (url: string) => {
    try {
      console.debug("[ReportModal] fetching URL -> blob:", url);
      const token = localStorage.getItem("token") || "";
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } : { "ngrok-skip-browser-warning": "true" },
      });
      if (!res.ok) {
        console.warn("[ReportModal] Image fetch returned non-ok", { url, status: res.status });
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
  const resolveImageCandidate = async (candidate?: string | null) : Promise<string | undefined> => {
    if (!candidate) return undefined;

    // candidate is something like: "P002-V001/left_image.jpg"
    // Or candidate may be "http://localhost:8000/patient-image/P002-V001/left_image.jpg"
    // 1) If it's a full URL and it contains '/patient-image/', prefer to extract path after that and call IMAGE_ENDPOINT/<encoded-filename>
    if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
      if (candidate.includes("/patient-image/")) {
        const parts = candidate.split("/patient-image/");
        const filename = parts[parts.length - 1]; // e.g. P002-V001/left_image.jpg
        if (filename) {
          const fileEndpoint = `${IMAGE_ENDPOINT}/${encodeURIComponent(filename)}`;
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
      try { URL.revokeObjectURL(u); } catch (e) { /* ignore */ }
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
      createdObjectUrls.current.forEach((u) => { try { URL.revokeObjectURL(u); } catch (e) { } });
      createdObjectUrls.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, combinedReport]);

  // report metadata
  const patientId = combinedReport?.composite_id ?? legacyProps.patientName ?? "";
  const patientName = combinedReport?.name ?? legacyProps.patientName;
  const gender = combinedReport?.gender ?? legacyProps.gender;
  const examDate = combinedReport?.left_eye?.timestamp ?? combinedReport?.right_eye?.timestamp ?? legacyProps.examDate;
  const institutionName = combinedReport?.Hospital_name ?? legacyProps.institutionName;
  const reportId = combinedReport?.patient_id ? String(combinedReport.patient_id) : legacyProps.reportId;
  const leftEyeData = combinedReport?.left_eye ?? legacyProps.leftEyeData;
  const rightEyeData = combinedReport?.right_eye ?? legacyProps.rightEyeData;

  const canRenderReport = Boolean(leftEyeData || rightEyeData || leftEyeImage || rightEyeImage);

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
      <DialogContent aria-describedby="report-desc" className="bg-[#112240] text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Report Preview
          </DialogTitle>
        </DialogHeader>

        <div id="report-desc" style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
          Medical report preview dialog. Shows patient data and left/right fundus images (if available).
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
              <Button onClick={onClose} className="bg-gray-200 text-black hover:bg-gray-300 ml-2">
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
