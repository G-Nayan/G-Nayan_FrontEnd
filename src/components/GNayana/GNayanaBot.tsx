import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import EvePopup from "@/components/popcomponent/popcomponent"; // Ensure filename matches

import useWebSocket, { ReadyState } from "react-use-websocket";

// Keep CSS animation definition (or ensure it's in global CSS / Tailwind config)
// Example (if needed for CSS-in-JS, otherwise rely on Tailwind's animate-ping):
// const pulseRingAnimation = { ... };

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type Mode = "chat" | "assistant";

// --- Configuration ---
const WEBSOCKET_URL = "wss://g-nayan-chatbot-latest.onrender.com/ws/Gnayana_chat"; // Use a constant
const WELCOME_MESSAGE_DELAY = 1000; // ms - Show welcome message faster
const TYPING_INDICATOR_DURATION = 1500; // ms - How long mock typing shows (replace if backend sends typing events)
const POPUP_DELAY = 10000; // ms (10 seconds for testing, maybe 180000 for 3 mins in prod)

const GNayanaBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("chat");
  const [isBotTyping, setIsBotTyping] = useState(false); // More specific name
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [showEvePopup, setShowEvePopup] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const welcomeMessageText =
    "Hello! I'm G-Nayana, your eye health assistant. How can I help you today? You can ask me about eye conditions, care tips, or switch to Assistant mode for guidance on our services.";

  // --- WebSocket Connection ---
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    WEBSOCKET_URL,
    {
      onOpen: () => {
        console.log("WebSocket connection established.");
        // Potentially send an initial greeting or auth token if needed
        // Trigger welcome message *after* connection opens
        if (isOpen && messages.length === 0) {
             // No need for setIsTyping here, the welcome message is instant from the bot's perspective
             // If the *backend* needs time, it should send a typing indicator event
             setMessages([
               {
                 id: "welcome",
                 text: welcomeMessageText,
                 sender: "bot",
                 timestamp: new Date(),
               },
             ]);
        }
      },
      onClose: (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
         toast({
           title: "Connection Lost",
           description: "Chat disconnected. Trying to reconnect...",
           variant: "destructive",
         });
      },
      onError: (error) => {
          console.error("WebSocket error:", error);
           toast({
             title: "Connection Error",
             description: "Could not connect to the chat service.",
             variant: "destructive",
           });
      },
      shouldReconnect: (closeEvent) => {
        console.log("Attempting to reconnect...", closeEvent);
        return true; // Attempt to reconnect automatically
      },
      reconnectInterval: 3000, // Attempt reconnect every 3 seconds
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Disconnected',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // --- Message Handling ---

  // Effect to handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
       setIsBotTyping(false); // Stop typing indicator when message arrives
      try {
         // IMPORTANT: Backend should send JSON like {"text": "Bot response here"}
        const parsedData = JSON.parse(lastMessage.data);

        if (parsedData && typeof parsedData.text === 'string') {
            const botMessage: Message = {
              id: Date.now().toString() + '-bot', // Ensure unique ID
              text: parsedData.text,
              sender: "bot",
              timestamp: new Date(),
            };
             setMessages((prev) => [...prev, botMessage]);
        } else {
             console.warn("Received message object without 'text' property:", parsedData);
             // Handle unexpected structure if necessary
        }

      } catch (err) {
        // Handle cases where the message is not valid JSON
        console.warn("Non-JSON message received:", lastMessage.data);
         // Display plain text if it's not JSON (optional, depends on expected behavior)
         const plainTextMessage: Message = {
           id: Date.now().toString() + '-bot-plain',
           text: lastMessage.data, // Show the raw data
           sender: "bot",
           timestamp: new Date(),
         };
        setMessages((prev) => [...prev, plainTextMessage]);
      }
    }
  }, [lastMessage]); // Run only when lastMessage changes

  // Function to send user message
  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || readyState !== ReadyState.OPEN) {
        if (readyState !== ReadyState.OPEN) {
            toast({ title: "Not Connected", description: "Cannot send message, not connected to chat.", variant: "destructive" });
        }
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + '-user', // Ensure unique ID
      text: trimmedMessage,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message immediately to the UI
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsBotTyping(true); // Assume bot will start "typing"

    // Send message via WebSocket
    // IMPORTANT: Send JSON structured as the backend expects. Usually {"text": message}
    sendMessage(JSON.stringify({ text: trimmedMessage }));


    // Optional: If the backend *doesn't* send typing indicators, you might simulate it
    // setTimeout(() => setIsBotTyping(false), TYPING_INDICATOR_DURATION);
    // But it's better if the backend controls this or if you remove the indicator when the actual message arrives (as done in the useEffect above)

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // Focus input shortly after sending
  };


  // --- UI Effects and Handlers ---

  // Scroll to bottom when messages change or typing starts/stops
  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Welcome message logic (now triggered by WebSocket open)
  // useEffect(() => {
  //   // This logic is moved to the onOpen handler of useWebSocket for better timing
  // }, [isOpen, messages.length, readyState]); // Added readyState dependency


  // Popup scheduling logic
  useEffect(() => {
    if (!isOpen) {
      schedulePopup();
    }
    // Cleanup function to clear timeout
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
        popupTimeoutRef.current = null;
      }
    };
  }, [isOpen]); // Rerun effect when isOpen changes


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenBot = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowEvePopup(false);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
     // Focus input when opening chat mode
     if (mode === 'chat') {
        setTimeout(() => inputRef.current?.focus(), 100);
     }
  };

  const handleCloseBot = () => {
    setIsOpen(false);
    schedulePopup(); // Reschedule popup when closed
  };

  const handleMinimizeBot = () => {
    setIsMinimized(!isMinimized);
  };

  const handleModeToggle = (newMode: Mode) => {
    setMode(newMode);
     // Avoid showing toast if messages haven't started yet
     if (messages.length > 0) { // Check if any messages exist
       const description = newMode === "assistant"
           ? "Here you can access quick services and guidance."
           : "Feel free to ask any questions about eye health.";
       toast({
         title: `Switched to ${newMode === "assistant" ? "Assistant" : "Chat"} Mode`,
         description: description,
       });
     }
      // Focus input if switching to chat mode and bot is open
      if (newMode === 'chat' && isOpen && !isMinimized) {
          setTimeout(() => inputRef.current?.focus(), 100);
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const schedulePopup = () => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      if (!isOpen) {
        setShowEvePopup(true);
      }
    }, POPUP_DELAY);
  };

  const handleCloseEvePopup = () => {
    setShowEvePopup(false);
    // Optionally reschedule popup after dismissal
    // schedulePopup();
  };

  // --- Render ---
  return (
    <>
      {/* Bot toggle button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative flex flex-col items-center">
            {showEvePopup && <EvePopup onClose={handleCloseEvePopup} />}
            <span
              className="absolute top-0 left-0 inline-flex h-14 w-14 rounded-full bg-blue-600 opacity-75 animate-ping"
              style={{ animationDuration: "1.5s" }}
            />
            <Button
              className="relative rounded-full w-14 h-14 p-0 bg-blue-900 hover:bg-blue-900 shadow-lg flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 z-10" // Adjusted hover color
              onClick={handleOpenBot}
              aria-label="Open G-Nayana Chat Assistant"
            >
              <Eye className="w-7 h-7 text-white" />
            </Button>
          </div>
        </div>
      )}

      {/* Bot interface */}
      {isOpen && (
        <div
          className={cn(
            "fixed right-6 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out overflow-hidden z-50 flex flex-col",
            isMinimized
              ? "bottom-6 w-64 h-16"
              : "bottom-6 w-[350px] md:w-[400px] h-[600px] max-h-[calc(100vh-4rem)]"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <GNayanaAvatar size={isMinimized ? "sm" : "md"} />
              <div>
                <h3 className="font-semibold text-white">G-Nayana</h3>
                {!isMinimized && (
                  <p className="text-xs text-cyan-100">
                    {/* Dynamically show connection status */}
                     {connectionStatus === 'Connected' ? 'Your Eye Health Assistant' : connectionStatus}
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
                aria-label={isMinimized ? "Maximize Chat" : "Minimize Chat"}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseBot}
                className="h-7 w-7 rounded-full text-white hover:bg-white/20"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body - only rendered when not minimized */}
          {!isMinimized && (
            <div className="flex flex-col flex-grow min-h-0">
              {/* Mode Toggle */}
              <div className="flex border-b flex-shrink-0">
                 {/* Mode buttons... (unchanged) */}
                 <button
                   className={cn(
                     "flex-1 p-3 text-sm font-medium flex items-center justify-center space-x-1 transition-colors duration-150",
                     mode === "chat"
                       ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500"
                       : "text-gray-600 hover:bg-gray-100"
                   )}
                   onClick={() => handleModeToggle("chat")}
                 >
                   <MessageSquare className="w-4 h-4" />
                   <span>Chat</span>
                 </button>
                 <button
                   className={cn(
                     "flex-1 p-3 text-sm font-medium flex items-center justify-center space-x-1 transition-colors duration-150",
                     mode === "assistant"
                       ? "bg-cyan-50 text-cyan-700 border-b-2 border-cyan-500"
                       : "text-gray-600 hover:bg-gray-100"
                   )}
                   onClick={() => handleModeToggle("assistant")}
                 >
                   <Lightbulb className="w-4 h-4" />
                   <span>Assistant</span>
                 </button>
              </div>

              {/* Content Area */}
              <div className="flex-grow overflow-hidden">
                {mode === "chat" ? (
                  <div className="h-full flex flex-col">
                    {/* Messages Container */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-300"> {/* Added scrollbar styling */}
                      {messages.map((msg) => (
                         <div
                           key={msg.id} // Use the unique ID generated
                           className={cn(
                             "flex",
                             msg.sender === "user" ? "justify-end" : "justify-start"
                           )}
                         >
                           <div
                             className={cn(
                               "flex items-end max-w-[85%]",
                               msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                             )}
                           >
                             {msg.sender === "bot" && (
                               <GNayanaAvatar size="sm" className="mr-2 mb-1 self-start flex-shrink-0" />
                             )}
                             <Card
                               className={cn(
                                 "p-3 rounded-lg shadow-sm", // Added subtle shadow
                                 msg.sender === "user"
                                   ? "bg-cyan-600 text-white rounded-br-none"
                                   : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                               )}
                             >
                               <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p> {/* Allow line breaks */}
                               <p className="text-xs mt-1 opacity-70 text-right">
                                 {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                               </p>
                             </Card>
                           </div>
                         </div>
                       ))}
                      {/* Typing Indicator */}
                      {isBotTyping && (
                        <div className="flex items-end mb-4 max-w-[85%]">
                          <GNayanaAvatar size="sm" className="mr-2 mb-1 self-start flex-shrink-0" />
                          <Card className="p-3 bg-white border border-gray-200 rounded-lg rounded-bl-none shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                            </div>
                          </Card>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white flex-shrink-0">
                      <div className="flex space-x-2 items-center">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder={
                             readyState === ReadyState.OPEN
                               ? "Ask about eye health..."
                                : "Connecting..."
                           }
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="flex-1"
                          disabled={readyState !== ReadyState.OPEN} // Disable input if not connected
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-teal-600 hover:bg-teal-700 rounded-full w-10 h-10 p-0 flex items-center justify-center disabled:opacity-50" // Add disabled style
                          disabled={!message.trim() || isBotTyping || readyState !== ReadyState.OPEN} // Disable when typing, empty, or not connected
                          aria-label="Send Message"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AssistantMode /> // Assistant mode content
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GNayanaBot;