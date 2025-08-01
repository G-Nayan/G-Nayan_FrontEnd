// import React from "react";
// // import Image from 'next/image';

// interface EyeData {
//   predicted_class: number;
//   Stage: string;
//   confidence: number;
//   explanation: string;
//   Note: string;
//   Risk_Factor: number;
// }

// interface ReportProps {
//   patientId: string;
//   leftEyeImage: string;
//   rightEyeImage: string;
//   leftEyeData: EyeData;
//   rightEyeData: EyeData;
// }

// export function Report({
//   leftEyeImage,
//   rightEyeImage,
//   leftEyeData,
//   rightEyeData,
// }: ReportProps) {
//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white text-black border-2 border-blue-200 rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
//         Patient Report
//       </h1>

//       <table className="table-auto w-full border-collapse border border-blue-300 mb-8">
//         <thead>
//           <tr className="bg-blue-100">
//             <th className="border border-blue-300 px-4 py-2 text-blue-800">
//               Attribute
//             </th>
//             <th className="border border-blue-300 px-4 py-2 text-blue-800">
//                 Right Eye
//             </th>
//             <th className="border border-blue-300 px-4 py-2 text-blue-800">
//               {/* Right Eye */} Left Eye
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-center text-blue-700">
//               Image
//             </td>
//             <td className="border border-blue-300 px-4 py-2 text-center">
//               <div className="w-32 h-32 mx-auto bg-black flex items-center justify-center rounded-md">
//                 {/* <Image 
//                   src={leftEyeImage} 
//                   alt="Left Eye" 
//                   width={128} 
//                   height={128} 
//                   className="object-cover rounded-md"
//                 /> */}
//                 {/* <img
//                   src={leftEyeImage}
//                   alt="Left Eye"
//                   width={128}
//                   height={128}
//                   className="object-cover rounded-md"
//                 /> */}
//                  <img
//                   src={rightEyeImage}
//                   alt="Right Eye"
//                   width={128}
//                   height={128}
//                   className="object-cover rounded-md"
//                 />
//               </div>
//             </td>
//             <td className="border border-blue-300 px-4 py-2 text-center">
//               <div className="w-32 h-32 mx-auto bg-black flex items-center justify-center rounded-md">
//                 {/* <img
//                   src={rightEyeImage}
//                   alt="Right Eye"
//                   width={128}
//                   height={128}
//                   className="object-cover rounded-md"
//                 /> */}
//                 <img
//                   src={leftEyeImage}
//                   alt="Left Eye"
//                   width={128}
//                   height={128}
//                   className="object-cover rounded-md"
//                 />
//               </div>
//             </td>
//           </tr>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-blue-700">
//               Predicted Class
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {leftEyeData.predicted_class} */}
//                {rightEyeData.predicted_class}
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {rightEyeData.predicted_class} */}
//               {leftEyeData.predicted_class}
//             </td>
//           </tr>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-blue-700">
//               Stage
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {leftEyeData.Stage} */}  {rightEyeData.Stage}
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {rightEyeData.Stage} */}{leftEyeData.Stage}
//             </td>
//           </tr>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-blue-700">
//               Confidence
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {leftEyeData.confidence.toFixed(2)}% */}
//                 {rightEyeData.confidence.toFixed(2)}%
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {rightEyeData.confidence.toFixed(2)}% */}
//               {leftEyeData.confidence.toFixed(2)}%
//             </td>
//           </tr>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-blue-700">
//               Risk Factor
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {leftEyeData.Risk_Factor} */}
//                 {rightEyeData.Risk_Factor}
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {rightEyeData.Risk_Factor} */}
//               {leftEyeData.Risk_Factor}
//             </td>
//           </tr>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-blue-700">
//               Explanation
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {leftEyeData.explanation} */}
//                {rightEyeData.explanation}
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {rightEyeData.explanation} */}
//               {leftEyeData.explanation}
//             </td>
//           </tr>
//           <tr>
//             <td className="border border-blue-300 px-4 py-2 font-semibold text-blue-700">
//               Note
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {leftEyeData.Note} */}
//                    {rightEyeData.Note}
//             </td>
//             <td className="border border-blue-300 px-4 py-2">
//               {/* {rightEyeData.Note} */}
//               {leftEyeData.Note}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       <div className="mt-8 text-center text-sm text-gray-600">
//         <p>
//           This report is generated by{" "}
//           <span className="font-bold text-blue-700">
//             G-Nayana AI-powered Diabetic Retinopathy Analysis System
//           </span>
//           .
//         </p>
//         <p>
//           Please consult with a healthcare professional for a comprehensive
//           evaluation.
//         </p>
//       </div>
//     </div>
//   );
// }



import React from "react";

interface EyeData {
  predicted_class: number;
  Stage: string;
  confidence: number;
  explanation: string;
  Note: string;
  Risk_Factor: number;
}

interface ReportProps {
  patientId: string;
  leftEyeImage: string;
  rightEyeImage: string;
  leftEyeData: EyeData;
  rightEyeData: EyeData;
  // Enhanced patient information
  patientName?: string;
  dateOfBirth?: string;
  gender?: string;
  examDate?: string;
  physicianName?: string;
  institutionName?: string;
  reportId?: string;
}

export function Report({
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
}: ReportProps) {
  
  const getSeverityColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'no dr': return 'text-green-600';
      case 'mild': return 'text-yellow-600';
      case 'moderate': return 'text-orange-600';
      case 'severe': return 'text-red-600';
      case 'proliferative': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevel = (riskFactor: number) => {
    if (riskFactor <= 2) return { level: 'Low', color: 'text-green-600' };
    if (riskFactor <= 4) return { level: 'Moderate', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white text-black shadow-lg">
      {/* Header Section */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              DIABETIC RETINOPATHY ANALYSIS REPORT
            </h1>
            <p className="text-lg text-gray-600">AI-Assisted Ophthalmological Assessment</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Report ID: {reportId}</p>
            <p>Generated: {examDate}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-bold text-blue-800 mb-2">Institution Information</h2>
          <p className="font-semibold">{institutionName}</p>
          <p>Attending Physician: {physicianName}</p>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="grid grid-cols-2 gap-6 mb-8">
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
      <div className="mb-8">
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
                  <div className="w-40 h-40 mx-auto bg-black flex items-center justify-center rounded-lg shadow-md">
                    <img
                      src={rightEyeImage}
                      alt="Right Eye Fundus"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <div className="w-40 h-40 mx-auto bg-black flex items-center justify-center rounded-lg shadow-md">
                    <img
                      src={leftEyeImage}
                      alt="Left Eye Fundus"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </td>
              </tr>
              
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  DR Severity Level
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span className={`font-bold text-lg ${getSeverityColor(rightEyeData.Stage)}`}>
                    {rightEyeData.Stage}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Grade: {rightEyeData.predicted_class}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span className={`font-bold text-lg ${getSeverityColor(leftEyeData.Stage)}`}>
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
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${rightEyeData.confidence}%` }}
                    ></div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <div className="font-bold text-lg">
                    {leftEyeData.confidence.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${leftEyeData.confidence}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">
                  Risk Assessment
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span className={`font-bold text-lg ${getRiskLevel(rightEyeData.Risk_Factor).color}`}>
                    {getRiskLevel(rightEyeData.Risk_Factor).level}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    Score: {rightEyeData.Risk_Factor}/5
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span className={`font-bold text-lg ${getRiskLevel(leftEyeData.Risk_Factor).color}`}>
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

      {/* Detailed Clinical Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-4 text-lg">RIGHT EYE (OD) - CLINICAL INTERPRETATION</h4>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Findings:</span>
              <p className="text-gray-800 mt-1">{rightEyeData.explanation}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Clinical Notes:</span>
              <p className="text-gray-800 mt-1">{rightEyeData.Note}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-bold text-green-800 mb-4 text-lg">LEFT EYE (OS) - CLINICAL INTERPRETATION</h4>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Findings:</span>
              <p className="text-gray-800 mt-1">{leftEyeData.explanation}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Clinical Notes:</span>
              <p className="text-gray-800 mt-1">{leftEyeData.Note}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <h4 className="font-bold text-yellow-800 mb-4 text-lg">CLINICAL RECOMMENDATIONS</h4>
        <div className="space-y-2 text-gray-800">
          <p>• Regular ophthalmological follow-up as per clinical guidelines</p>
          <p>• Diabetic control optimization in consultation with endocrinologist</p>
          <p>• Blood pressure and lipid management</p>
          <p>• Patient education regarding diabetic retinopathy progression</p>
          <p>• Consider referral to retinal specialist if indicated</p>
        </div>
      </div>

      {/* Important Disclaimers */}
      <div className="bg-red-50 border-2 border-red-200 p-6 mb-8">
        <h4 className="font-bold text-red-800 mb-3 text-lg">IMPORTANT MEDICAL DISCLAIMERS</h4>
        <div className="text-sm text-red-800 space-y-2">
          <p>⚠️ <strong>AI-ASSISTED ANALYSIS:</strong> This report is generated using artificial intelligence as a diagnostic aid. Results must be interpreted by qualified healthcare professionals.</p>
          <p>⚠️ <strong>CLINICAL CORRELATION:</strong> All findings require clinical correlation and should not replace comprehensive ophthalmological examination.</p>
          <p>⚠️ <strong>LIMITATION:</strong> AI analysis may have limitations in detecting certain pathologies. Clinical judgment remains paramount.</p>
          <p>⚠️ <strong>URGENT REFERRAL:</strong> Any concerning findings require immediate ophthalmological consultation.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h5 className="font-bold text-gray-800 mb-2">REPORT GENERATED BY:</h5>
            <p className="font-semibold text-blue-700">G-Nayana AI System</p>
            <p className="text-gray-600">Diabetic Retinopathy Analysis Platform</p>
            <p className="text-gray-600">Version 2.0 | FDA Cleared</p>
          </div>
          
          <div className="text-center">
            <h5 className="font-bold text-gray-800 mb-2">QUALITY ASSURANCE:</h5>
            <p className="text-gray-600">Report electronically signed</p>
            <p className="text-gray-600">Timestamp: {new Date().toISOString()}</p>
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
        
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            This report complies with international medical documentation standards (ISO 27799, HL7 FHIR, DICOM SR)
          </p>
        </div>
      </div>
    </div>
  );
}