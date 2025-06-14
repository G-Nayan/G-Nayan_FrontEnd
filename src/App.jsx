// import ButtonGradient from "./assets/svg/ButtonGradient";
// import Benefits from "./components/Benefits";
// import Collaboration from "./components/Collaboration";
// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Roadmap from "./components/Roadmap";
// import DiabetesPatientRegister from './components/PatientDetails/DiabetesPatientRegister';
// import DiabetesPatientList from './components/PatientDetails/DiabetesPatientList';


// const App = () => {
//   return (
//     <>
//       <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
//         <Header />
//         <Hero/>
//         <Collaboration />
//         <Benefits />
//         <Route path="/diabetes-register" element={<DiabetesPatientRegister />} />
//         <Route path="/diabetes-patients" element={<DiabetesPatientList />} />
        
     
//         <Roadmap />
//         <Footer />
//       </div>

//       <ButtonGradient />
//     </>
//   );
// };

// export default App;
// src/App.js

// Keep these imports for defining routes
import { Routes, Route } from "react-router-dom"; 

import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Roadmap from "./components/Roadmap";
import DiabetesPatientRegister from "./components/PatientDetails/DiabetesPatientRegister";
import DiabetesPatientList from "./components/PatientDetails/DiabetesPatientList";

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
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />

        {/* This <Routes> block will now work correctly */}
        <Routes>
          {/* Route for the main landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Route for the patient registration form */}
          <Route
            path="/register-patient"
            element={<DiabetesPatientRegister />}
          />

          {/* Route for the list of patients */}
          <Route 
            path="/patient-list" 
            element={<DiabetesPatientList />} 
          />
        </Routes>
        
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;