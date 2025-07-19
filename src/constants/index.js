
import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
  python,
  Airflow,
  kafka,
  kubernetes,
  mlflow,
  scikitlearn,
  mongo,
  spark,
} from "../assets";

export const navigation = [

  // {
  //   id: "0",
  //   title: "Home",
  //   url: "/",
  // },
  {
    id: "1",
    title: "DETECTION",
    url: "/#detection",
  },
  {
    id: "2",
    title: "EFFICIENCY",
    url: "/#efficiency",
  },
  {
    id: "3",
    title: "Roadmap",
    url: "/#roadmap",
  },
  // --- ADDED NEW LINKS HERE ---
  {
    id: "4",
    title: "Register-Patient",
    url: "/register-patient",
  },
  // {
  //   id: "5",
  //   title: "Patient-List",
  //   url: "/patient-list",
  // },
  // --- END OF ADDED LINKS ---
  {
    id: "6",
    title: "login",
    url: "/login",
    // onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Photo generating",
  "Photo enhance",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Voice recognition",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "June 2024",
    status: "progress",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "3",
    title: "Integration with APIs",
    text: "Allow the chatbot to access external data sources, such as Eye Health Tips API and Eye Care News API, to provide more relevant recommendations.",
    date: "May 2024",
    status: "progress",
    imageUrl: roadmap4,
  },
];
export const collabText =
  "AI provides objective classification reduces subjectivity in diagnosis and treatment planning.";

export const collabText1 =
  "AI-powered tools reduce the time it takes to analyze images, allowing ophthalmologists to see more patients.";

export const collabText2 =
  "AI algorithms are trained on vast datasets to improve diagnostic accuracy, ensuring reliable detection of retinal diseases.";
export const collabText3 =
  "AI systems continuously learn from new data, enhancing their detection capabilities and staying up-to-date with the latest medical advancements.";

export const collabContent = [
  {
    id: "0",
    title: "Automated Image Analysis",
    text: collabText,
  },
  {
    id: "1",
    title: "Improved Efficiency",
    text: collabText1,
  },
  {
    id: "2",
    title: "Enhanced Diagnostic Accuracy",
    text: collabText2,
  },
  {
    id: "3",
    title: "Continuous Learning and Improvement",
    text: collabText3,
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Python",
    icon: python,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Airflow",
    icon: Airflow,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "kafka",
    icon: kafka,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "kubernetes",
    icon: kubernetes,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "mlflow",
    icon: mlflow,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "scikitlearn",
    icon: scikitlearn,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "mongo",
    icon: mongo,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "spark",
    icon: spark,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

export const benefits = [
  {
    id: "0",
    title: "Early Detection",
    text: "Early Detection Utilizes advanced ML algorithms to identify early signs of diabetic retinopathy, enabling timely intervention and treatment.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Accurate Analysis",
    text: "Accurate Analysis Provides highly accurate analysis of retinal images, helping to detect even subtle changes indicative of diabetic retinopathy.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "User-Friendly Screening",
    text: "User-Friendly Screening Offers a simple, non-invasive screening process that can be easily integrated into routine eye exams or diabetes check-ups.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Instant Results",
    text: "Instant Results Delivers quick results, allowing healthcare providers to make informed decisions and discuss findings immediately with patients.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Continuous Learning",
    text: "Continuous Learning The ML model continuously improves its accuracy by learning from new data, ensuring up-to-date and reliable diagnostics.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Accessible Anywhere",
    text: "Accessible Anywhere Cloud-based solution allows for secure access to screening tools and results from any authorized device or location.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];