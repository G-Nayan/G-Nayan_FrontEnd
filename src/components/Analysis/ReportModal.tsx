// "use client";

// import React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Report } from "./Report";

// import { usePDF } from '@react-pdf/renderer';

// interface ReportModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   patientId: string;
//   leftEyeImage: string | null;
//   rightEyeImage: string | null;
//   leftEyeData: EyeData | undefined;
//   rightEyeData: EyeData | undefined;
// }

// interface EyeData {
//   predicted_class: number;
//   Stage: string;
//   confidence: number;
//   explanation: string;
//   Note: string;
//   Risk_Factor: number;
// }

// export function ReportModal({
//   isOpen,
//   onClose,
//   patientId,
//   leftEyeImage,
//   rightEyeImage,
//   leftEyeData,
//   rightEyeData,
// }: ReportModalProps) {
//   const { toPDF, targetRef } = usePDF({filename: `G-Nayana-PatientID-${patientId}-Report.pdf`});

//   // Check if we have all the necessary data to render the report
//   const canRenderReport = leftEyeImage && rightEyeImage && leftEyeData && rightEyeData;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="bg-[#112240] text-white max-w-4xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Report Preview</DialogTitle>
//         </DialogHeader>
//         {canRenderReport ? (
//           <div ref={targetRef}>
//             <Report
//               patientId={patientId}
//               leftEyeImage={leftEyeImage}
//               rightEyeImage={rightEyeImage}
//               leftEyeData={leftEyeData}
//               rightEyeData={rightEyeData}
//             />
//           </div>
//         ) : (
//           <p>Unable to generate report. Some required data is missing.</p>
//         )}
//         <DialogFooter>
//           <Button onClick={onClose} variant="outline" className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white">
//             Close
//           </Button>
//           {canRenderReport && (
//             <Button onClick={() => toPDF()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
//               Download Report
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Report } from "./Report";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

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
}

export function ReportModal({
  isOpen,
  onClose,
  patientId,
  leftEyeImage,
  rightEyeImage,
  leftEyeData,
  rightEyeData,
}: ReportModalProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const canRenderReport = leftEyeImage && rightEyeImage && leftEyeData && rightEyeData;

  const handleDownloadPDF = async () => {
    if (!targetRef.current) return;

    const dataUrl = await toPng(targetRef.current);
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`G-Nayana-PatientID-${patientId}-Report.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#112240] text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>

        {canRenderReport ? (
          <div ref={targetRef}>
            <Report
              patientId={patientId}
              leftEyeImage={leftEyeImage}
              rightEyeImage={rightEyeImage}
              leftEyeData={leftEyeData}
              rightEyeData={rightEyeData}
            />
          </div>
        ) : (
          <p>Unable to generate report. Some required data is missing.</p>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            Close
          </Button>

          {canRenderReport && (
            <Button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Download Report
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
