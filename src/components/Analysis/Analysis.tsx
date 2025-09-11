"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Info } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import ErrorModal from "@/components/Analysis/ErrorModal";
import ModelRender from "@/components/Analysis/model-render";
import Benefits from "@/components/Analysis/Benefits";
import { FeedbackModal } from "@/components/Analysis/FeedbackModal";
import ReportModal from "@/components/Analysis/ReportModal";

const apiBase = import.meta.env.VITE_API_BASE || "";

interface EyeResult {
  predicted_class: number;
  Stage: string;
  confidence: number;
  explanation: string;
  Note: string;
  Risk_Factor: number;
}

interface PatientInfo {
  composite_id: string;
  name: string;
  Hospital_name: string;
  gender: string;
  assigned_doctor?: string;
}

interface ApiResponse {
  message?: string;
  patient_id?: string;
  results?: {
    left_eye?: EyeResult;
    right_eye?: EyeResult;
  };
  patient_info?: PatientInfo;
  error?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  displayValue: string;
  markers?: { position: number; label: string }[];
  isConfidence?: boolean;
  isPredictionClass?: boolean;
}

const getTooltipContent = (itemName: string): string => {
  switch (itemName) {
    case "Prediction Class":
      return "The model evaluates and indicates the Stage of diabetic retinopathy it has identified in your case.";
    case "Confidence":
      return "This shows how sure the model is about its prediction, with a higher number meaning more certainty.";
    case "Risk_Factor":
      return "This indicates the chance that your condition might get worse over time.";
    default:
      return "";
  }
};

const getColorForValue = (
  value: number,
  isConfidence: boolean,
  isPredictionClass: boolean
): string => {
  if (isPredictionClass) {
    switch (value) {
      case 0:
        return "hsl(120, 100%, 35%)";
      case 1:
        return "hsl(60, 81.81818181818183%, 65.49019607843137%)";
      case 2:
        return "hsl(30, 100%, 50%)";
      case 3:
        return "hsl(0, 100%, 50%)";
      default:
        return "hsl(0, 0%, 50%)";
    }
  } else if (isConfidence) {
    if (value <= 33) return "hsl(0, 100%, 50%)";
    if (value <= 66) return "hsl(30, 100%, 50%)";
    return "hsl(120, 100%, 35%)";
  } else {
    if (value <= 25) return "hsl(120, 100%, 35%)";
    if (value <= 50) return "hsl(60, 81.81818181818183%, 65.49019607843137%)";
    if (value <= 75) return "hsl(30, 100%, 50%)";
    return "hsl(0, 100%, 50%)";
  }
};

const CustomBarChart = ({ data }: { data: ChartDataItem[] }) => {
  return (
    <div className="space-y-6">
      {data.map((item) => (
        <motion.div key={item.name} className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-300 flex items-center">
              {item.name}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-1 h-4 w-4 text-gray-400 " />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1A2C4E] text-white rounded-lg border border-gray-600 shadow-lg p-2">
                    <p>{getTooltipContent(item.name)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="text-sm font-bold text-gray-100">{item.displayValue}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-5">
            <motion.div
              className="h-5 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${item.isPredictionClass ? ((item.value + 1) / 4) * 100 : item.value}%`,
                backgroundColor: getColorForValue(item.value, item.isConfidence || false, item.isPredictionClass || false),
              }}
              initial={{ width: 0 }}
              animate={{ width: `${item.isPredictionClass ? ((item.value + 1) / 4) * 100 : item.value}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          {item.markers && (
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              {item.markers.map((marker, idx) => (
                <div key={idx} className="text-center" style={{ width: "25%" }}>
                  {marker.label}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const EyeAnalysisCard = ({ eye, data }: { eye: string; data: EyeResult }) => {
  const { Stage, confidence, explanation, Risk_Factor, predicted_class } = data;
  const chartData: ChartDataItem[] = [
    {
      name: "Prediction Class",
      value: predicted_class,
      displayValue: Stage,
      markers: [
        { position: 25, label: "No DR" },
        { position: 50, label: "Mild" },
        { position: 75, label: "Severe" },
        { position: 100, label: "Proliferative" },
      ],
      isPredictionClass: true,
    },
    {
      name: "Confidence",
      value: confidence,
      displayValue: `${confidence.toFixed(2)}%`,
      markers: [
        { position: 33, label: "Low" },
        { position: 66, label: "Medium" },
        { position: 100, label: "High" },
      ],
      isConfidence: true,
    },
    {
      name: "Risk_Factor",
      value: Risk_Factor,
      displayValue: `${Risk_Factor.toFixed(2)}%`,
      markers: [
        { position: 25, label: "Low" },
        { position: 50, label: "Medium" },
        { position: 75, label: "High" },
        { position: 100, label: "Very High" },
      ],
    },
  ];

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#112240] text-white">
      <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold mb-2 flex items-center">
          <Eye className="mr-2" /> {eye} Eye Analysis
        </CardTitle>
        <Separator className="my-3 bg-white/20" />
        <CardDescription className="text-lg mt-3 font-medium text-white/90">
          {Stage.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <CustomBarChart data={chartData} />
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t border-gray-700 p-4 bg-[#1A2C4E]">
        <div className="text-sm font-medium mb-1 text-gray-300">Note:</div>
        <div className="text-sm text-gray-400">
          {explanation.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

const MovingImage = ({ src, alt, isMoving, isAnalyzing }: { src: string; alt: string; isMoving: boolean; isAnalyzing: boolean }) => {
  const handleAnimationComplete = () => {};
  return (
    <motion.div className="relative w-full max-w-[300px] h-[300px] mx-auto overflow-hidden" animate={isMoving ? { x: [0, 10, -10, 0] } : { x: 0 }} transition={{ repeat: isMoving ? Infinity : 0, duration: 4, ease: "easeInOut" }}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover z-0 rounded-md" />
      <div className="absolute inset-0 z-10">
        <ModelRender isAnalyzing={isAnalyzing} onAnimationComplete={handleAnimationComplete} />
      </div>
    </motion.div>
  );
};

export function Analysis() {
  const [leftEyeImage, setLeftEyeImage] = useState<File | null>(null);
  const [rightEyeImage, setRightEyeImage] = useState<File | null>(null);
  const [leftEyePreview, setLeftEyePreview] = useState<string | undefined>();
  const [rightEyePreview, setRightEyePreview] = useState<string | undefined>();
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInputCard, setShowInputCard] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmittingPatientId, setIsSubmittingPatientId] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPatientId, setModalPatientId] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBenefitsInitially, setShowBenefitsInitially] = useState(true);

  const [compositeId, setCompositeId] = useState("");

  useEffect(() => {
    const savedCompositeId = localStorage.getItem("composite_id");
    if (savedCompositeId) setCompositeId(savedCompositeId);
  }, []);

  const handleImageUpload = (file: File | null, eye: "left" | "right") => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (eye === "left") {
      setLeftEyeImage(file);
      setLeftEyePreview(url);
    } else {
      setRightEyeImage(file);
      setRightEyePreview(url);
    }
    setError(null);
  };

  const handleSubmitAnalysisImages = () => {
    if (!leftEyeImage || !rightEyeImage) {
      setError("Please upload both eye images.");
      toast.error("Please upload both eye images.");
      return;
    }
    setIsModalOpen(true);
  };

  const handlePatientIdSubmit = async () => {
    if (isSubmittingPatientId || isLoading) return;
    if (!compositeId.trim()) {
      setError("Please enter a Patient ID.");
      toast.error("Please enter a Patient ID.");
      return;
    }

    setIsSubmittingPatientId(true);
    setIsModalOpen(false);
    setIsLoading(true);
    setError(null);
    setIsMoving(true);
    setIsAnalyzing(true);
    setShowBenefitsInitially(false);

    const formData = new FormData();
    formData.append("left_image", leftEyeImage!);
    formData.append("right_image", rightEyeImage!);

    const token = localStorage.getItem("token") || localStorage.getItem("access_token") || localStorage.getItem("authToken") || "";

    try {
      const resp = await fetch(`${apiBase}/prediction/infer_for_diabetic_retinopathy/upload_images?patient_id=${encodeURIComponent(compositeId)}`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ detail: `HTTP error! status: ${resp.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${resp.status}`);
      }

      const dataRaw = await resp.json().catch(() => ({}));
      const data: ApiResponse = dataRaw;

      console.log("API Response:", data);

      if (data.message && data.message.toLowerCase().includes("error")) {
        const apiErrorMessage = data.message || "An error occurred during analysis.";
        setError(apiErrorMessage);
        toast.error(apiErrorMessage);
        setShowInputCard(true);
        setShowBenefitsInitially(true);
        return;
      }

      if (data.error) {
        const apiErrorMessage = data.error || "An error occurred during analysis.";
        setError(apiErrorMessage);
        toast.error(apiErrorMessage);
        setShowInputCard(true);
        setShowBenefitsInitially(true);
        return;
      }

      // Normalize: extract results either from .results or top-level properties if present
      const leftEyeData = (data.results && data.results.left_eye) ?? (data as any).left_eye ?? undefined;
      const rightEyeData = (data.results && data.results.right_eye) ?? (data as any).right_eye ?? undefined;

      if (!leftEyeData && !rightEyeData) {
        setError("No analysis results received. Please try again.");
        toast.error("No analysis results received. Please try again.");
        setShowInputCard(true);
        setShowBenefitsInitially(true);
        return;
      }

      // Ensure patient_info exists
      const patientInfo = data.patient_info ?? { composite_id: compositeId, name: "", Hospital_name: "", gender: "" };

      // Build normalized response
      const normalized: ApiResponse = {
        message: data.message,
        patient_id: data.patient_id ?? compositeId,
        results: {
          left_eye: leftEyeData,
          right_eye: rightEyeData,
        },
        patient_info: patientInfo,
        error: data.error,
      };

      setApiData(normalized);
      setModalPatientId(patientInfo.composite_id ?? compositeId);
      setShowInputCard(false);

      if (leftEyeData && rightEyeData) {
        toast.success("Analysis complete for both eyes!");
      } else if (leftEyeData) {
        toast.success("Analysis complete for left eye!");
      } else if (rightEyeData) {
        toast.success("Analysis complete for right eye!");
      }
    } catch (e) {
      console.error("API Error:", e);
      const errorMessage = (e as Error).message || "An unknown error occurred during analysis.";
      setError(errorMessage);
      toast.error(errorMessage);
      setShowInputCard(true);
      setShowBenefitsInitially(true);
    } finally {
      setIsLoading(false);
      setIsMoving(false);
      setIsAnalyzing(false);
      setIsSubmittingPatientId(false);
    }
  };

  const handleOpenFeedbackModal = () => setShowFeedbackModal(true);
  const handleCloseFeedbackModal = () => setShowFeedbackModal(false);
  const handleFeedbackSubmit = (feedbackData: any) => {
    setFeedbackSubmitted(true);
    setShowFeedbackModal(false);
    toast.success("Feedback submitted successfully!");
  };

  const handleGetReport = () => {
    if (!apiData) {
      toast.error("Please complete the analysis first.");
      return;
    }
    if (!apiData.results?.left_eye && !apiData.results?.right_eye) {
      toast.error("No retinopathy data found for this patient.");
      return;
    }
    setShowReportModal(true);
  };

  const handleGoBack = () => {
    setShowInputCard(true);
    setShowBenefitsInitially(true);
    setApiData(null);
    setLeftEyeImage(null);
    setRightEyeImage(null);
    setLeftEyePreview(undefined);
    setRightEyePreview(undefined);
    setFeedbackSubmitted(false);
    setShowReportModal(false);
    setShowFeedbackModal(false);
    setError(null);
    setModalPatientId("");
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#0A192F]">
        <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl text-center">
              <span className="inline-block relative">G-NAYANA</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 tracking-wide leading-relaxed max-w-4xl text-center mt-6">
              Empowering healthcare with cutting-edge AI to detect diabetic retinopathy early and safeguard vision.
            </p>
          </div>
        </div>

        <div className="flex-1 p-0">
          <div className="max-w-6xl mx-auto">
            {showInputCard && (
              <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#112240] text-white">
                <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 rounded-t-lg">
                  <CardTitle className="text-xl font-semibold text-center text-white">Diabetic Retinopathy Report Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-300">Right Eye Image</p>
                      <FileUpload onChange={(file) => handleImageUpload(file, "right")} />
                      {rightEyePreview && <div className="mt-2 flex items-center justify-center relative overflow-hidden"><MovingImage src={rightEyePreview} alt="Right Eye Preview" isMoving={isMoving} isAnalyzing={isAnalyzing} /></div>}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-300">Left Eye Image</p>
                      <FileUpload onChange={(file) => handleImageUpload(file, "left")} />
                      {leftEyePreview && <div className="mt-2 flex items-center justify-center relative overflow-hidden"><MovingImage src={leftEyePreview} alt="Left Eye Preview" isMoving={isMoving} isAnalyzing={isAnalyzing} /></div>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#1A2C4E] p-4 flex flex-col items-center rounded-b-lg">
                  <Button onClick={handleSubmitAnalysisImages} disabled={isLoading || isSubmittingPatientId || !leftEyeImage || !rightEyeImage} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center text-base disabled:opacity-50">
                    {isLoading || isSubmittingPatientId ? "Processing..." : "Submit Analysis"}
                    {!(isLoading || isSubmittingPatientId) && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {apiData && !showInputCard && (
              <>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  {apiData.results?.right_eye && <EyeAnalysisCard eye="Right" data={apiData.results.right_eye} />}
                  {apiData.results?.left_eye && <EyeAnalysisCard eye="Left" data={apiData.results.left_eye} />}

                  {!apiData.results?.right_eye && apiData.results?.left_eye && (
                    <Card className="w-full shadow-lg bg-[#112240] text-white border-gray-600">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                        <Eye className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-center">Right eye analysis not available</p>
                      </CardContent>
                    </Card>
                  )}

                  {!apiData.results?.left_eye && apiData.results?.right_eye && (
                    <Card className="w-full shadow-lg bg-[#112240] text-white border-gray-600">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                        <Eye className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-center">Left eye analysis not available</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>

                <div className="flex flex-col items-center justify-center mt-8 space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                  <Button onClick={handleGetReport} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-base shadow-lg">View Report</Button>
                  <Button onClick={handleGoBack} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-base">Analyze New Images</Button>
                </div>
              </>
            )}

            {showInputCard && showBenefitsInitially && <Benefits />}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-[#112240] text-white border-indigo-500">
            <DialogHeader>
              <DialogTitle className="text-white">Enter Patient ID</DialogTitle>
              <DialogDescription className="text-gray-400">Please enter the Patient ID to proceed with the analysis.</DialogDescription>
            </DialogHeader>
            <Input type="text" value={compositeId} onChange={(e) => setCompositeId(e.target.value)} placeholder="Enter Composite ID" className="w-full border-indigo-400 focus:border-indigo-300 focus:ring-indigo-300 bg-[#1A2C4E] text-white placeholder-gray-500" />
            <DialogFooter>
              <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="text-gray-300 border-gray-500 hover:bg-gray-700 hover:text-white">Cancel</Button>
              <Button type="button" onClick={handlePatientIdSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!compositeId.trim() || isSubmittingPatientId || isLoading}>
                {isSubmittingPatientId ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {apiData && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={handleCloseFeedbackModal}
            leftEyePreview={leftEyePreview || ""}
            rightEyePreview={rightEyePreview || ""}
            onSubmitFeedback={handleFeedbackSubmit}
            patientId={modalPatientId}
            leftEyeData={apiData.results?.left_eye as any}
            rightEyeData={apiData.results?.right_eye as any}
          />
        )}

        {apiData && (
          <ReportModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            patientId={apiData.patient_info?.composite_id ?? modalPatientId}
            patientName={apiData.patient_info?.name}
            gender={apiData.patient_info?.gender}
            institutionName={apiData.patient_info?.Hospital_name}
            physicianName={apiData.patient_info?.assigned_doctor || "Not Mentiond"}
            leftEyeImage={leftEyePreview}
            rightEyeImage={rightEyePreview}
            leftEyeData={apiData.results?.left_eye}
            rightEyeData={apiData.results?.right_eye}
          />
        )}

        <ErrorModal isOpen={!!error} onClose={() => setError(null)} errorMessage={error || ""} />
      </div>
    </>
  );
}

export default function AnalysisPage() {
  return <Analysis />;
}
