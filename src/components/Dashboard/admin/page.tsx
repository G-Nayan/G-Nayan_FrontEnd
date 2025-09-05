import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Edit, Search, X, EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EditPatientModal from "../../PatientDetails/PatientModel";
import { ReportModal } from "@/components/Analysis/ReportModal";

const apiBase = import.meta.env.VITE_API_BASE;
const API_URL = `${apiBase}/logs/get_data_from_patient`;
const COMBINED_BASE = `${apiBase}/Get_patient_Clinical_and_PREDICTION_data/combined-report`;



interface Patient {
  id: number;
  patient_id: number;
  num_visits: number;
  composite_id: string;
  name: string;
  Age: number;
  gender: string;
  mobile_number: string;
  HbA1c_Level: number;
  Fasting_Blood_Glucose: number;
  Blood_Pressure_Systolic: number;
  Blood_Pressure_Diastolic: number;
  Cholesterol: number;
  BMI: number;
  Albuminuria: number;
  Duration_of_Diabetes: number;
  Visual_Acuity: string;
  Hospital_name: string;
  Date_of_registration: string;
  assigned_doctor?: string | null;
}

interface ApiResponse {
  patient_data: Patient[];
  total_pages: number;
  current_page: number;
  total_patients: number;
}

const DiabetesPatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // server-driven page count (from API)
  const [totalPages, setTotalPages] = useState(1);
  // UI pages used for either normal or search results
  const [computedTotalPages, setComputedTotalPages] = useState(1);

  const [totalPatients, setTotalPatients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);




  const navigate = useNavigate();
  const patientsPerPage = 9; // <-- ensures 9 cards per page

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken")
    );
  };

  const makeApiRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("authToken");
      navigate("/"); // redirect to home
      throw new Error("No token found");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse);
      throw new Error("Invalid response format from API");
    }

    return await response.json();
  };

  // Fetch a single page from server
  const fetchPatients = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const data: ApiResponse = await makeApiRequest(
        `${API_URL}?page=${page}&limit=${patientsPerPage}`
      );

      if (!data.patient_data || !Array.isArray(data.patient_data)) {
        throw new Error("Invalid patient data format");
      }

      const sortedPatients = data.patient_data.sort(
        (a: Patient, b: Patient) =>
          new Date(b.Date_of_registration).getTime() -
          new Date(a.Date_of_registration).getTime()
      );

      setPatients(sortedPatients);

      const serverTotal = data.total_patients ?? data.patient_data.length;
      setTotalPatients(serverTotal);
      setTotalPages(Math.max(1, Math.ceil(serverTotal / patientsPerPage)));

      // computed pages follow server when not searching
      setComputedTotalPages(
        Math.max(1, Math.ceil(serverTotal / patientsPerPage))
      );

      setCurrentPage(page);

      console.log("Fetched patients:", sortedPatients);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Could not fetch patient data.");
      toast.error("Failed to fetch patient data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side quick search on current page
  const performSearch = (searchValue: string) => {
    if (!searchValue.trim()) {
      setIsSearching(false);
      setFilteredPatients([]);
      // restore computed pages to server pages
      setComputedTotalPages(
        Math.max(1, Math.ceil(totalPatients / patientsPerPage))
      );
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    const lowercaseSearch = searchValue.toLowerCase().trim();

    const filtered = patients.filter((patient) => {
      return (
        (patient.name || "").toLowerCase().includes(lowercaseSearch) ||
        patient.patient_id.toString().includes(lowercaseSearch) ||
        (patient.composite_id || "").toLowerCase().includes(lowercaseSearch) ||
        (patient.mobile_number || "").includes(searchValue.trim())
      );
    });

    const sortedFiltered = filtered.sort(
      (a: Patient, b: Patient) =>
        new Date(b.Date_of_registration).getTime() -
        new Date(a.Date_of_registration).getTime()
    );

    setFilteredPatients(sortedFiltered);
    setCurrentPage(1);
    setComputedTotalPages(
      Math.max(1, Math.ceil(sortedFiltered.length / patientsPerPage))
    );
    console.log("Realtime search results (current page):", sortedFiltered);
  };

  // Comprehensive server-side + client combine search across all pages
  const searchAllPatients = async (searchValue: string) => {
    if (!searchValue.trim()) {
      setIsSearching(false);
      setFilteredPatients([]);
      setComputedTotalPages(
        Math.max(1, Math.ceil(totalPatients / patientsPerPage))
      );
      setCurrentPage(1);
      return;
    }

    try {
      setIsLoading(true);
      setIsSearching(true);

      let allPatients: Patient[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const data: ApiResponse = await makeApiRequest(
            `${API_URL}?page=${page}&limit=${patientsPerPage}`
          );

          if (data.patient_data && Array.isArray(data.patient_data)) {
            allPatients = [...allPatients, ...data.patient_data];
            hasMore = page < (data.total_pages || 1);
            page++;
          } else {
            hasMore = false;
          }
        } catch (err) {
          console.error(`Error fetching search page ${page}:`, err);
          hasMore = false;
        }
      }

      const lowercaseSearch = searchValue.toLowerCase().trim();
      const filtered = allPatients.filter((patient) => {
        return (
          (patient.name || "").toLowerCase().includes(lowercaseSearch) ||
          patient.patient_id.toString().includes(lowercaseSearch) ||
          (patient.composite_id || "")
            .toLowerCase()
            .includes(lowercaseSearch) ||
          (patient.mobile_number || "").includes(searchValue.trim())
        );
      });

      const sortedFiltered = filtered.sort(
        (a: Patient, b: Patient) =>
          new Date(b.Date_of_registration).getTime() -
          new Date(a.Date_of_registration).getTime()
      );

      setFilteredPatients(sortedFiltered);
      setCurrentPage(1);
      setComputedTotalPages(
        Math.max(1, Math.ceil(sortedFiltered.length / patientsPerPage))
      );

      console.log(
        `Found ${sortedFiltered.length} patients matching "${searchValue}"`
      );

      if (sortedFiltered.length === 0) {
        toast.custom(`No patients found matching "${searchValue}"`);
      } else {
        toast.success(
          `Found ${sortedFiltered.length} patients matching "${searchValue}"`
        );
      }
    } catch (err) {
      console.error("Error searching patients:", err);
      toast.error("Failed to search patient data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      // quick local search on current page
      performSearch(value);
    } else {
      // clear quick search and show server page data
      setIsSearching(false);
      setFilteredPatients([]);
      setComputedTotalPages(
        Math.max(1, Math.ceil(totalPatients / patientsPerPage))
      );
      setCurrentPage(1);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      searchAllPatients(searchTerm);
    } else {
      setIsSearching(false);
      setFilteredPatients([]);
      setComputedTotalPages(
        Math.max(1, Math.ceil(totalPatients / patientsPerPage))
      );
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setFilteredPatients([]);
    setCurrentPage(1);
    setComputedTotalPages(
      Math.max(1, Math.ceil(totalPatients / patientsPerPage))
    );
    // If we want to refresh the server page data too:
    fetchPatients(1);
  };

  // Handle page change (validate against computedTotalPages)
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= computedTotalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // initial load
  useEffect(() => {
    fetchPatients(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch when page changes only in normal (non-search) mode
  useEffect(() => {
    if (!isSearching) {
      fetchPatients(currentPage);
    }
    // when searching we don't fetch — we slice filteredPatients locally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isSearching]);

  // Determine displayed array and slice it for pagination
  const rawDisplay = isSearching ? filteredPatients : patients;
  const startIndex = (currentPage - 1) * patientsPerPage;
  const pagedPatients = rawDisplay.slice(
    startIndex,
    startIndex + patientsPerPage
  );

  const showPagination = computedTotalPages > 1;

  if (isLoading && patients.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => fetchPatients(1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
        <p className="text-gray-600 mt-2">
          {isSearching
            ? `Search Results: ${filteredPatients.length} | Page ${currentPage} of ${computedTotalPages}`
            : `Total Patients: ${totalPatients} | Page ${currentPage} of ${computedTotalPages}`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Patient Name, ID, Mobile Number..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearchClick}
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search All
              </>
            )}
          </button>
        </div>

        {isSearching && (
          <div className="text-center mt-4">
            <button
              onClick={handleClearSearch}
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Clear Search & Show All Patients
            </button>
          </div>
        )}
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {pagedPatients.length === 0 ? (
          <div className="col-span-full text-center py-12">
            {isSearching ? (
              <div>
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  No patients found matching "{searchTerm}"
                </p>
                <p className="text-gray-500 mt-2">
                  Try different keywords or clear the search to see all patients
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-lg">
                  No patient records found
                </p>
                <button
                  onClick={() => fetchPatients(1)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        ) : (
          pagedPatients.map((patient) => (
            <PatientCard
              key={`${patient.id}-${patient.composite_id}`}
              patient={patient}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, computedTotalPages) }, (_, idx) => {
            let pageNumber;
            if (computedTotalPages <= 5) {
              pageNumber = idx + 1;
            } else if (currentPage <= 3) {
              pageNumber = idx + 1;
            } else if (currentPage >= computedTotalPages - 2) {
              pageNumber = computedTotalPages - 4 + idx;
            } else {
              pageNumber = currentPage - 2 + idx;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-md ${currentPage === pageNumber
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === computedTotalPages}
            className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading overlay for background operations */}
      {isLoading && patients.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
            <span className="text-lg">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const PatientCard = ({ patient }: { patient: Patient }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [retinoData, setRetinoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchRetinoData = async (composite_id: string) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    setLoading(true);

    try {
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      console.log("Fetching retinopathy data for patient:", composite_id);

      const res = await fetch(`${COMBINED_BASE}/${composite_id}`, {
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

      const hasLeftEyeData = data.left_eye && data.left_eye.stage !== null;
      const hasRightEyeData = data.right_eye && data.right_eye.stage !== null;

      if (hasLeftEyeData || hasRightEyeData) {
        setRetinoData(data);
        setShowModal(true);
      } else {
        toast.error("No retinopathy data found for this patient.");
      }
    } catch (err) {
      console.error("Error fetching retinopathy data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to fetch retinopathy data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRetino = async (composite_id: string) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    setLoading(true);

    try {
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      console.log("Fetching retinopathy data for patient:", composite_id);

      const res = await fetch(`${COMBINED_BASE}/${composite_id}`, {
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

      // Determine whether eye data exists
      const hasLeftEyeData = !!(
        data.left_eye &&
        (data.left_eye.stage || data.left_eye.stage === 0)
      );
      const hasRightEyeData = !!(
        data.right_eye &&
        (data.right_eye.stage || data.right_eye.stage === 0)
      );

      if (!hasLeftEyeData && !hasRightEyeData) {
        toast.error("No retinopathy data found for this patient.");
        return;
      }

      // Some backends include image URLs inside the response. If not, you can
      // preserve URLs elsewhere and pass them in. Here we try common keys:
      const safeLeftImage =
        data.left_eye?.image_url ||
        data.left_eye?.fundus_image ||
        data.left_eye?.image ||
        ""; // fallback if not found

      const safeRightImage =
        data.right_eye?.image_url ||
        data.right_eye?.fundus_image ||
        data.right_eye?.image ||
        "";

      // Attach images to the response object so ReportModal can use them
      data._leftImage = safeLeftImage;
      data._rightImage = safeRightImage;

      setRetinoData(data);

      // show modal
      setShowReportModal(true);
    } catch (err) {
      console.error("Error fetching retinopathy data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to fetch retinopathy data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientUpdate = () => {
    console.log("Patient updated successfully");
    toast.success("Patient updated successfully");
  };

  const bloodPressure = `${patient.Blood_Pressure_Systolic}/${patient.Blood_Pressure_Diastolic}`;

  const downloadReport = async () => {
    if (!patient?.composite_id) {
      toast.error("No composite id available to download report.");
      return;
    }

    const composite_id = patient.composite_id;
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    if (!token) {
      toast.error("Not authenticated. Please login.");
      return;
    }

    try {
      // Try to download PDF if backend supports it
      const pdfRes = await fetch(
        `${COMBINED_BASE}/${composite_id}?format=pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (pdfRes.ok) {
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `retinopathy_report_${composite_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Report PDF download started");
        return;
      }

      // If PDF not provided, fetch JSON and download it
      const res = await fetch(`${COMBINED_BASE}/${composite_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to fetch fallback report: ${txt}`);
      }

      const data = await res.json();
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(jsonBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `retinopathy_report_${composite_id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report JSON downloaded");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Error while attempting to download report.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
        <div className="relative p-4 bg-indigo-600 text-white rounded-t-lg">
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => fetchRetino(patient.composite_id)}
              className="hover:text-gray-300 transition-colors flex items-center gap-1 bg-white/10 px-2 py-1 rounded"
              title="View Report"
            >
              <EyeIcon size={14} />
              <span className="text-sm">Report</span>
            </button>

            <button
              onClick={() => setEditModalOpen(true)}
              className="hover:text-gray-300 transition-colors px-2 py-1 rounded"
              title="Edit Patient"
            >
              <Edit size={18} />
            </button>
          </div>

          <h2 className="text-xl font-bold pr-8">
            {patient.name?.charAt(0).toUpperCase() + patient.name?.slice(1)}
          </h2>
          <p className="text-sm opacity-90">
            {patient.Age} yrs • {patient.gender}
          </p>
          <p className="text-sm opacity-90">📞 {patient.mobile_number}</p>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 flex-grow">
          <DataPoint label="HbA1c" value={patient.HbA1c_Level} unit="%" />
          <DataPoint
            label="Glucose"
            value={patient.Fasting_Blood_Glucose}
            unit="mg/dL"
          />
          <DataPoint label="BP" value={bloodPressure} unit="mmHg" />
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
            unit="yrs"
          />
          <DataPoint
            label="Visual Acuity"
            value={patient.Visual_Acuity}
            unit=""
          />
        </div>

        <div className="p-4 bg-gray-50 border-t text-sm space-y-1">
          <p>
            <strong>Patient ID:</strong> {patient.patient_id}
          </p>
          <p>
            <strong>Composite ID:</strong> {patient.composite_id}
          </p>
          <p>
            <strong>Hospital:</strong>{" "}
            {patient.Hospital_name?.charAt(0).toUpperCase() +
              patient.Hospital_name?.slice(1)}
          </p>
          <p>
            <strong>Registration:</strong>{" "}
            {new Date(patient.Date_of_registration).toLocaleDateString()}
          </p>
          {patient.assigned_doctor && (
            <p>
              <strong>Doctor:</strong> {patient.assigned_doctor}
            </p>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <button
              onClick={() => fetchRetinoData(patient.composite_id)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Loading...
                </>
              ) : (
                "View Retinopathy Report"
              )}
            </button>

            {/* <button
              onClick={downloadReport}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Download
            </button> */}
          </div>
        </div>
      </div>

      {showModal && retinoData && (
        <RetinoModal
          data={retinoData}
          onClose={() => {
            setShowModal(false);
            setRetinoData(null);
          }}
        />
      )}

      {/* {showReportModal && retinoData && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setRetinoData(null);
          }}
          patientId={patient.composite_id}
          patientName={patient.name}
          examDate={retinoData?.timestamp || new Date().toLocaleDateString()}
          leftEyeImage={retinoData._leftImage || ""}
          rightEyeImage={retinoData._rightImage || ""}
          leftEyeData={retinoData.left_eye}
          rightEyeData={retinoData.right_eye}
        />
      )} */}

      {showReportModal && retinoData && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setRetinoData(null);
          }}
          combinedReport={retinoData}   // ✅ Just pass combinedReport
        />
      )}


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
  const leftEye = data?.left_eye || null;
  const rightEye = data?.right_eye || null;

  const hasLeftEyeData = !!leftEye?.stage;
  const hasRightEyeData = !!rightEye?.stage;
  const hasAnyData = hasLeftEyeData || hasRightEyeData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl shadow-xl relative overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Retinopathy Report</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <p>
                <strong>Name:</strong> {data?.name}
              </p>
              <p>
                <strong>Patient ID:</strong> {data?.patient_id}
              </p>
              <p>
                <strong>Age:</strong> {data?.Age} years
              </p>
              <p>
                <strong>Gender:</strong> {data?.gender}
              </p>
              <p>
                <strong>Hospital:</strong> {data?.Hospital_name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {data?.Date_of_registration
                  ? new Date(data.Date_of_registration).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {hasAnyData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-50 p-3 border-b">
                  <h3 className="text-lg font-semibold">Left Eye Analysis</h3>
                </div>
                <div className="p-4">
                  {hasLeftEyeData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p>
                          <strong>Stage:</strong> {leftEye.stage}
                        </p>
                        <p>
                          <strong>Confidence:</strong>{" "}
                          {leftEye.confidence?.toFixed(2)}%
                        </p>
                      </div>
                      <p>
                        <strong>Risk Factor:</strong> {leftEye.risk_factor}
                      </p>
                      <div>
                        <h4 className="font-semibold">Clinical Details:</h4>
                        <p className="text-sm text-gray-700">
                          {leftEye.explanation || "No explanation provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Doctor's Diagnosis:</h4>
                        <p className="text-sm text-gray-700">
                          {leftEye.doctor_diagnosis || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Recommendations:</h4>
                        <p className="text-sm text-gray-700">
                          {leftEye.recommendations ||
                            "No recommendations provided"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                        <p>
                          <strong>Scan ID:</strong> {leftEye.eye_scan_id}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {leftEye.review_status || "Pending"}
                        </p>
                        <p>
                          <strong>Timestamp:</strong>{" "}
                          {leftEye.timestamp
                            ? new Date(leftEye.timestamp).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No data available for left eye
                    </p>
                  )}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-green-50 p-3 border-b">
                  <h3 className="text-lg font-semibold">Right Eye Analysis</h3>
                </div>
                <div className="p-4">
                  {hasRightEyeData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p>
                          <strong>Stage:</strong> {rightEye.stage}
                        </p>
                        <p>
                          <strong>Confidence:</strong>{" "}
                          {rightEye.confidence?.toFixed(2)}%
                        </p>
                      </div>
                      <p>
                        <strong>Risk Factor:</strong> {rightEye.risk_factor}
                      </p>
                      <div>
                        <h4 className="font-semibold">Clinical Details:</h4>
                        <p className="text-sm text-gray-700">
                          {rightEye.explanation || "No explanation provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Doctor's Diagnosis:</h4>
                        <p className="text-sm text-gray-700">
                          {rightEye.doctor_diagnosis || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Recommendations:</h4>
                        <p className="text-sm text-gray-700">
                          {rightEye.recommendations ||
                            "No recommendations provided"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                        <p>
                          <strong>Scan ID:</strong> {rightEye.eye_scan_id}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {rightEye.review_status || "Pending"}
                        </p>
                        <p>
                          <strong>Timestamp:</strong>{" "}
                          {rightEye.timestamp
                            ? new Date(rightEye.timestamp).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No data available for right eye
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                No retinopathy data found for this patient
              </p>
            </div>
          )}

          {hasLeftEyeData && hasRightEyeData && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                Overall Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <strong>Left Eye:</strong>
                  </p>
                  <p className="text-indigo-700">
                    {leftEye.stage} ({leftEye.confidence?.toFixed(1)}%
                    confidence)
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <strong>Right Eye:</strong>
                  </p>
                  <p className="text-indigo-700">
                    {rightEye.stage} ({rightEye.confidence?.toFixed(1)}%
                    confidence)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataPoint = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: any;
  unit: string;
}) => (
  <div className="text-center">
    <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-1">
      {value !== null && value !== undefined ? value : "N/A"}{" "}
      {value !== null && value !== undefined && unit ? unit : ""}
    </p>
  </div>
);

export default DiabetesPatientList;
