// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "@/hooks/use-toast";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   User,
//   Activity,
//   Building2,
//   Calendar,
//   ChevronDown,
//   Check,
//   AlertCircle,
//   Heart,
//   Eye,
//   Phone,
//   UserCheck,
// } from "lucide-react";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

// const DiabetesPatientRegister = () => {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 4;

//   const [formData, setFormData] = useState({
//     patient_id: "",
//     name: "",
//     age: "",
//     gender: "",
//     mobile_number: "",
//     HbA1c_Level: "",
//     Fasting_Blood_Glucose: "",
//     Blood_Pressure: "",
//     Cholesterol: "",
//     BMI: "",
//     Albuminuria: "",
//     Duration_of_Diabetes: "",
//     Visual_Acuity: "Normal",
//     Hospital_name: "",
//     Date_of_registration: new Date(),
//     num_visits: "",
//   });

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.patient_id || +formData.patient_id <= 0)
//       newErrors.patient_id = "A valid patient ID is required.";
//     if (!formData.name.trim()) newErrors.name = "Patient name is required.";
//     if (!formData.age || +formData.age <= 0)
//       newErrors.age = "A valid age is required.";
//     if (!formData.gender) newErrors.gender = "Gender is required.";
//     if (!formData.mobile_number.trim())
//       newErrors.mobile_number = "Mobile number is required.";
//     if (!formData.Hospital_name.trim())
//       newErrors.Hospital_name = "Hospital name is required.";
//     if (!formData.Date_of_registration)
//       newErrors.Date_of_registration = "Registration date is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!validate()) {
//   //     toast({
//   //       title: "Validation Error",
//   //       description: "Please fill in all required fields correctly.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   setIsSubmitting(true);

//   //   const payload = {
//   //     ...formData,
//   //     patient_id: parseInt(formData.patient_id),
//   //     Age: parseInt(formData.age),
//   //     HbA1c_Level: parseFloat(formData.HbA1c_Level),
//   //     Fasting_Blood_Glucose: parseFloat(formData.Fasting_Blood_Glucose),
//   //     Blood_Pressure: parseFloat(formData.Blood_Pressure),
//   //     Cholesterol: parseFloat(formData.Cholesterol),
//   //     BMI: parseFloat(formData.BMI),
//   //     Albuminuria: parseFloat(formData.Albuminuria),
//   //     Duration_of_Diabetes: parseInt(formData.Duration_of_Diabetes),
//   //     num_visits: parseInt(formData.num_visits || "0"),
//   //     Date_of_registration: formData.Date_of_registration.toISOString().split("T")[0],
//   //   };

//   //   const API_URL = `http://localhost:8000/?patient_id=${formData.patient_id}`;

//   //   try {
//   //     const response = await fetch(API_URL, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     if (!response.ok) {
//   //       const errorData = await response.json().catch(() => ({
//   //         message: "Unknown error occurred.",
//   //       }));
//   //       throw new Error(errorData.message || `HTTP error: ${response.status}`);
//   //     }

//   //     toast({
//   //       title: "Success!",
//   //       description: "Patient registered successfully!",
//   //     });
//   //   } catch (error) {
//   //     console.error("Registration failed:", error);
//   //     toast({
//   //       title: "Registration Failed",
//   //       description: `Error: ${error.message}`,
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields correctly.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     const payload = {
//       ...formData,
//       patient_id: parseInt(formData.patient_id),
//       Age: parseInt(formData.age),
//       HbA1c_Level: parseFloat(formData.HbA1c_Level),
//       Fasting_Blood_Glucose: parseFloat(formData.Fasting_Blood_Glucose),
//       Blood_Pressure: parseFloat(formData.Blood_Pressure),
//       Cholesterol: parseFloat(formData.Cholesterol),
//       BMI: parseFloat(formData.BMI),
//       Albuminuria: parseFloat(formData.Albuminuria),
//       Duration_of_Diabetes: parseInt(formData.Duration_of_Diabetes),
//       num_visits: parseInt(formData.num_visits || "0"),
//       Date_of_registration: formData.Date_of_registration.toISOString
//         ? formData.Date_of_registration.split("T")[0]
//         : formData.Date_of_registration,
//     };

//     const API_URL = `http://localhost:8000/?patient_id=${formData.patient_id}`;

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({
//           message: "Unknown error occurred.",
//         }));
//         throw new Error(errorData.message || `HTTP error: ${response.status}`);
//       }

//       // <-- Success toast here
//       toast({
//         title: "Success",
//         description: "Patient registered successfully!",
//         variant: "success",
//       });

//       // optionally navigate after a tiny delay
//       // setTimeout(() => navigate("/patient-list"), 800);
//     } catch (error) {
//       console.error("Registration failed:", error);
//       toast({
//         title: "Registration Failed",
//         description: `Error: ${error.message}`,
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const progressPercentage = (currentStep / totalSteps) * 100;

//   const renderFormStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <Card className="animate-fade-in">
//             <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
//               <CardTitle className="flex items-center gap-2">
//                 <UserCheck className="h-5 w-5" />
//                 Patient Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="patient_id"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     Patient ID
//                   </label>
//                   <Input
//                     type="number"
//                     id="patient_id"
//                     name="patient_id"
//                     value={formData.patient_id}
//                     onChange={handleChange}
//                     className={cn(
//                       "transition-all duration-200",
//                       errors.patient_id && "border-red-500 focus:border-red-500"
//                     )}
//                     placeholder="Enter unique patient ID"
//                   />
//                   {errors.patient_id && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.patient_id}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="name"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     Full Name
//                   </label>
//                   <Input
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={cn(
//                       "transition-all duration-200",
//                       errors.name && "border-red-500 focus:border-red-500"
//                     )}
//                     placeholder="Enter patient's full name"
//                   />
//                   {errors.name && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="age"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     Age
//                   </label>
//                   <Input
//                     type="number"
//                     id="age"
//                     name="age"
//                     value={formData.age}
//                     onChange={handleChange}
//                     className={cn(
//                       "transition-all duration-200",
//                       errors.age && "border-red-500 focus:border-red-500"
//                     )}
//                     placeholder="Enter age in years"
//                   />
//                   {errors.age && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.age}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="gender"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     Gender
//                   </label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-between text-left font-normal transition-all duration-200",
//                           !formData.gender && "text-muted-foreground",
//                           errors.gender && "border-red-500"
//                         )}
//                       >
//                         {formData.gender || "Select gender"}
//                         <ChevronDown className="h-4 w-4 opacity-50" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-full bg-white shadow-lg border">
//                       {["Male", "Female", "Other"].map((option) => (
//                         <DropdownMenuItem
//                           key={option}
//                           onSelect={() =>
//                             setFormData((prev) => ({ ...prev, gender: option }))
//                           }
//                           className="cursor-pointer hover:bg-gray-50"
//                         >
//                           {option}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   {errors.gender && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.gender}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <label
//                     htmlFor="mobile_number"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     <Phone className="h-4 w-4" />
//                     Mobile Number
//                   </label>
//                   <Input
//                     type="tel"
//                     id="mobile_number"
//                     name="mobile_number"
//                     value={formData.mobile_number}
//                     onChange={handleChange}
//                     className={cn(
//                       "transition-all duration-200",
//                       errors.mobile_number &&
//                         "border-red-500 focus:border-red-500"
//                     )}
//                     placeholder="Enter mobile number"
//                   />
//                   {errors.mobile_number && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.mobile_number}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 2:
//         return (
//           <Card className="animate-fade-in">
//             <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5" />
//                 Clinical Measurements
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[
//                   {
//                     id: "HbA1c_Level",
//                     label: "HbA1c Level",
//                     unit: "%",
//                     icon: Heart,
//                   },
//                   {
//                     id: "Fasting_Blood_Glucose",
//                     label: "Fasting Glucose",
//                     unit: "mg/dL",
//                     icon: Activity,
//                   },
//                   {
//                     id: "Blood_Pressure",
//                     label: "Blood Pressure",
//                     unit: "mmHg",
//                     icon: Heart,
//                   },
//                   {
//                     id: "Cholesterol",
//                     label: "Cholesterol",
//                     unit: "mg/dL",
//                     icon: Activity,
//                   },
//                   { id: "BMI", label: "BMI", unit: "kg/m²", icon: User },
//                   {
//                     id: "Albuminuria",
//                     label: "Albuminuria",
//                     unit: "mg/g",
//                     icon: Activity,
//                   },
//                 ].map(({ id, label, unit, icon: Icon }) => (
//                   <div key={id} className="space-y-2">
//                     <label
//                       htmlFor={id}
//                       className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                     >
//                       <Icon className="h-4 w-4 text-green-600" />
//                       {label} ({unit})
//                     </label>
//                     <Input
//                       type="number"
//                       step="0.1"
//                       id={id}
//                       name={id}
//                       value={formData[id]}
//                       onChange={handleChange}
//                       className="transition-all duration-200 hover:border-green-300 focus:border-green-500"
//                       placeholder={`Enter ${label.toLowerCase()}`}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <Separator />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="Duration_of_Diabetes"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Calendar className="h-4 w-4 text-green-600" />
//                     Diabetes Duration (Years)
//                   </label>
//                   <Input
//                     type="number"
//                     id="Duration_of_Diabetes"
//                     name="Duration_of_Diabetes"
//                     value={formData.Duration_of_Diabetes}
//                     onChange={handleChange}
//                     className="transition-all duration-200 hover:border-green-300 focus:border-green-500"
//                     placeholder="Years with diabetes"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="Visual_Acuity"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Eye className="h-4 w-4 text-green-600" />
//                     Visual Acuity
//                   </label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-between text-left font-normal transition-all duration-200 hover:border-green-300"
//                       >
//                         {formData.Visual_Acuity}
//                         <ChevronDown className="h-4 w-4 opacity-50" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-full bg-white shadow-lg border">
//                       {["Normal", "Mild", "Moderate", "Severe", "Blind"].map(
//                         (option) => (
//                           <DropdownMenuItem
//                             key={option}
//                             onSelect={() =>
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 Visual_Acuity: option,
//                               }))
//                             }
//                             className="cursor-pointer hover:bg-gray-50"
//                           >
//                             {option}
//                           </DropdownMenuItem>
//                         )
//                       )}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 3:
//         return (
//           <Card className="animate-fade-in">
//             <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
//               <CardTitle className="flex items-center gap-2">
//                 <Building2 className="h-5 w-5" />
//                 Administrative Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="Hospital_name"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     <Building2 className="h-4 w-4 text-purple-600" />
//                     Hospital Name
//                   </label>
//                   <Input
//                     type="text"
//                     id="Hospital_name"
//                     name="Hospital_name"
//                     value={formData.Hospital_name}
//                     onChange={handleChange}
//                     className={cn(
//                       "transition-all duration-200",
//                       errors.Hospital_name &&
//                         "border-red-500 focus:border-red-500"
//                     )}
//                     placeholder="Enter hospital name"
//                   />
//                   {errors.Hospital_name && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.Hospital_name}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="Date_of_registration"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <Badge variant="destructive" className="px-1 py-0 text-xs">
//                       *
//                     </Badge>
//                     <Calendar className="h-4 w-4 text-purple-600" />
//                     Date of Registration
//                   </label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-start text-left font-normal transition-all duration-200",
//                           !formData.Date_of_registration &&
//                             "text-muted-foreground",
//                           errors.Date_of_registration && "border-red-500"
//                         )}
//                       >
//                         <Calendar className="mr-2 h-4 w-4" />
//                         {formData.Date_of_registration ? (
//                           format(formData.Date_of_registration, "PPP")
//                         ) : (
//                           <span>Pick a date</span>
//                         )}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <CalendarComponent
//                         mode="single"
//                         selected={formData.Date_of_registration}
//                         onSelect={(date) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             Date_of_registration: date || new Date(),
//                           }))
//                         }
//                         initialFocus
//                         className="p-3 pointer-events-auto bg-white"
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   {errors.Date_of_registration && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle className="h-4 w-4" />
//                       {errors.Date_of_registration}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <label
//                     htmlFor="num_visits"
//                     className="text-sm font-medium text-gray-700 flex items-center gap-2"
//                   >
//                     <User className="h-4 w-4 text-purple-600" />
//                     Number of Previous Visits
//                   </label>
//                   <Input
//                     type="number"
//                     id="num_visits"
//                     name="num_visits"
//                     value={formData.num_visits}
//                     onChange={handleChange}
//                     className="transition-all duration-200 hover:border-purple-300 focus:border-purple-500"
//                     placeholder="Number of previous visits (optional)"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 4:
//         return (
//           <Card className="animate-fade-in">
//             <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
//               <CardTitle className="flex items-center gap-2">
//                 <Check className="h-5 w-5" />
//                 Review & Submit
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-6">
//               <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                 <h3 className="font-semibold text-blue-900 mb-4">
//                   Patient Summary
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <strong>Name:</strong> {formData.name || "Not provided"}
//                   </div>
//                   <div>
//                     <strong>Age:</strong> {formData.age || "Not provided"}
//                   </div>
//                   <div>
//                     <strong>Gender:</strong> {formData.gender || "Not provided"}
//                   </div>
//                   <div>
//                     <strong>Hospital:</strong>{" "}
//                     {formData.Hospital_name || "Not provided"}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                 <h3 className="font-semibold text-green-900 mb-4">
//                   Clinical Data
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                   {formData.HbA1c_Level && (
//                     <div>
//                       <strong>HbA1c:</strong> {formData.HbA1c_Level}%
//                     </div>
//                   )}
//                   {formData.BMI && (
//                     <div>
//                       <strong>BMI:</strong> {formData.BMI} kg/m²
//                     </div>
//                   )}
//                   {formData.Visual_Acuity && (
//                     <div>
//                       <strong>Visual Acuity:</strong> {formData.Visual_Acuity}
//                     </div>
//                   )}
//                   {formData.Duration_of_Diabetes && (
//                     <div>
//                       <strong>Diabetes Duration:</strong>{" "}
//                       {formData.Duration_of_Diabetes} years
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-12 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:opacity-50"
//                   onClick={handleSubmit}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="h-4 w-4 mr-2" />
//                       Register Patient
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             Diabetes Patient Registration
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Complete patient information in simple steps
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-medium text-gray-700">
//               Step {currentStep} of {totalSteps}
//             </span>
//             <span className="text-sm font-medium text-gray-700">
//               {Math.round(progressPercentage)}% Complete
//             </span>
//           </div>
//           <Progress value={progressPercentage} className="h-2 bg-gray-200" />
//         </div>

//         {/* Step Navigation */}
//         <div className="flex justify-center mb-8">
//           <div className="flex space-x-4">
//             {[
//               { step: 1, label: "Patient Info", icon: User },
//               { step: 2, label: "Clinical Data", icon: Activity },
//               { step: 3, label: "Admin Details", icon: Building2 },
//               { step: 4, label: "Review", icon: Check },
//             ].map(({ step, label, icon: Icon }) => (
//               <div
//                 key={step}
//                 className={cn(
//                   "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
//                   currentStep === step
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : currentStep > step
//                     ? "bg-green-100 text-green-800"
//                     : "bg-gray-100 text-gray-600"
//                 )}
//               >
//                 <Icon className="h-4 w-4" />
//                 <span className="hidden sm:inline">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Form Content */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {renderFormStep()}

//           {/* Navigation Buttons */}
//           <div className="flex justify-between pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//               disabled={currentStep === 1}
//               className="px-6 py-2 transition-all duration-200"
//             >
//               Previous
//             </Button>

//             {currentStep < totalSteps && (
//               <Button
//                 type="button"
//                 onClick={() =>
//                   setCurrentStep(Math.min(totalSteps, currentStep + 1))
//                 }
//                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
//               >
//                 Next Step
//               </Button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DiabetesPatientRegister;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
// import { toast } from "@/hooks/use-toast";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Activity,
  Building2,
  Calendar,
  ChevronDown,
  Check,
  AlertCircle,
  Heart,
  Eye,
  Phone,
  UserCheck,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FormErrors {
  patient_id?: string;
  name?: string;
  age?: string;
  gender?: string;
  mobile_number?: string;
  Hospital_name?: string;
  Date_of_registration?: string;
}

const DiabetesPatientRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    patient_id: "",
    name: "",
    age: "",
    gender: "",
    mobile_number: "",
    HbA1c_Level: "",
    Fasting_Blood_Glucose: "",
    Blood_Pressure: "",
    Cholesterol: "",
    BMI: "",
    Albuminuria: "",
    Duration_of_Diabetes: "",
    Visual_Acuity: "Normal",
    Hospital_name: "",
    Date_of_registration: new Date(),
    num_visits: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.patient_id || +formData.patient_id <= 0)
      newErrors.patient_id = "A valid patient ID is required.";
    if (!formData.name.trim()) newErrors.name = "Patient name is required.";
    if (!formData.age || +formData.age <= 0)
      newErrors.age = "A valid age is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.mobile_number.trim())
      newErrors.mobile_number = "Mobile number is required.";
    if (!formData.Hospital_name.trim())
      newErrors.Hospital_name = "Hospital name is required.";
    if (!formData.Date_of_registration)
      newErrors.Date_of_registration = "Registration date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      patient_id: parseInt(formData.patient_id),
      Age: parseInt(formData.age),
      HbA1c_Level: parseFloat(formData.HbA1c_Level),
      Fasting_Blood_Glucose: parseFloat(formData.Fasting_Blood_Glucose),
      Blood_Pressure: parseFloat(formData.Blood_Pressure),
      Cholesterol: parseFloat(formData.Cholesterol),
      BMI: parseFloat(formData.BMI),
      Albuminuria: parseFloat(formData.Albuminuria),
      Duration_of_Diabetes: parseInt(formData.Duration_of_Diabetes),
      num_visits: parseInt(formData.num_visits || "0"),
      Date_of_registration:
        formData.Date_of_registration.toISOString().split("T")[0],
    };

    const API_URL = `http://localhost:8000/?patient_id=${formData.patient_id}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Unknown error occurred.",
        }));
        throw new Error(errorData.message || `HTTP error: ${response.status}`);
      }

      toast.success("Patient registered successfully!");
       setRegistrationComplete(true);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        `Registration failed: ${error instanceof Error ? error.message : error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: "Patient Information",
      icon: UserCheck,
      description: "Basic patient details",
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "Clinical Measurements",
      icon: Activity,
      description: "Medical test results",
      color: "bg-green-600",
    },
    {
      id: 3,
      title: "Administrative Details",
      icon: Building2,
      description: "Hospital and registration info",
      color: "bg-purple-600",
    },
    {
      id: 4,
      title: "Review & Submit",
      icon: Check,
      description: "Verify and save patient data",
      color: "bg-orange-600",
    },
  ];

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="patient_id"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  Patient ID
                </label>
                <Input
                  type="number"
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  className={cn(
                    "transition-all duration-200",
                    errors.patient_id && "border-red-500 focus:border-red-500"
                  )}
                  placeholder="Enter unique patient ID"
                />
                {errors.patient_id && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.patient_id}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    "transition-all duration-200",
                    errors.name && "border-red-500 focus:border-red-500"
                  )}
                  placeholder="Enter patient's full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="age"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  Age
                </label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={cn(
                    "transition-all duration-200",
                    errors.age && "border-red-500 focus:border-red-500"
                  )}
                  placeholder="Enter age in years"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.age}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  Gender
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between text-left font-normal transition-all duration-200",
                        !formData.gender && "text-muted-foreground",
                        errors.gender && "border-red-500"
                      )}
                    >
                      {formData.gender || "Select gender"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white shadow-lg border">
                    {["Male", "Female", "Other"].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onSelect={() =>
                          setFormData((prev) => ({ ...prev, gender: option }))
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.gender && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.gender}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="mobile_number"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  <Phone className="h-4 w-4" />
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className={cn(
                    "transition-all duration-200",
                    errors.mobile_number &&
                      "border-red-500 focus:border-red-500"
                  )}
                  placeholder="Enter mobile number"
                />
                {errors.mobile_number && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.mobile_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "HbA1c_Level",
                  label: "HbA1c Level",
                  unit: "%",
                  icon: Heart,
                },
                {
                  id: "Fasting_Blood_Glucose",
                  label: "Fasting Glucose",
                  unit: "mg/dL",
                  icon: Activity,
                },
                {
                  id: "Blood_Pressure",
                  label: "Blood Pressure",
                  unit: "mmHg",
                  icon: Heart,
                },
                {
                  id: "Cholesterol",
                  label: "Cholesterol",
                  unit: "mg/dL",
                  icon: Activity,
                },
                { id: "BMI", label: "BMI", unit: "kg/m²", icon: User },
                {
                  id: "Albuminuria",
                  label: "Albuminuria",
                  unit: "mg/g",
                  icon: Activity,
                },
              ].map(({ id, label, unit, icon: Icon }) => (
                <div key={id} className="space-y-2">
                  <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 text-green-600" />
                    {label} ({unit})
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    id={id}
                    name={id}
                    value={formData[id as keyof typeof formData] as string}
                    onChange={handleChange}
                    className="transition-all duration-200 hover:border-green-300 focus:border-green-500"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="Duration_of_Diabetes"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-green-600" />
                  Diabetes Duration (Years)
                </label>
                <Input
                  type="number"
                  id="Duration_of_Diabetes"
                  name="Duration_of_Diabetes"
                  value={formData.Duration_of_Diabetes}
                  onChange={handleChange}
                  className="transition-all duration-200 hover:border-green-300 focus:border-green-500"
                  placeholder="Years with diabetes"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="Visual_Acuity"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4 text-green-600" />
                  Visual Acuity
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal transition-all duration-200 hover:border-green-300"
                    >
                      {formData.Visual_Acuity}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white shadow-lg border">
                    {["Normal", "Mild", "Moderate", "Severe", "Blind"].map(
                      (option) => (
                        <DropdownMenuItem
                          key={option}
                          onSelect={() =>
                            setFormData((prev) => ({
                              ...prev,
                              Visual_Acuity: option,
                            }))
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {option}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="Hospital_name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  <Building2 className="h-4 w-4 text-purple-600" />
                  Hospital Name
                </label>
                <Input
                  type="text"
                  id="Hospital_name"
                  name="Hospital_name"
                  value={formData.Hospital_name}
                  onChange={handleChange}
                  className={cn(
                    "transition-all duration-200",
                    errors.Hospital_name &&
                      "border-red-500 focus:border-red-500"
                  )}
                  placeholder="Enter hospital name"
                />
                {errors.Hospital_name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.Hospital_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="Date_of_registration"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Badge variant="destructive" className="px-1 py-0 text-xs">
                    *
                  </Badge>
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Date of Registration
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200",
                        !formData.Date_of_registration &&
                          "text-muted-foreground",
                        errors.Date_of_registration && "border-red-500"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.Date_of_registration ? (
                        format(formData.Date_of_registration, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.Date_of_registration}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          Date_of_registration: date || new Date(),
                        }))
                      }
                      initialFocus
                      className="p-3 pointer-events-auto bg-white"
                    />
                  </PopoverContent>
                </Popover>
                {errors.Date_of_registration && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.Date_of_registration}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="num_visits"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-purple-600" />
                  Number of Previous Visits
                </label>
                <Input
                  type="number"
                  id="num_visits"
                  name="num_visits"
                  value={formData.num_visits}
                  onChange={handleChange}
                  className="transition-all duration-200 hover:border-purple-300 focus:border-purple-500"
                  placeholder="Number of previous visits (optional)"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-2">
            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                Patient Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {formData.name || "Not provided"}
                </div>
                <div>
                  <strong>Age:</strong> {formData.age || "Not provided"}
                </div>
                <div>
                  <strong>Gender:</strong> {formData.gender || "Not provided"}
                </div>
                <div>
                  <strong>Hospital:</strong>{" "}
                  {formData.Hospital_name || "Not provided"}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">
                Clinical Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {formData.HbA1c_Level && (
                  <div>
                    <strong>HbA1c:</strong> {formData.HbA1c_Level}%
                  </div>
                )}
                {formData.BMI && (
                  <div>
                    <strong>BMI:</strong> {formData.BMI} kg/m²
                  </div>
                )}
                {formData.Visual_Acuity && (
                  <div>
                    <strong>Visual Acuity:</strong> {formData.Visual_Acuity}
                  </div>
                )}
                {formData.Duration_of_Diabetes && (
                  <div>
                    <strong>Diabetes Duration:</strong>{" "}
                    {formData.Duration_of_Diabetes} years
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
              {/* <Button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:opacity-50"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Register Patient
                  </>
                )}
              </Button> */}
                 {/* <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg"> */}
              {!registrationComplete ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:opacity-50"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Saving...</>
                  ) : (
                    <><Check className="h-4 w-4 mr-2" />Register Patient</>
                  )}
                </Button>
              ) : (
                // <Button
                //   onClick={() => window.location.href = 'https://retinopathy-dashboard.vercel.app/'}
                //   className="px-12 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
                // >
                //   Upload Retinopathy Eye Images
                // </Button>
                 <Button
                  onClick={() => window.open('http://localhost:3000/', '_blank', 'noopener,noreferrer')}
                  className="px-12 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
                >
                  Upload Retinopathy Eye Images
                </Button>
              )}
            {/* </div> */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex w-full">
        {/* Sidebar Stepper */}
        <div className="w-100 h-screen bg-white shadow-xl border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Patient Registration
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Complete all steps to register
            </p>
          </div>

          {/* Progress Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-small text-gray-700">Progress</span>
              <span className="text-sm font-small text-gray-700">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Steps */}
          <div className="p-1 space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex items-start p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50",
                    isActive && "bg-blue-50 border-l-4 border-blue-600",
                    isCompleted && "bg-green-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full mr-4 transition-all duration-200",
                      isActive && "bg-blue-600 text-white shadow-lg",
                      isCompleted && "bg-green-600 text-white",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        isActive && "text-blue-900",
                        isCompleted && "text-green-900",
                        !isActive && !isCompleted && "text-gray-700"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="animate-fade-in shadow-lg">
                <CardHeader
                  className={cn(
                    "text-white rounded-t-lg",
                    steps[currentStep - 1]?.color || "bg-blue-600"
                  )}
                >
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(steps[currentStep - 1]?.icon || User, {
                      className: "h-5 w-5",
                    })}
                    {steps[currentStep - 1]?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">{renderFormStep()}</CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-2 transition-all duration-200"
                >
                  Previous
                </Button>

                {currentStep < totalSteps && (
                  <Button
                    type="button"
                    onClick={() =>
                      setCurrentStep(Math.min(totalSteps, currentStep + 1))
                    }
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiabetesPatientRegister;
