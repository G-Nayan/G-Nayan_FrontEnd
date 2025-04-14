
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  VideoIcon, 
  FileText, 
  BookOpen,
  Phone,
  HelpCircle,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AssistantMode: React.FC = () => {
  const { toast } = useToast();

  const handleServiceClick = (service: string) => {
    toast({
      title: `${service} Selected`,
      description: `This would navigate to the ${service.toLowerCase()} section in a complete application.`,
    });
  };

  const services = [
    { 
      id: 'appointment', 
      title: 'Book an Appointment', 
      icon: <Calendar className="h-5 w-5 text-teal-600" />,
      description: 'Schedule an eye exam or consultation'
    },
    { 
      id: 'find-clinic', 
      title: 'Find a Clinic', 
      icon: <MapPin className="h-5 w-5 text-cyan-600" />,
      description: 'Locate an eye care center near you'
    },
    { 
      id: 'virtual-consult', 
      title: 'Virtual Consultation', 
      icon: <VideoIcon className="h-5 w-5 text-emerald-600" />,
      description: 'Connect with an optometrist online'
    },
    { 
      id: 'vision-test', 
      title: 'Online Vision Test', 
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      description: 'Basic screening for vision issues'
    },
    { 
      id: 'eye-conditions', 
      title: 'Eye Conditions Guide', 
      icon: <BookOpen className="h-5 w-5 text-indigo-600" />,
      description: 'Learn about common eye problems'
    },
    { 
      id: 'emergency', 
      title: 'Eye Emergency', 
      icon: <Phone className="h-5 w-5 text-red-600" />,
      description: 'Get urgent care information'
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">How can I assist you?</h3>
        <p className="text-sm text-gray-600">Select a service to get started</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {services.map(service => (
          <Card 
            key={service.id}
            className="p-3 cursor-pointer hover:bg-teal-50 transition-colors border-gray-200 flex flex-col items-center text-center"
            onClick={() => handleServiceClick(service.title)}
          >
            <div className="p-2 rounded-full bg-gray-100 mb-2">
              {service.icon}
            </div>
            <h4 className="text-sm font-medium">{service.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{service.description}</p>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Need more help?</p>
          <p className="text-xs text-blue-600 mt-1">
            You can return to chat mode to ask specific questions about eye health and vision care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantMode;
