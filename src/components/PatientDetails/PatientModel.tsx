import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SuccessAnimation from "./SuccessAnimation";

const EditPatientModal = ({ patient, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...patient });
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(
        `http://localhost:8000/update/${patient.patient_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

        if (!response.ok) {
        // Initialize a detailed error message
        let apiErrorMessage = `Error ${response.status}: ${response.statusText || 'Unknown API Error'}`;

        try {
          const errorJson = await response.json();
          // Attempt to extract a more specific message from the API's JSON response
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail) && errorJson.detail[0]?.msg) {
              apiErrorMessage = errorJson.detail[0].msg; // Common for FastAPI validation errors
            } else if (typeof errorJson.detail === 'string' && errorJson.detail.trim() !== "") {
              apiErrorMessage = errorJson.detail; // Common for FastAPI HTTPException
            }
          } else if (errorJson.message && typeof errorJson.message === 'string' && errorJson.message.trim() !== "") {
            apiErrorMessage = errorJson.message; // Generic message field
          }
        } catch (jsonParseError) {
          // If parsing JSON fails, stick with the initial HTTP status error message.
          // You could log jsonParseError for debugging if needed.
          console.warn("Could not parse API error response as JSON:", jsonParseError);
        }
        // Throw an error with the derived API message. This will be caught by the catch block below.
        throw new Error(apiErrorMessage);
      }


    //   toast.success("Patient updated successfully");
      setRegistrationComplete(true);
      onUpdated?.(); // Optional callback
    } catch (err) {
      // show error message in toast
      const apiErrorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(`Registration failed: ${apiErrorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueToUpload = () => {
    window.location.href = "/Analysis";
  };

  if (registrationComplete) {
    return <SuccessAnimation onContinue={handleContinueToUpload}  mode="update"/>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-2 max-w-4xl relative">
        <Button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
        >
          &times;
        </Button>

        <h2 className="text-2xl font-semibold ">Edit Patient Details</h2>
        <hr className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {renderField("Name", "name", formData.name, handleChange)}
          {renderField("Age", "Age", formData.Age, handleChange)}
          {renderField("Gender", "gender", formData.gender, handleChange)}
          {renderField(
            "Mobile Number",
            "mobile_number",
            formData.mobile_number,
            handleChange
          )}

          {renderField(
            "patient_id",
            "patient_id",
            formData.patient_id,
            handleChange
          )}
          {renderField(
            "HbA1c Level (%)",
            "HbA1c_Level",
            formData.HbA1c_Level,
            handleChange
          )}
          {renderField(
            "Fasting Blood Glucose (mg/dL)",
            "Fasting_Blood_Glucose",
            formData.Fasting_Blood_Glucose,
            handleChange
          )}
          {renderField(
            "Blood Pressure (mmHg)",
            "Blood_Pressure",
            formData.Blood_Pressure,
            handleChange
          )}
          {renderField(
            "Cholesterol (mg/dL)",
            "Cholesterol",
            formData.Cholesterol,
            handleChange
          )}
          {renderField("BMI (kg/m²)", "BMI", formData.BMI, handleChange)}
          {renderField(
            "Albuminuria (mg/g)",
            "Albuminuria",
            formData.Albuminuria,
            handleChange
          )}
          {renderField(
            "Duration of Diabetes (Years)",
            "Duration_of_Diabetes",
            formData.Duration_of_Diabetes,
            handleChange
          )}
          {renderField(
            "Visual Acuity",
            "Visual_Acuity",
            formData.Visual_Acuity,
            handleChange
          )}
          {renderField(
            "Hospital Name",
            "Hospital_name",
            formData.Hospital_name,
            handleChange
          )}

          {renderField(
            "Number of Visits",
            "num_visits",
            formData.num_visits,
            handleChange
          )}

          {renderField("visit_id", "visit_id", formData.visit_id, handleChange)}
        </div>

        <Button
          onClick={handleUpdate}
          disabled={submitting}
          className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Patient"}
        </Button>
      </div>
    </div>
  );
};

// 🧩 Reusable field component
const renderField = (label, name, value, onChange) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 rounded "
      placeholder={label}
    />
  </div>
);

export default EditPatientModal;
