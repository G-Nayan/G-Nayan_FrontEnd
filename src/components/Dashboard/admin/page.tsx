import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EditPatientModal from "../../PatientDetails/PatientModel"; // Assuming you have this component for editing patient details

const API_URL = "https://d2313bf3e038.ngrok-free.app/patients";

const COMBINED_BASE = "https://d2313bf3e038.ngrok-free.app/combined-report";

const DiabetesPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const patientsPerPage = 9;

  const searchPatientsGlobally = async (id: string) => {
    try {
      setIsLoading(true);
      setIsSearching(true);
      let allPatients: any[] = [];
      let page = 1;
      let hasMore = true;

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found. Please log in again.");
        throw new Error("No token found. Please log in again.");
      }

      while (hasMore) {
        const res = await fetch(
          `${API_URL}?page=${page}&limit=${patientsPerPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const contentType = res.headers.get("content-type");
        if (
          !res.ok ||
          !contentType ||
          !contentType.includes("application/json")
        ) {
          const text = await res.text();
          console.error("Unexpected response:", text);
          throw new Error("Invalid response format.");
        }

        const data = await res.json();
        allPatients = [...allPatients, ...data.patients];
        page++;
        hasMore = page <= data.total_pages;
      }

      const filtered = allPatients.filter((p) =>
        p.patient_id.toString().includes(id.trim())
      );

      setPatients(filtered);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to search patient data.");
      setError("Could not search patient data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Main paginated fetch (runs only when NOT searching)
  useEffect(() => {
    if (isSearching) return;

    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("No token found. Please log in again.");
          throw new Error("No token found. Please log in again.");
        }
        const response = await fetch(
          `${API_URL}?page=${currentPage}&limit=${patientsPerPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const contentType = response.headers.get("content-type");

        if (
          response.ok &&
          contentType &&
          contentType.includes("application/json")
        ) {
          const data = await response.json();
          console.log("Fetched patients:", data.patients);
          // Fixed: Convert dates to timestamps for proper arithmetic operations
          const sorted = data.patients.sort(
            (a: any, b: any) =>
              new Date(b.Date_of_registration).getTime() -
              new Date(a.Date_of_registration).getTime()
          );
          setPatients(sorted);
          setTotalPages(data.total_pages);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Network error", error);
        toast.error("Failed to fetch patient data.");
        setError("Could not fetch patient data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [currentPage, isSearching]);

  // Reset search mode when searchTerm is cleared
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchPatientsGlobally(searchTerm);
    } else {
      setIsSearching(false);
      setCurrentPage(1); // triggers normal fetch
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading patient data...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 xs:px-32 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Patient Records</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Patient ID"
          className="border border-gray-300 rounded-md p-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!isLoading && patients.length === 0 ? (
          <p className="text-center col-span-full mt-5 text-gray-600">
            {isSearching && searchTerm.trim()
              ? `No match found with Patient: ${searchTerm}`
              : "No patient records found."}
          </p>
        ) : (
          patients.map((p) => <PatientCard key={p.visit_id} patient={p} />)
        )}
      </div>

      {!isSearching && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentPage(idx + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded ${
                currentPage === idx + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PatientCard = ({ patient }: { patient: any }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [retinoData, setRetinoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchRetinoData = async (patient_id: number) => {
    // Try different token keys that might be stored
    let token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    setLoading(true);

    try {
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      console.log("Fetching retinopathy data for patient:", patient_id);

      const res = await fetch(`${COMBINED_BASE}/${patient_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("Retinopathy API response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Retinopathy API error response:", errorText);

        if (res.status === 401) {
          toast.error(
            "Authentication failed for retinopathy data. Please log in again."
          );
          return;
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await res.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error("Invalid response format from retinopathy API");
      }

      const data = await res.json();
      console.log("Retinopathy data received:", data);

      if (Array.isArray(data) && data.length > 0) {
        setRetinoData(data);
        setShowModal(true);
        // toast.success("Retinopathy data loaded successfully!");
      } else {
        toast.error("No retinopathy data found for this patient.");
      }
    } catch (err) {
      console.error("Error fetching retinopathy data:", err);
      toast.error(`Failed to fetch retinopathy data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientUpdate = () => {
    // Refresh the parent component data if needed
    console.log("Patient updated successfully");
    toast.success("Patient updated successfully");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow flex flex-col">
        <div className="relative p-3 bg-indigo-600 text-white rounded-t-lg">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-3 right-3 hover:text-gray-300"
            title="Edit Patient"
          >
            <Edit size={18} />
          </button>

          <h2 className="text-xl font-bold">
            {patient.name?.charAt(0).toUpperCase() + patient.name?.slice(1)}
          </h2>
          <p className="text-sm">
            {patient.Age} yrs, &nbsp; {patient.gender}
          </p>
          <p className="text-sm">
            Mobile number: &nbsp;
            {patient.mobile_number}
          </p>
        </div>

        <div className="p-3 grid grid-cols-2 gap-2">
          <DataPoint label="HbA1c" value={patient.HbA1c_Level} unit="%" />
          <DataPoint
            label="Glucose"
            value={patient.Fasting_Blood_Glucose}
            unit="mg/dL"
          />
          <DataPoint label="BP" value={patient.Blood_Pressure} unit="mmHg" />
          <DataPoint
            label="Cholesterol"
            value={patient.Cholesterol}
            unit="mg/dL"
          />
          <DataPoint label="BMI" value={patient.BMI} unit="kg/m²" />
          <DataPoint
            label="Albuminuria"
            value={patient.Albuminuria}
            unit="mg/dL"
          />
          <DataPoint
            label="Diabetes Duration"
            value={patient.Duration_of_Diabetes}
            unit="Yrs"
          />
          <DataPoint
            label="Visual Acuity"
            value={patient.Visual_Acuity}
            unit=""
          />
        </div>

        <div className="p-3 bg-gray-50 border-t text-sm">
          <p>
            <strong>Visit ID:</strong> {patient.visit_id}
          </p>
          <p>
            <strong>Patient ID:</strong> {patient.patient_id}
          </p>
          <p>
            <strong>Hospital:</strong>{" "}
            {patient.Hospital_name?.charAt(0).toUpperCase() +
              patient.Hospital_name?.slice(1)}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(patient.Date_of_registration).toLocaleDateString()}
          </p>
        </div>

        <div className="p-3 border-t">
          <button
            onClick={() => fetchRetinoData(patient.patient_id)}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Retinopathy"}
          </button>
        </div>
      </div>

      {/* Retinopathy Report Modal */}
      {showModal && retinoData && (
        <RetinoModal
          data={retinoData}
          onClose={() => {
            setShowModal(false);
            setRetinoData(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <EditPatientModal
          patient={patient}
          onClose={() => setEditModalOpen(false)}
          onUpdated={handlePatientUpdate}
        />
      )}
    </>
  );
};

const RetinoModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  // Process the array data to separate left and right eye data
  const leftEyeData = data.find((item: any) =>
    item.eye_scan_id?.includes("_left")
  );
  const rightEyeData = data.find((item: any) =>
    item.eye_scan_id?.includes("_right")
  );

  // Get patient info from first record
  const patientInfo = data[0] || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg p-6 pt-0 relative overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white z-10 p-3">
          <h2 className="text-2xl top-3 font-semibold mb-4 ">Retinopathy Report</h2>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 bg-gray-50 hover:text-black text-xl p-1 rounded"
          >
            X
          </button>
        </div>

        {/* Patient Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 ">
          <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <p>
              <strong>Name:</strong> {patientInfo.name}
            </p>
            <p>
              <strong>Patient ID:</strong> {patientInfo.patient_id}
            </p>
            <p>
              <strong>Age:</strong> {patientInfo.Age} years
            </p>
            <p>
              <strong>Gender:</strong> {patientInfo.gender}
            </p>
            <p>
              <strong>Hospital:</strong> {patientInfo.Hospital_name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(patientInfo.Date_of_registration).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Eye Scan Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leftEyeData && (
            <RetinoEyeSection title="Left Eye" data={leftEyeData} />
          )}
          {rightEyeData && (
            <RetinoEyeSection title="Right Eye" data={rightEyeData} />
          )}
        </div>

        {/* Summary if both eyes have data */}
        {leftEyeData && rightEyeData && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-sm">
              <strong>Left Eye:</strong> {leftEyeData.Stage} (Confidence:{" "}
              {leftEyeData.Confidence}%)
            </p>
            <p className="text-sm">
              <strong>Right Eye:</strong> {rightEyeData.Stage} (Confidence:{" "}
              {rightEyeData.Confidence}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RetinoEyeSection = ({ title, data }: { title: string; data: any }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
    <h3 className="font-semibold text-lg mb-3 text-indigo-600">{title}</h3>

    {/* Diagnosis Information */}
    <div className="mb-4 p-3 bg-red-50 rounded">
      <h4 className="font-semibold text-sm text-red-800 mb-2">Diagnosis</h4>
      <p className="text-sm">
        <strong>Stage:</strong> {data.Stage}
      </p>
      <p className="text-sm">
        <strong>Confidence:</strong> {data.Confidence}%
      </p>
      <p className="text-sm">
        <strong>Risk Factor:</strong> {data.Risk_Factor}
      </p>
    </div>

    {/* Clinical Details */}
    <div className="mb-4 p-3 bg-blue-50 rounded">
      <h4 className="font-semibold text-sm text-blue-800 mb-2">
        Clinical Details
      </h4>
      <p className="text-sm mb-2">
        <strong>Explanation:</strong>
      </p>
      <p className="text-xs text-gray-700 mb-2">{data.Explanation}</p>
      <p className="text-sm mb-2">
        <strong>Doctor's Diagnosis:</strong>
      </p>
      <p className="text-xs text-gray-700">{data.Doctors_Diagnosis}</p>
    </div>

    {/* Recommendations */}
    <div className="mb-4 p-3 bg-green-50 rounded">
      <h4 className="font-semibold text-sm text-green-800 mb-2">
        Recommendations
      </h4>
      <p className="text-xs text-gray-700 mb-2">{data.Note}</p>
      {data.Feedback && (
        <>
          <p className="text-sm mb-1">
            <strong>Patient Feedback:</strong>
          </p>
          <p className="text-xs text-gray-700">{data.Feedback}</p>
        </>
      )}
    </div>

    {/* Additional Info */}
    <div className="text-xs text-gray-500 border-t pt-2">
      <p>
        <strong>Eye Scan ID:</strong> {data.eye_scan_id}
      </p>
      <p>
        <strong>Review Status:</strong> {data.Review}
      </p>
      <p>
        <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  </div>
);

const DataPoint = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: any;
  unit: string;
}) => (
  <div>
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="text-lg font-semibold text-gray-800">
      {value ?? "N/A"} {unit && unit}
    </p>
  </div>
);

export default DiabetesPatientList;
