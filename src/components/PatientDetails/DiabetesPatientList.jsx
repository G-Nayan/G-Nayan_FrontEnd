import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/patients';
const COMBINED_BASE = 'http://localhost:8000/combined-report';

const DiabetesPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(b.Date_of_registration) - new Date(a.Date_of_registration)
        );
        setPatients(sorted);
      } catch (err) {
        setError('Could not fetch patient data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (isLoading) return <p className="text-center mt-10">Loading patient data...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!patients.length) return <p className="text-center mt-10">No patient records found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Diabetes Patient Records</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {patients.map((p) => (
          <PatientCard key={p.visit_id || p.id} patient={p} />
        ))}
      </div>
    </div>
  );
};

const PatientCard = ({ patient }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [retinoData, setRetinoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRetinoData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${COMBINED_BASE}/${patient.patient_id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const left = data.find((entry) => entry.eye_scan_id?.endsWith("left"));
      const right = data.find((entry) => entry.eye_scan_id?.endsWith("right"));
      setRetinoData({ left_eye: left, right_eye: right, email_id: data[0]?.email_id });
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching retinopathy data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow flex flex-col">
        <div className="p-5 bg-indigo-600 text-white">
          <h2 className="text-xl font-bold">{patient.name}</h2>
          <p className="text-sm">{patient.Age} yrs, {patient.gender}</p>
          <p className="text-sm">📞 {patient.mobile_number}</p>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          <DataPoint label="HbA1c" value={patient.HbA1c_Level} unit="%" />
          <DataPoint label="Glucose" value={patient.Fasting_Blood_Glucose} unit="mg/dL" />
          <DataPoint label="BP" value={patient.Blood_Pressure} unit="mmHg" />
          <DataPoint label="Cholesterol" value={patient.Cholesterol} unit="mg/dL" />
          <DataPoint label="BMI" value={patient.BMI} unit="kg/m²" />
          <DataPoint label="Albuminuria" value={patient.Albuminuria} unit="mg/g" />
          <DataPoint label="Diabetes Duration" value={patient.Duration_of_Diabetes} unit="Yrs" />
          <DataPoint label="Visual Acuity" value={patient.Visual_Acuity} />
        </div>

        <div className="p-5 bg-gray-50 border-t text-sm">
          <p><strong>Visit ID:</strong> {patient.visit_id}</p>
          <p><strong>Patient ID:</strong> {patient.patient_id}</p>
          <p><strong>Hospital:</strong> {patient.Hospital_name}</p>
          <p><strong>Date:</strong> {new Date(patient.Date_of_registration).toLocaleDateString()}</p>
        </div>

        <div className="p-5 border-t">
          <button
            onClick={fetchRetinoData}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Retinopathy'}
          </button>
        </div>
      </div>

      {modalOpen && retinoData && (
        <RetinoModal data={retinoData} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

const RetinoModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Retinopathy Report</h2>
        <p className="mb-4"><strong>Email ID:</strong> {data.email_id || 'N/A'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.left_eye && <EyeSection title="Left Eye" data={data.left_eye} />}
          {data.right_eye && <EyeSection title="Right Eye" data={data.right_eye} />}
        </div>
      </div>
    </div>
  );
};

const EyeSection = ({ title, data }) => (
  <div className="bg-gray-100 p-4 rounded shadow-sm">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    {Object.entries(data).map(([key, val]) => (
      <p key={key}>
        <strong>{key.replace(/_/g, ' ')}:</strong> {val?.toString()}
      </p>
    ))}
  </div>
);

const DataPoint = ({ label, value, unit }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="text-lg font-semibold text-gray-800">
      {value ?? 'N/A'}{unit && ` ${unit}`}
    </p>
  </div>
);

export default DiabetesPatientList;
