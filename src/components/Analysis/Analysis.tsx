"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Info } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription, // Added for EyeAnalysisCard if needed, or can be removed
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
import ModelRender from "@/components/Analysis/model-render"; // Assuming this is correct path
import Benefits from "@/components/Analysis/Benefits"; // Assuming this is correct path
import { FeedbackModal } from "@/components/Analysis/FeedbackModal"; // Assuming this is correct path
import { ReportModal } from "@/components/Analysis/ReportModal"; // Assuming this is correct path

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

// --- Components from Code A (Styling Focused) ---

const getTooltipContent = (itemName: string): string => {
  switch (itemName) {
    case "Prediction Class":
      return "The model evaluates and indicates the Stage of diabetic retinopathy it has identified in your case.";
    case "Confidence":
      return "This shows how sure the model is about its prediction, with a higher number meaning more certainty.";
    case "Risk_Factor": // In Code A this was "Risk"
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
        return "hsl(120, 100%, 35%)"; // Green for No DR
      case 1:
        return "hsl(60, 81.81818181818183%, 65.49019607843137%)"; // Yellow for Moderate DR
      case 2:
        return "hsl(30, 100%, 50%)"; // Orange for Severe DR
      case 3:
        return "hsl(0, 100%, 50%)"; // Red for Proliferative DR
      default:
        return "hsl(0, 0%, 50%)"; // Gray for unknown
    }
  } else if (isConfidence) {
    if (value <= 33) return "hsl(0, 100%, 50%)"; // Red for Low
    if (value <= 66) return "hsl(30, 100%, 50%)"; // Orange for Medium
    return "hsl(120, 100%, 35%)"; // Green for High
  } else {
    // For Risk_Factor
    if (value <= 25) return "hsl(120, 100%, 35%)"; // Green for Low
    if (value <= 50) return "hsl(60, 81.81818181818183%, 65.49019607843137%)"; // Yellow for Medium-Low
    if (value <= 75) return "hsl(30, 100%, 50%)"; // Orange for Medium-High
    return "hsl(0, 100%, 50%)"; // Red for High
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
    }, // Changed name to "Risk_Factor" to match tooltip
  ];

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#112240] text-white">
      <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold mb-2 flex items-center">
          <Eye className="mr-2" /> {eye} Eye Analysis
        </CardTitle>
        <Separator className="my-3 bg-white/20" />
        {/* CardDescription in Code A was used for Stage, here Stage is in chartData */}
        <CardDescription className="text-lg mt-3 font-medium text-white/90">
          {/* Displaying Stage here as it was in Code A's CardDescription */}
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
      className="relative w-full max-w-[300px] h-[300px] mx-auto overflow-hidden" // Made responsive
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
      />{" "}
      {/* Added rounded-md */}
      <div className="absolute inset-0 z-10">
        <ModelRender
          isAnalyzing={isAnalyzing}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>
    </motion.div>
  );
};

// --- Main Analysis Component (Merged) ---
export function Analysis() {
  const [leftEyeImage, setLeftEyeImage] = useState<File | null>(null);
  const [rightEyeImage, setRightEyeImage] = useState<File | null>(null);
  const [leftEyePreview, setLeftEyePreview] = useState<string | null>(null);
  const [rightEyePreview, setRightEyePreview] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInputCard, setShowInputCard] = useState(true);
  const [isMoving, setIsMoving] = useState(false); // For MovingImage animation
  const [isAnalyzing, setIsAnalyzing] = useState(false); // For ModelRender animation

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
    setError(null); // Clear error on new upload
  };

  const handleSubmit = () => {
    if (!leftEyeImage || !rightEyeImage) {
      setError("Please upload both eye images.");
      toast.error("Please upload both eye images.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!modalPatientId) {
      setError("Please enter a Patient ID.");
      toast.error("Please enter a Patient ID.");
      return;
    }
    setIsModalOpen(false);
    setIsLoading(true);
    setError(null);
    setIsMoving(true); // Start moving image animation
    setIsAnalyzing(true); // Start model render animation
    setShowBenefitsInitially(false); // Hide benefits section

    const formData = new FormData();
    formData.append("left_image", leftEyeImage!);
    formData.append("right_image", rightEyeImage!);

    try {
      const resp = await fetch(
        `http://localhost:8000/infer_for_diabetic_retinopathy/upload%20images?patient_id=${encodeURIComponent(
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
        setError(data.message || data.error);
        toast.error(
          data.message || data.error || "An error occurred during analysis."
        );
        setShowInputCard(true); // Keep input card if error
        setShowBenefitsInitially(true); // Show benefits again
        return;
      }
      setApiData(data);
      setShowInputCard(false);
      setShowFeedbackModal(true); // Show feedback modal immediately after successful analysis
      toast.success("Analysis complete! Please provide feedback.");
    } catch (e) {
      const errorMessage =
        (e as Error).message || "An unknown error occurred during analysis.";
      setError(errorMessage);
      toast.error(errorMessage);
      setShowInputCard(true); // Keep input card on error
      setShowBenefitsInitially(true); // Show benefits again
    } finally {
      setIsLoading(false);
      setIsMoving(false); // Stop moving image animation
      setIsAnalyzing(false); // Stop model render animation
    }
  };

  const handleFeedbackSubmit = async (fb: FeedbackData) => {
    const payload = {
      patient_id: modalPatientId,
      email_id: "iscs-client_hospital@gmail.com", // Hardcoded as in Code A
      left_eye: { ...apiData?.left_eye, ...fb.left_eye },
      right_eye: { ...apiData?.right_eye, ...fb.right_eye },
    };
    try {
      const resp = await fetch(
        "http://localhost:8000/submit_feedback_from_frontend/from_json_to_db/",
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

  const handleGetReport = () => {
    // Modified to match Code B logic (report after feedback)
    if (!feedbackSubmitted) {
      toast.error("Please submit feedback first to view the report.");
      setShowFeedbackModal(true); // Re-open feedback if not submitted
      return;
    }
    setShowReportModal(true);
  };

  const handleGoBack = () => {
    setShowInputCard(true);
    setShowBenefitsInitially(true); // Show benefits again
    setApiData(null);
    setLeftEyeImage(null);
    setRightEyeImage(null);
    setLeftEyePreview(null);
    setRightEyePreview(null);
    // setModalPatientId(""); // Keep patient ID if they want to re-analyze with same ID but new images
    setFeedbackSubmitted(false);
    setShowReportModal(false);
    setError(null);
  };

  return (
    <>
      {/* <Head> is for Next.js pages/app directory, not directly in client components like this */}
      {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/> */}
      {/* <Toaster position="top-center" /> */}

      <div className="relative min-h-screen w-full bg-[#0A192F]">
        {/* Hero Section from Code A */}
        <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
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
            {" "}
            {/* Adjusted padding */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl text-center">
              <span className="inline-block relative">
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

        {/* Content Area */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                </CardContent>
                <CardFooter className="bg-[#1A2C4E] p-4 flex flex-col items-center rounded-b-lg">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !leftEyeImage || !rightEyeImage} // Disable if no images
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center text-base disabled:opacity-50" // Larger button
                  >
                    {isLoading ? "Analyzing..." : "Submit Analysis"}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {apiData &&
              !showInputCard &&
              !showReportModal && ( // Show analysis cards if data exists and not showing report yet
                <>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <EyeAnalysisCard eye="Left" data={apiData.left_eye!} />
                    <EyeAnalysisCard eye="Right" data={apiData.right_eye!} />
                  </motion.div>
                  {/* Buttons are shown after analysis, before report OR after feedback submitted */}
                  <div className="flex justify-center mt-8 space-x-4">
                    <Button
                      onClick={handleGetReport}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                      disabled={!feedbackSubmitted} // Enabled only after feedback
                    >
                      Get Report
                    </Button>
                    {!feedbackSubmitted && (
                      <Button
                        onClick={() => setShowFeedbackModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                      >
                        Give Feedback
                      </Button>
                    )}
                    {(feedbackSubmitted ||
                      (!showFeedbackModal && !apiData)) && ( // Show Go Back if feedback done OR if we are back at input stage
                      <Button
                        onClick={handleGoBack}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                      >
                        Analyze New Images
                      </Button>
                    )}
                  </div>
                </>
              )}

            {showInputCard && showBenefitsInitially && <Benefits />}
          </div>
        </div>

        {/* Patient ID Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-[#112240] text-white border-indigo-500">
            <DialogHeader>
              <DialogTitle className="text-white">Enter Patient ID</DialogTitle>
              <DialogDescription className="text-gray-400">
                Please enter the Patient ID to proceed with the analysis.
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
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="text-gray-300 border-gray-500 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleModalSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!modalPatientId.trim()}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feedback Modal (Uses Shadcn Dialog internally) */}
        {apiData && ( // Only render FeedbackModal if apiData is available
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => {
              // if (!feedbackSubmitted) toast.error("Feedback is required to view the report.");
              setShowFeedbackModal(false); // Allow closing even if feedback not submitted yet
            }}
            leftEyePreview={leftEyePreview || ""}
            rightEyePreview={rightEyePreview || ""}
            onSubmitFeedback={handleFeedbackSubmit}
            patientId={modalPatientId}
            leftEyeData={
              apiData.left_eye || {
                predicted_class: 0,
                Stage: "",
                confidence: 0,
                explanation: "",
                Note: "",
                Risk_Factor: 0,
              }
            }
            rightEyeData={
              apiData.right_eye || {
                predicted_class: 0,
                Stage: "",
                confidence: 0,
                explanation: "",
                Note: "",
                Risk_Factor: 0,
              }
            }
            // Ensure FeedbackModal itself uses DialogContent with bg-[#112240] text-white if it's a separate Dialog
          />
        )}

        {/* Report Modal */}
        {apiData && ( // Only render ReportModal if apiData is available
          <ReportModal
            isOpen={showReportModal}
            onClose={() => {
              setShowReportModal(false);
              // Optionally, if closing report means starting over:
              // handleGoBack();
            }}
            patientId={modalPatientId}
            leftEyeImage={leftEyePreview}
            rightEyeImage={rightEyePreview}
            leftEyeData={apiData.left_eye}
            rightEyeData={apiData.right_eye}
            // Ensure ReportModal itself uses DialogContent with bg-[#112240] text-white
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
  return (
    // The main div for bg is now inside Analysis component
    <Analysis />
  );
}
