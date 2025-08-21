// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";

// import { Edit } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import EditPatientModal from "../PatientDetails/PatientModel"; // Assuming you have this component for editing patient details

// const API_URL = "https://791367af3e6e.ngrok-free.app/patients";

// const COMBINED_BASE = "https://791367af3e6e.ngrok-free.app/combined-report";

// const DiabetesPatientList = () => {
//   const [patients, setPatients] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   const navigate = useNavigate();

//   const patientsPerPage = 9;

//   // Search globally across all pages when Search button is clicked
//   // const searchPatientsGlobally = async (id) => {
//   //   try {
//   //     setIsLoading(true);
//   //     setIsSearching(true);
//   //     let allPatients = [];
//   //     let page = 1;
//   //     let hasMore = true;

//   //     while (hasMore) {
//   //       const res = await fetch(
//   //         `${API_URL}?page=${page}&limit=${patientsPerPage}`
//   //       );
//   //       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   //       const data = await res.json();
//   //       allPatients = [...allPatients, ...data.patients];
//   //       page++;
//   //       hasMore = page <= data.total_pages;
//   //     }

//   //     const filtered = allPatients.filter((p) =>
//   //       p.patient_id.toString().includes(id.trim())
//   //     );

//   //     setPatients(filtered);
//   //     setTotalPages(1);
//   //     setCurrentPage(1);
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to search patient data.");
//   //     setError("Could not search patient data.");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const searchPatientsGlobally = async (id) => {
//     try {
//       setIsLoading(true);
//       setIsSearching(true);
//       let allPatients = [];
//       let page = 1;
//       let hasMore = true;

//       while (hasMore) {
//         const res = await fetch(
//           `${API_URL}?page=${page}&limit=${patientsPerPage}`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );

//         const contentType = res.headers.get("content-type");
//         if (
//           !res.ok ||
//           !contentType ||
//           !contentType.includes("application/json")
//         ) {
//           const text = await res.text();
//           console.error("Unexpected response:", text);
//           throw new Error("Invalid response format.");
//         }

//         const data = await res.json();
//         allPatients = [...allPatients, ...data.patients];
//         page++;
//         hasMore = page <= data.total_pages;
//       }

//       const filtered = allPatients.filter((p) =>
//         p.patient_id.toString().includes(id.trim())
//       );

//       setPatients(filtered);
//       setTotalPages(1);
//       setCurrentPage(1);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to search patient data.");
//       setError("Could not search patient data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Main paginated fetch (runs only when NOT searching)
//   useEffect(() => {
//     if (isSearching) return;

//     // const fetchPatients = async () => {
//     //   try {
//     //     setIsLoading(true);
//     //     const res = await fetch(
//     //       `${API_URL}?page=${currentPage}&limit=${patientsPerPage}`

//     //     );
//     //     if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     //     const data = await res.json();

//     //     const sorted = data.patients.sort(
//     //       (a, b) =>
//     //         new Date(b.Date_of_registration) - new Date(a.Date_of_registration)
//     //     );

//     //     setPatients(sorted);
//     //     setTotalPages(data.total_pages);
//     //   } catch (err) {
//     //     console.error(err);
//     //     toast.error("Failed to fetch patient data.");
//     //     setError("Could not fetch patient data.");
//     //   } finally {
//     //     setIsLoading(false);
//     //   }
//     // };
//     const fetchPatients = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(
//           `${API_URL}?page=${currentPage}&limit=${patientsPerPage}`,

//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );

//         const contentType = response.headers.get("content-type");


//         if (
//           response.ok &&
//           contentType &&
//           contentType.includes("application/json")
//         ) {
//           const data = await response.json();
//           console.log("Fetched patients:", data.patients);
//           const sorted = data.patients.sort(
//             (a, b) =>
//               new Date(b.Date_of_registration) -
//               new Date(a.Date_of_registration)
//           );
//           setPatients(sorted);
//           setTotalPages(data.total_pages); // ✅ required for page buttons
//         }
//       } catch (error) {
//         console.error("Network error", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPatients();
//   }, [currentPage, isSearching]);

//   //  NEW: reset search mode when searchTerm is cleared
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setIsSearching(false);
//       setCurrentPage(1);
//     }
//   }, [searchTerm]);

//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       searchPatientsGlobally(searchTerm);
//     } else {
//       setIsSearching(false);
//       setCurrentPage(1); // triggers normal fetch
//     }
//   };

//   if (isLoading)
//     return <p className="text-center mt-10">Loading patient data...</p>;
//   if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 xs:px-32 py-8">
//       <h1 className="text-3xl font-bold text-center mb-8">Patient Records</h1>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Search by Patient ID"
//           className="border border-gray-300 rounded-md p-2 w-full"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           Search
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//         {!isLoading && patients.length === 0 ? (
//           <p className="text-center col-span-full mt-5 text-gray-600">
//             {isSearching && searchTerm.trim()
//               ? `No match found with Patient: ${searchTerm}`
//               : "No patient records found."}
//           </p>
//         ) : (
//           patients.map((p) => <PatientCard key={p.visit_id} patient={p} />)
//         )}
//       </div>

//       {!isSearching && (
//         <div className="flex justify-center mt-8 space-x-2">
//           {Array.from({ length: totalPages }, (_, idx) => (
//             <button
//               key={idx}
//               onClick={() => {
//                 setCurrentPage(idx + 1);
//                 window.scrollTo({ top: 0, behavior: "smooth" });
//               }}
//               className={`px-4 py-2 rounded ${
//                 currentPage === idx + 1
//                   ? "bg-indigo-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {idx + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const PatientCard = ({ patient }) => {
//   const [modalOpen, setModalOpen] = useState(false); // Retino modal
//   const [editModalOpen, setEditModalOpen] = useState(false); // Edit modal
//   const [retinoData, setRetinoData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchRetinoData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${COMBINED_BASE}/${patient.patient_id}`,

//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             "ngrok-skip-browser-warning": "true",
//           },
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => null);
//         const errorMessage =
//           errorData?.detail || errorData?.message || `HTTP ${res.status}`;
//         throw new Error(errorMessage);
//       }

//       const data = await res.json();
//       const left = data.find((entry) => entry.eye_scan_id?.endsWith("left"));
//       const right = data.find((entry) => entry.eye_scan_id?.endsWith("right"));

//       setRetinoData({
//         left_eye: left,
//         right_eye: right,
//         email_id: data[0]?.email_id,
//       });
//       setModalOpen(true);
//     } catch (err) {
//       console.error("Error fetching retinopathy data:", err);
//       toast.error(
//         "Failed to fetch data(give feedback and upload eye images): " +
//           err.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow flex flex-col">
//         <div className="relative p-3 bg-indigo-600 text-white rounded-t-lg">
//           <button
//             onClick={() => setEditModalOpen(true)}
//             className="absolute top-3 right-3 hover:text-gray-300"
//             title="Edit Patient"
//           >
//             <Edit size={18} />
//           </button>

//           <h2 className="text-xl font-bold  ">
//             {patient.name.charAt(0).toUpperCase() + patient.name.slice(1)}
//           </h2>
//           <p className="text-sm">
//             {patient.Age} yrs, &nbsp; {patient.gender}
//           </p>
//           <p className="text-sm ">
//             Mobile number: &nbsp;
//             {patient.mobile_number}
//           </p>
//         </div>

//         <div className="p-3 grid grid-cols-2 gap-">
//           <DataPoint label="HbA1c" value={patient.HbA1c_Level} unit="%" />
//           <DataPoint
//             label="Glucose"
//             value={patient.Fasting_Blood_Glucose}
//             unit="mg/dL"
//           />
//           <DataPoint label="BP" value={patient.Blood_Pressure} unit="mmHg" />
//           <DataPoint
//             label="Cholesterol"
//             value={patient.Cholesterol}
//             unit="mg/dL"
//           />
//           <DataPoint label="BMI" value={patient.BMI} unit="kg/m²" />
//           <DataPoint
//             label="Albuminuria"
//             value={patient.Albuminuria}
//             unit="mg/dL"
//           />
//           <DataPoint
//             label="Diabetes Duration"
//             value={patient.Duration_of_Diabetes}
//             unit="Yrs"
//           />
//           <DataPoint label="Visual Acuity" value={patient.Visual_Acuity} />
//         </div>

//         <div className="p-3 bg-gray-50 border-t text-sm">
//           <p>
//             <strong>Visit ID:</strong> {patient.visit_id}
//           </p>
//           <p>
//             <strong>Patient ID:</strong> {patient.patient_id}
//           </p>
//           <p>
//             <strong>Hospital:</strong>

//             {patient.Hospital_name.charAt(0).toUpperCase() +
//               patient.Hospital_name.slice(1)}
//           </p>
//           <p>
//             <strong>Date:</strong>{" "}
//             {new Date(patient.Date_of_registration).toLocaleDateString()}
//           </p>
//         </div>

//         <div className="p-3 border-t">
//           <button
//             onClick={fetchRetinoData}
//             disabled={loading}
//             className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//           >
//             {loading ? "Loading..." : "Retinopathy"}
//           </button>
//         </div>
//       </div>

//       {/* Retinopathy Report Modal */}
//       {modalOpen && retinoData && (
//         <RetinoModal data={retinoData} onClose={() => setModalOpen(false)} />
//       )}

//       {/* Edit Modal */}
//       {editModalOpen && (
//         <EditPatientModal
//           patient={patient}
//           onClose={() => setEditModalOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// const RetinoModal = ({ data, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
//       <button
//         onClick={onClose}
//         className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
//       >
//         &times;
//       </button>
//       <h2 className="text-xl font-semibold mb-4">Retinopathy Report</h2>
//       <p className="mb-4">
//         <strong>Email ID:</strong> {data.email_id || "N/A"}
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {data.left_eye && <EyeSection title="Left Eye" data={data.left_eye} />}
//         {data.right_eye && (
//           <EyeSection title="Right Eye" data={data.right_eye} />
//         )}
//       </div>
//     </div>
//   </div>
// );

// const EyeSection = ({ title, data }) => (
//   <div className="bg-gray-100 p-4 rounded shadow-sm">
//     <h3 className="font-semibold text-lg mb-2">{title}</h3>
//     {Object.entries(data).map(([key, val]) => (
//       <p key={key}>
//         <strong>{key.replace(/_/g, " ")}:</strong> {val?.toString()}
//       </p>
//     ))}
//   </div>
// );

// const DataPoint = ({ label, value, unit }) => (
//   <div>
//     <p className="text-xs text-gray-500 uppercase">{label}</p>
//     <p className="text-lg font-semibold text-gray-800">
//       {value ?? "N/A"} {unit && unit}
//     </p>
//   </div>
// );

// export default DiabetesPatientList;



import React from "react";



export default function  page() {
  return (
    <div>
      
    </div>
  )
}