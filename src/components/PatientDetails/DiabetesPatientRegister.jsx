import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DiabetesPatientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    durationOfDiabetes: '',
    hba1cLevel: '',
    bloodPressure: '',
    fastingBloodGlucose: '',
    bmi: '',
    cholesterol: '',
    age: '',
    albuminuria: '',
    visualAcuity: 'Normal', // Default value
    dateOfRegistration: new Date().toISOString().split('T')[0], // Default to today
    mobileNumber: '',
    gender: '',
    hospitalName: '',
    numVisits: '',
  });

  const [errors, setErrors] = useState({});

  // A more robust validation for the new fields
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Patient name is required.';
    if (!formData.age || formData.age <= 0) newErrors.age = 'A valid age is required.';
    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required.';
    if (!formData.dateOfRegistration) newErrors.dateOfRegistration = 'Registration date is required.';
    if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Allow numeric fields to be empty temporarily while typing
    const processedValue = type === 'number' && value === '' ? '' : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const existingPatients = JSON.parse(localStorage.getItem('diabetesPatients')) || [];
      const newPatient = { ...formData, id: Date.now() };
      existingPatients.push(newPatient);
      localStorage.setItem('diabetesPatients', JSON.stringify(existingPatients));
      
      toast.success('Patient data saved successfully!');
      navigate('/diabetes-patients');
    } else {
      toast.error('Please fill in all required fields correctly.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Diabetes Patient Registration</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-8">

        {/* Section 1: Patient Demographics */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold text-gray-700 px-2">Patient Demographics</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age <span className="text-red-500">*</span></label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
             <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
              <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>
        </fieldset>

        {/* Section 2: Clinical Measurements */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold text-gray-700 px-2">Clinical Measurements</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <div>
              <label htmlFor="hba1cLevel" className="block text-sm font-medium text-gray-700">HbA1c Level (%)</label>
              <input type="number" step="0.1" id="hba1cLevel" name="hba1cLevel" value={formData.hba1cLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label htmlFor="fastingBloodGlucose" className="block text-sm font-medium text-gray-700">Fasting Glucose (mg/dL)</label>
              <input type="number" step="0.1" id="fastingBloodGlucose" name="fastingBloodGlucose" value={formData.fastingBloodGlucose} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
              <input type="number" step="0.1" id="bloodPressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700">Cholesterol (mg/dL)</label>
              <input type="number" step="0.1" id="cholesterol" name="cholesterol" value={formData.cholesterol} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
             <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">BMI (kg/m²)</label>
              <input type="number" step="0.1" id="bmi" name="bmi" value={formData.bmi} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label htmlFor="albuminuria" className="block text-sm font-medium text-gray-700">Albuminuria (mg/g)</label>
              <input type="number" step="0.1" id="albuminuria" name="albuminuria" value={formData.albuminuria} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label htmlFor="durationOfDiabetes" className="block text-sm font-medium text-gray-700">Diabetes Duration (Yrs)</label>
              <input type="number" id="durationOfDiabetes" name="durationOfDiabetes" value={formData.durationOfDiabetes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label htmlFor="visualAcuity" className="block text-sm font-medium text-gray-700">Visual Acuity</label>
              <select id="visualAcuity" name="visualAcuity" value={formData.visualAcuity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>Normal</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
                <option>Blind</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Section 3: Administrative Details */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-semibold text-gray-700 px-2">Administrative Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div>
              <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">Hospital Name <span className="text-red-500">*</span></label>
              <input type="text" id="hospitalName" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
              {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName}</p>}
            </div>
            <div>
              <label htmlFor="dateOfRegistration" className="block text-sm font-medium text-gray-700">Date of Registration <span className="text-red-500">*</span></label>
              <input type="date" id="dateOfRegistration" name="dateOfRegistration" value={formData.dateOfRegistration} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
              {errors.dateOfRegistration && <p className="text-red-500 text-xs mt-1">{errors.dateOfRegistration}</p>}
            </div>
            <div>
              <label htmlFor="numVisits" className="block text-sm font-medium text-gray-700">Number of Visits</label>
              <input type="number" id="numVisits" name="numVisits" value={formData.numVisits} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Save Patient Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiabetesPatientRegister;