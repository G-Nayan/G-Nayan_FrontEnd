import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowUp,
  X,
  MessageSquare,
  Lightbulb,
  Eye,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GNayanaAvatar from "./GNayanaAvatar";
import AssistantMode from "./AssistantMode";
import { useToast } from "@/components/ui/use-toast";

// CSS animation for pulsing ring
const pulseRingAnimation = {
  "@keyframes pulseRing": {
    "0%": {
      transform: "scale(0.7)",
      opacity: 0.3,
    },
    "80%, 100%": {
      transform: "scale(1.5)",
      opacity: 0,
    },
  },
};

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type Mode = "chat" | "assistant";

const GNayanaBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("chat");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const welcomeMessage =
    "Hello! I'm G-Nayana, your eye health assistant. How can I help you today? You can ask me about eye conditions, care tips, or switch to Assistant mode for guidance on our services.";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message with a typing effect
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: "welcome",
            text: welcomeMessage,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenBot = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleCloseBot = () => {
    setIsOpen(false);
  };

  const handleMinimizeBot = () => {
    setIsMinimized(!isMinimized);
  };

  const handleModeToggle = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === "assistant" && messages.length > 0) {
      toast({
        title: "Switched to Assistant Mode",
        description: "Here you can access quick services and guidance.",
      });
    } else if (newMode === "chat" && messages.length > 0) {
      toast({
        title: "Switched to Chat Mode",
        description: "Feel free to ask any questions about eye health.",
      });
    }
  };

  const generateBotResponse = (userMessage: string) => {
    // In a real app, this would connect to an AI backend
    const responses = [
      "That's a great question about eye health. Regular check-ups are essential for maintaining good vision.",
      "Eye strain from screens is common. I recommend following the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
      "Glaucoma is a condition that damages the optic nerve, often due to increased pressure in the eye. Early detection is key for treatment.",
      "Cataracts develop when the lens in your eye becomes cloudy, causing blurry vision. It's more common as we age.",
      "Proper nutrition with vitamins A, C, and E can help maintain eye health. Foods like carrots, spinach, and fish are beneficial.",
      "I'd be happy to help you find an optometrist near you or assist with booking an appointment.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate bot thinking
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(message),
        sender: "bot" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);

    // Focus on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bot toggle button */}
      {/* Bot toggle button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-10">
          {/* Glowing pulse ring */}
          <span className="absolute inline-flex h-14 w-14 rounded-full bg-teal-400 opacity-75 animate-ping" />

          {/* Bot Button with styled tooltip */}
          <div className="group relative flex flex-col items-center">
            <Button
            //  title="Open G-Nayana Bot"
              className="relative rounded-full w-14 h-14 p-0 bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg flex items-center justify-center animate-bounce"
              onClick={handleOpenBot}
            >
              <Eye className="w-6 h-6 text-white" />
            </Button>

            {/* Tooltip */}
            <div className="d-flex justify-center absolute bottom-full mb-3 px-3 py-1 rounded-md bg-black bg-opacity-80 text-white text-sm font-semibold tracking-wide shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
            AI Bot
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 bg-opacity-80"></div>
            </div>
          </div>
        </div>
      )}

      {/* Bot interface */}
      {isOpen && (
        <div
          className={cn(
            "fixed right-6 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out overflow-hidden z-50",
            isMinimized
              ? "bottom-6 w-64 h-16"
              : "bottom-6 w-[350px] md:w-[400px] h-[600px] max-h-[80vh]"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <GNayanaAvatar size={isMinimized ? "sm" : "md"} />
              <div>
                <h3 className="font-semibold text-white">G-Nayana</h3>
                {!isMinimized && (
                  <p className="text-xs text-cyan-100">
                    Your Eye Health Assistant
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimizeBot}
                className="h-7 w-7 rounded-full text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseBot}
                className="h-7 w-7 rounded-full text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mode Toggle */}
              <div className="flex border-b">
                <button
                  className={cn(
                    "flex-1 p-2 text-sm font-medium flex items-center justify-center space-x-1",
                    mode === "chat"
                      ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => handleModeToggle("chat")}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </button>
                <button
                  className={cn(
                    "flex-1 p-2 text-sm font-medium flex items-center justify-center space-x-1",
                    mode === "assistant"
                      ? "bg-cyan-50 text-cyan-700 border-b-2 border-cyan-500"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => handleModeToggle("assistant")}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Assistant</span>
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 h-[calc(100%-130px)] overflow-hidden">
                {mode === "chat" ? (
                  <div className="h-full flex flex-col">
                    {/* Messages Container */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "mb-4 max-w-[80%]",
                            msg.sender === "user" ? "ml-auto" : "mr-auto"
                          )}
                        >
                          <div className="flex items-start">
                            {msg.sender === "bot" && (
                              <GNayanaAvatar size="sm" className="mr-2 mt-1" />
                            )}
                            <Card
                              className={cn(
                                "p-3",
                                msg.sender === "user"
                                  ? "bg-cyan-600 text-white"
                                  : "bg-white border-gray-200"
                              )}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {msg.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </Card>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex items-start mb-4 max-w-[80%]">
                          <GNayanaAvatar size="sm" className="mr-2 mt-1" />
                          <Card className="p-3 bg-white border-gray-200">
                            <div className="flex space-x-1">
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "200ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "400ms" }}
                              ></div>
                            </div>
                          </Card>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white">
                      <div className="flex space-x-2">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder="Ask about eye health..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AssistantMode />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default GNayanaBot;
