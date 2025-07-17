"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Info, MessageSquareWarning } from "lucide-react"; // Added MessageSquareWarning
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
import { ReportModal } from "@/components/Analysis/ReportModal";

// ... (interfaces and helper components remain the same)
interface EyeResult {
  predicted_class: number;
  confidence: number;
  explanation: string;
  Risk_Factor: number;
  Stage: string;
  Note: string;
}

interface ApiResponse {
  left_eye?: EyeResult;
  right_eye?: EyeResult;
  message?: string;
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

interface FeedbackData {
  patient_id: string;
  email_id: string;
  left_eye: EyeResult & {
    feedback: string;
    doctors_diagnosis: string;
    review: string;
  };
  right_eye: EyeResult & {
    feedback: string;
    doctors_diagnosis: string;
    review: string;
  };
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
        <motion.div
          key={item.name}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            <span className="text-sm font-bold text-gray-100">
              {item.displayValue}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-5">
            <motion.div
              className="h-5 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${
                  item.isPredictionClass
                    ? ((item.value + 1) / 4) * 100
                    : item.value
                }%`,
                backgroundColor: getColorForValue(
                  item.value,
                  item.isConfidence || false,
                  item.isPredictionClass || false
                ),
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${
                  item.isPredictionClass
                    ? ((item.value + 1) / 4) * 100
                    : item.value
                }%`,
              }}
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

const MovingImage = ({
  src,
  alt,
  isMoving,
  isAnalyzing,
}: {
  src: string;
  alt: string;
  isMoving: boolean;
  isAnalyzing: boolean;
}) => {
  const handleAnimationComplete = () => {};
  return (
    <motion.div
      className="relative w-full max-w-[300px] h-[300px] mx-auto overflow-hidden"
      animate={isMoving ? { x: [0, 10, -10, 0] } : { x: 0 }}
      transition={{
        repeat: isMoving ? Infinity : 0,
        duration: 4,
        ease: "easeInOut",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover z-0 rounded-md"
      />
      <div className="absolute inset-0 z-10">
        <ModelRender
          isAnalyzing={isAnalyzing}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>
    </motion.div>
  );
};

export function Analysis() {
  const [leftEyeImage, setLeftEyeImage] = useState<File | null>(null);
  const [rightEyeImage, setRightEyeImage] = useState<File | null>(null);
  const [leftEyePreview, setLeftEyePreview] = useState<string | null>(null);
  const [rightEyePreview, setRightEyePreview] = useState<string | null>(null);
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

    if (!modalPatientId.trim()) {
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

    try {
      const resp = await fetch(
        `http://192.168.11.101:8000/infer_for_diabetic_retinopathy/upload%20images?patient_id=${encodeURIComponent(
          modalPatientId
        )}`,
        { method: "POST", body: formData }
      );
      if (!resp.ok) {
        const errorData = await resp
          .json()
          .catch(() => ({ detail: `HTTP error! status: ${resp.status}` }));
        throw new Error(
          errorData.detail || `HTTP error! status: ${resp.status}`
        );
      }
      const data: ApiResponse = await resp.json();
      if (data.message || data.error) {
        const apiErrorMessage =
          data.message || data.error || "An error occurred during analysis.";
        setError(apiErrorMessage);
        toast.error(apiErrorMessage);
        setShowInputCard(true);
        setShowBenefitsInitially(true);
        return;
      }
      setApiData(data);
      setShowInputCard(false);
      toast.success("Analysis complete! Please provide feedback.");
      // DO NOT auto-open feedback modal here anymore
      // setShowFeedbackModal(true);
    } catch (e) {
      const errorMessage =
        (e as Error).message || "An unknown error occurred during analysis.";
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

  const handleFeedbackSubmit = async (fb: FeedbackData) => {
    const payload = {
      patient_id: modalPatientId,
      email_id: "iscs-client_hospital@gmail.com",
      left_eye: { ...apiData?.left_eye!, ...fb.left_eye },
      right_eye: { ...apiData?.right_eye!, ...fb.right_eye },
    };
    try {
      const resp = await fetch(
        "http://192.168.11.101:8000/submit_feedback_from_frontend/from_json_to_db/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!resp.ok) {
        const errorData = await resp
          .json()
          .catch(() => ({ detail: `HTTP error! status: ${resp.status}` }));
        throw new Error(
          errorData.detail || `HTTP error! status: ${resp.status}`
        );
      }
      await resp.json();
      setFeedbackSubmitted(true);
      setShowFeedbackModal(false);
      toast.success("Feedback submitted! Opening report...");
      setShowReportModal(true);
    } catch (e) {
      toast.error(`Failed to submit feedback: ${(e as Error).message}`);
    }
  };

  const handleOpenFeedbackModal = () => {
    if (apiData) {
      // Only open if analysis data is present
      setShowFeedbackModal(true);
    } else {
      toast.error("Please complete the analysis first.");
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false); // Always close it
    if (apiData && !feedbackSubmitted) {
      // If analysis was done but feedback not submitted yet
      toast.error("Feedback is required to generate the report.", {
        icon: <MessageSquareWarning className="text-yellow-400" />,
      });
    }
  };

  const handleGetReport = () => {
    if (!apiData) {
      toast.error("Please complete the analysis first.");
      return;
    }
    if (!feedbackSubmitted) {
      toast.error(
        "Feedback is required to view the report. Please provide feedback.",
        { icon: <MessageSquareWarning className="text-yellow-400" /> }
      );
      setShowFeedbackModal(true); // Guide user back to feedback
      return;
    }
    setShowReportModal(true);
  };

  const handleGoBack = () => {
    if (apiData && !feedbackSubmitted) {
      toast.error(
        "Please provide feedback for the current analysis before starting a new one.",
        { icon: <MessageSquareWarning className="text-yellow-400" /> }
      );
      setShowFeedbackModal(true); // Re-open feedback modal
      return; // Prevent reset
    }

    // Proceed with reset
    setShowInputCard(true);
    setShowBenefitsInitially(true);
    setApiData(null);
    setLeftEyeImage(null);
    setRightEyeImage(null);
    setLeftEyePreview(null);
    setRightEyePreview(null);
    setFeedbackSubmitted(false);
    setShowReportModal(false);
    setShowFeedbackModal(false);
    setError(null);
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#0A192F]">
        <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          {/* ... Hero section JSX ... */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-20">
            <div className="w-full h-full border-2 border-white/20 rounded-full" />
            <div className="absolute inset-4 border-2 border-white/20 rounded-full" />
            <div className="absolute inset-8 border-2 border-white/20 rounded-full" />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-20">
            <div className="w-full h-full border-2 border-white/20 rounded-full" />
            <div className="absolute inset-4 border-2 border-white/20 rounded-full" />
            <div className="absolute inset-8 border-2 border-white/20 rounded-full" />
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-red-400/20 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl text-center">
              <span className="inline-block relative">
                {" "}
                G-NAYANA
                <svg
                  viewBox="0 0 624 28"
                  fill="none"
                  className="absolute top-full left-0 w-full xl:-mt-2"
                >
                  <defs>
                    <linearGradient
                      id="threeColorGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 25C142.5 3.5 290.5 3.5 621 25"
                    stroke="url(#threeColorGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 tracking-wide leading-relaxed max-w-4xl text-center mt-6">
              Empowering healthcare with cutting-edge AI to detect diabetic
              retinopathy early and safeguard vision.
            </p>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {showInputCard && (
              <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#112240] text-white">
                <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 rounded-t-lg">
                  <CardTitle className="text-xl font-semibold text-center text-white">
                    Diabetic Retinopathy Report Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {" "}
                  {/* ... Image Upload JSX ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-300">
                        Right Eye Image
                      </p>
                      <FileUpload
                        onChange={(file) => handleImageUpload(file, "right")}
                      />
                      {rightEyePreview && (
                        <div className="mt-2 flex items-center justify-center relative overflow-hidden">
                          <MovingImage
                            src={rightEyePreview}
                            alt="Right Eye Preview"
                            isMoving={isMoving}
                            isAnalyzing={isAnalyzing}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-300">
                        Left Eye Image
                      </p>
                      <FileUpload
                        onChange={(file) => handleImageUpload(file, "left")}
                      />
                      {leftEyePreview && (
                        <div className="mt-2 flex items-center justify-center relative overflow-hidden">
                          <MovingImage
                            src={leftEyePreview}
                            alt="Left Eye Preview"
                            isMoving={isMoving}
                            isAnalyzing={isAnalyzing}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#1A2C4E] p-4 flex flex-col items-center rounded-b-lg">
                  <Button
                    onClick={handleSubmitAnalysisImages}
                    disabled={
                      isLoading ||
                      isSubmittingPatientId ||
                      !leftEyeImage ||
                      !rightEyeImage
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center text-base disabled:opacity-50"
                  >
                    {isLoading || isSubmittingPatientId
                      ? "Processing..."
                      : "Submit Analysis"}
                    {!(isLoading || isSubmittingPatientId) && (
                      <ArrowRight className="ml-2 h-5 w-5" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {apiData && !showInputCard && (
              <>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <EyeAnalysisCard eye="Right" data={apiData.right_eye!} />
                  <EyeAnalysisCard eye="Left" data={apiData.left_eye!} />
                </motion.div>

                {/* Buttons after analysis results are shown */}
                <div className="flex flex-col items-center justify-center mt-8 space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                  {!feedbackSubmitted ? (
                    <Button
                      onClick={handleOpenFeedbackModal}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-base shadow-lg animate-pulse" // Added animate-pulse for attraction
                    >
                      <MessageSquareWarning className="mr-2 h-5 w-5" /> Provide
                      Feedback (Required)
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGetReport} // This will now open the report directly
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-base shadow-lg"
                    >
                      View Report
                    </Button>
                  )}
                  <Button
                    onClick={handleGoBack}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-base"
                  >
                    Analyze New Images
                  </Button>
                </div>
              </>
            )}

            {showInputCard && showBenefitsInitially && <Benefits />}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          {/* ... Patient ID Modal JSX ... */}
          <DialogContent className="bg-[#112240] text-white border-indigo-500">
            <DialogHeader>
              <DialogTitle className="text-white">Enter Patient ID</DialogTitle>
              <DialogDescription className="text-gray-400">
                {" "}
                Please enter the Patient ID to proceed with the analysis.{" "}
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Patient ID"
              value={modalPatientId}
              onChange={(e) => setModalPatientId(e.target.value)}
              className="w-full border-indigo-400 focus:border-indigo-300 focus:ring-indigo-300 bg-[#1A2C4E] text-white placeholder-gray-500"
            />
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="text-gray-300 border-gray-500 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePatientIdSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={
                  !modalPatientId.trim() || isSubmittingPatientId || isLoading
                }
              >
                {isSubmittingPatientId ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {apiData && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={handleCloseFeedbackModal} // Use new handler
            leftEyePreview={leftEyePreview || ""}
            rightEyePreview={rightEyePreview || ""}
            onSubmitFeedback={handleFeedbackSubmit}
            patientId={modalPatientId}
            leftEyeData={apiData.left_eye!}
            rightEyeData={apiData.right_eye!}
          />
        )}

        {apiData && feedbackSubmitted && (
          <ReportModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            patientId={modalPatientId}
            leftEyeImage={leftEyePreview}
            rightEyeImage={rightEyePreview}
            leftEyeData={apiData.left_eye}
            rightEyeData={apiData.right_eye}
          />
        )}

        <ErrorModal
          isOpen={!!error}
          onClose={() => setError(null)}
          errorMessage={error || ""}
        />
      </div>
    </>
  );
}

export default function AnalysisPage() {
  return <Analysis />;
}
