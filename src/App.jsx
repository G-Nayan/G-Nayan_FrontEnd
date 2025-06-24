// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Roadmap from "./components/Roadmap";
import DiabetesPatientRegister from "./components/PatientDetails/DiabetesPatientRegister";
import DiabetesPatientList from "./components/PatientDetails/DiabetesPatientList";
import AnalysisPage from "./components/Analysis/Analysis";


// A helper component to render the main landing page content
const LandingPage = () => (
  <>
    <Hero />
    <Collaboration />
    <Benefits />
    <Roadmap />
  </>
);

const App = () => {
  return (
    // The <Router> is correctly in main.jsx, so it's removed from here.
    <>
      {/* Toast container—must be mounted once in your app */}
      <Toaster position="top-right" />

      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />

        {/* This <Routes> block will now work correctly */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register-patient" element={<DiabetesPatientRegister />} />
          <Route path="/patient-list" element={<DiabetesPatientList />} />
          <Route path="/Analysis" element={<AnalysisPage />} />
        </Routes>

        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;