import { useState, useEffect } from 'react';

const DiabetesPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We use a different key in localStorage to keep data separate
    const storedPatients = JSON.parse(localStorage.getItem('diabetesPatients')) || [];
    setPatients(storedPatients.sort((a, b) => b.id - a.id)); // Show newest first
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading patient data...</p>;
  }

  if (patients.length === 0) {
    return (
        <div className="text-center text-gray-500 mt-10 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">No Diabetes Patient Data Found</h2>
            <p className="mt-2">Use the "Diabetes Register" page to add new patient records.</p>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Diabetes Patient Records</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {patients.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300">
            {/* Card Header */}
            <div className="p-5 bg-indigo-600 text-white">
              <h2 className="text-2xl font-bold truncate">{p.name}</h2>
              <p className="text-sm opacity-90">{p.age} years old, {p.gender}</p>
              <p className="text-sm opacity-90 mt-1">📞 {p.mobileNumber}</p>
            </div>

            {/* Card Body with Clinical Data */}
            <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-3 flex-grow">
              <DataPoint label="HbA1c" value={p.hba1cLevel} unit="%" />
              <DataPoint label="Fasting Glucose" value={p.fastingBloodGlucose} unit="mg/dL" />
              <DataPoint label="Blood Pressure" value={p.bloodPressure} unit="mmHg" />
              <DataPoint label="Cholesterol" value={p.cholesterol} unit="mg/dL" />
              <DataPoint label="BMI" value={p.bmi} unit="kg/m²" />
              <DataPoint label="Albuminuria" value={p.albuminuria} unit="mg/g" />
              <DataPoint label="Diabetes Duration" value={p.durationOfDiabetes} unit="Yrs" />
              <DataPoint label="Visual Acuity" value={p.visualAcuity} />
            </div>

            {/* Card Footer */}
            <div className="p-5 bg-gray-50 border-t text-sm text-gray-600">
                <p><strong>Hospital:</strong> {p.hospitalName}</p>
                <p><strong>Registered On:</strong> {p.dateOfRegistration}</p>
                <p><strong>Total Visits:</strong> {p.numVisits || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper component for consistent data display
const DataPoint = ({ label, value, unit }) => (
  <div>
    <p className="text-xs text-gray-500 font-medium uppercase">{label}</p>
    <p className="text-lg font-semibold text-gray-800">
      {value || 'N/A'}
      {value && unit && <span className="text-sm font-normal text-gray-600 ml-1">{unit}</span>}
    </p>
  </div>
);


export default DiabetesPatientList;