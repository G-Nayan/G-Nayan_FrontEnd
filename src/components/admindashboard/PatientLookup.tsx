import React, { useState } from "react";

const PatientLookup = () => {
  const [compositeId, setCompositeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleSearch = async () => {
    if (!compositeId) {
      setError("Please enter a Composite ID");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const getAuthToken = () => {
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("authToken")
      );
    };

    try {
      const token = getAuthToken();

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("authToken");
        throw new Error("No token found");
      }

      const response = await fetch(
        `http://localhost:8000/Get_patient_Clinical_and_PREDICTION_data/combined-report/${compositeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderDataAsCards = (obj: any) => {
    if (typeof obj !== "object" || obj === null) return null;

    return Object.entries(obj).map(([key, value]) => (
      <div
        key={key}
        className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition mb-3"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-1 capitalize">
          {key.replace(/_/g, " ")}
        </h3>
        {typeof value === "object" && value !== null ? (
          <div className="pl-2">{renderDataAsCards(value)}</div>
        ) : (
          <p className="text-gray-900 text-sm">{String(value)}</p>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-500 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Search Patient by Composite ID
      </h1>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Enter Composite ID (e.g. P001-V001)"
          value={compositeId}
          onChange={(e) => setCompositeId(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {data && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Patient Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderDataAsCards(data)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientLookup;
