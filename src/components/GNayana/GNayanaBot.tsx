// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import {
//   ArrowUp,
//   X,
//   MessageSquare,
//   Lightbulb,
//   Eye,
//   Minimize2, // This is for the *full* minimize/collapse
//   Maximize2, // Import this for expanding width
// } from "lucide-react"; // Ensure Maximize2 is imported
// import { cn } from "@/lib/utils";
// import GNayanaAvatar from "./GNayanaAvatar";
// import AssistantMode from "./AssistantMode";
// import { useToast } from "@/components/ui/use-toast";
// import EvePopup from "@/components/popcomponent/popcomponent";
// import FriendlyBotGreeting from "@/components/GNayana/AnimatedBotGreeting";

// import useWebSocket, { ReadyState } from "react-use-websocket";

// // ... (Keep existing constants and types) ...
// type Message = {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// };

// type Mode = "chat" | "assistant";

// const WEBSOCKET_URL =
//   "wss://g-nayan-chatbot-latest.onrender.com/ws/Gnayana_chat";
// const WELCOME_MESSAGE_DELAY = 1000;
// const TYPING_INDICATOR_DURATION = 1500;
// const POPUP_DELAY = 10000;

// // Define standard and maximized widths
// const STANDARD_WIDTH = "w-[300px]"; // Your original open width
// const MAXIMIZED_WIDTH = "w-[500px]"; // The expanded width (adjust as needed)

// const OPEN_BOTTOM_OFFSET = "bottom-[5.5rem]"; // Approx 1.5rem + 3.5rem + 0.5rem
// const MINIMIZED_BOTTOM_OFFSET = "bottom-6"; // Keep minimized bar near the bottom corner

// const GNayanaBot: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false); // Full collapse state
//   const [isWidthMaximized, setIsWidthMaximized] = useState(false); // <-- New state for width
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [mode, setMode] = useState<Mode>("chat");
//   const [isBotTyping, setIsBotTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();
//   const [showEvePopup, setShowEvePopup] = useState(false);
//   const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [showGreeting, setShowGreeting] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false); // Still needed for greeting logic

//   // --- WebSocket Connection ---
//   const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
//     onOpen: () => {
//       console.log("WebSocket connection established.");
//       // Potentially add welcome logic here if needed when WS connects *after* open
//     },
//     onClose: (event) => {
//       console.log("WebSocket connection closed:", event.code, event.reason);
//       toast({
//         title: "Connection Lost",
//         description: "Chat disconnected. Trying to reconnect...",
//         variant: "destructive",
//       });
//     },
//     onError: (error) => {
//       console.error("WebSocket error:", error);
//       toast({
//         title: "Connection Error",
//         description: "Could not connect to the chat service.",
//         variant: "destructive",
//       });
//     },
//     shouldReconnect: (closeEvent) => true,
//     reconnectInterval: 3000,
//   });

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: "Connecting",
//     [ReadyState.OPEN]: "Connected",
//     [ReadyState.CLOSING]: "Closing",
//     [ReadyState.CLOSED]: "Disconnected",
//     [ReadyState.UNINSTANTIATED]: "Uninstantiated",
//   }[readyState];

//   // --- Message Handling ---
//   useEffect(() => {
//     if (lastMessage !== null) {
//       setIsBotTyping(false);
//       try {
//         const parsedData = JSON.parse(lastMessage.data);
//         if (parsedData && typeof parsedData.text === "string") {
//           const botMessage: Message = {
//             id: Date.now().toString() + "-bot",
//             text: parsedData.text,
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setMessages((prev) => [...prev, botMessage]);
//         } else {
//           console.warn("Received non-standard message:", parsedData);
//           // Handle other potential message structures if needed
//         }
//       } catch (err) {
//         console.warn("Non-JSON message received:", lastMessage.data);
//         // Fallback for plain text messages, if backend might send them
//         const plainTextMessage: Message = {
//           id: Date.now().toString() + "-bot-plain",
//           text: lastMessage.data,
//           sender: "bot",
//           timestamp: new Date(),
//         };
//         setMessages((prev) => [...prev, plainTextMessage]);
//       }
//     }
//   }, [lastMessage]);

//   const handleSendMessage = () => {
//     const trimmedMessage = message.trim();
//     if (!trimmedMessage || readyState !== ReadyState.OPEN) {
//       // Handle no connection or empty message
//       return;
//     }
//     const userMessage: Message = {
//       id: Date.now().toString() + "-user",
//       text: trimmedMessage,
//       sender: "user",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setMessage("");
//     setIsBotTyping(true);
//     sendMessage(JSON.stringify({ text: trimmedMessage })); // Send JSON
//     setTimeout(() => inputRef.current?.focus(), 100);
//   };

//   // --- UI Effects and Handlers ---

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isBotTyping]);

//   // Popup scheduling
//   useEffect(() => {
//     if (!isOpen) {
//       schedulePopup();
//     }
//     return () => {
//       if (popupTimeoutRef.current) {
//         clearTimeout(popupTimeoutRef.current);
//       }
//     };
//   }, [isOpen]);

//   // Greeting logic (no changes needed here)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!isChatOpen && !isOpen) {
//         // Only show if main chat isn't explicitly open OR the bot widget isn't open
//         setShowGreeting(true);
//       }
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [isChatOpen, isOpen]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleOpenBot = () => {
//     setIsOpen(true);
//     setIsMinimized(false); // Ensure not fully minimized
//     // setIsWidthMaximized(false); // Reset width state on open? Optional, maybe keep last state. Let's keep it for now.
//     setShowEvePopup(false);
//     setShowGreeting(false); // Hide greeting when bot is opened
//     if (popupTimeoutRef.current) {
//       clearTimeout(popupTimeoutRef.current);
//     }
//     if (mode === "chat") {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//     setIsChatOpen(true); // Also update the greeting state tracker
//   };

//   const handleCloseBot = () => {
//     setIsOpen(false);
//     setIsChatOpen(false); // Update greeting state tracker
//     schedulePopup();
//     // Optionally reset width state on close:
//     // setIsWidthMaximized(false);
//   };

//   // This handles the FULL collapse/restore
//   const handleToggleMinimize = () => {
//     setIsMinimized(!isMinimized);
//     // When restoring, ensure focus if it was in chat mode
//     if (!isMinimized && mode === "chat" && isOpen) {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };

//   // <-- New Handler for Width Toggle -->
//   const handleToggleWidth = () => {
//     setIsWidthMaximized((prev) => !prev);
//   };

//   const handleModeToggle = (newMode: Mode) => {
//     setMode(newMode);
//     // ... (toast logic remains the same) ...
//     if (newMode === "chat" && isOpen && !isMinimized) {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const schedulePopup = () => {
//     // ... (scheduling logic remains the same) ...
//     if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
//     popupTimeoutRef.current = setTimeout(() => {
//       if (!isOpen) {
//         // Check if bot is still closed
//         setShowEvePopup(true); // Use EvePopup or FriendlyBotGreeting here
//         // setShowGreeting(true); // Or trigger the greeting bubble
//       }
//     }, POPUP_DELAY);
//   };

//   // Use handleOpenBot when the greeting bubble is clicked
//   const handleTriggerOpenChat = () => {
//     handleOpenBot(); // Just call the existing open handler
//   };

//   const handleCloseEvePopup = () => {
//     setShowEvePopup(false);
//     // Optionally reschedule popup after dismissal
//     // schedulePopup();
//   };

//   return (
//     <>
//       {/* Bot toggle button & Greeting */}
//       {!isOpen && (
//         <div className="fixed bottom-6 right-6 z-40">
//           <div className="relative flex flex-col items-center">
//             <div className="bot">
//               {showEvePopup && (
//                 // <EvePopup onClose={handleCloseEvePopup}
//                 <FriendlyBotGreeting
//                   isVisible={showGreeting && !isChatOpen} // Show condition
//                   onOpenChat={handleTriggerOpenChat}
//                 />
//               )}
//             </div>
//             <span
//               className="absolute  top-0 left-0 inline-flex h-14 w-14 rounded-full bg-blue-600 opacity-75 animate-ping"
//               style={{ animationDuration: "1.5s" }}
//             />
//             <Button
//               className="relative rounded-full w-14 h-14 p-0 bg-blue-900 hover:bg-blue-900 shadow-lg flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 z-10" // Adjusted hover color
//               onClick={handleOpenBot}
//               aria-label="Open G-Nayana Chat Assistant"
//             >
//               <Eye className="w-7 h-7 text-white" />
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Bot interface */}
//       {isOpen && (
//         <div
//         // <-- Key Change: Update bottom positioning -->
//         className={cn(
//           "fixed right-6 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out overflow-hidden z-50 flex flex-col",
//           // Full collapse state (stays near corner)
//           isMinimized
//             ? `${MINIMIZED_BOTTOM_OFFSET} w-64 h-16`
//             // Open states (standard or maximized width, positioned above button)
//             : `${OPEN_BOTTOM_OFFSET} h-[400px] max-h-[calc(100vh-7rem)] ${ // Adjusted max-height slightly due to higher bottom offset
//                 isWidthMaximized ? MAXIMIZED_WIDTH : STANDARD_WIDTH
//               }`
//         )}
//       >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-2 py-1 flex justify-between items-center flex-shrink-0">
//             <div className="flex items-center space-x-2">
//               <GNayanaAvatar size={isMinimized ? "sm" : "md"} />
//               {!isMinimized && ( // Only show text if not fully minimized
//                 <div>
//                   <h3 className="font-semibold text-white">G-Nayana</h3>
//                   {/* Optional: Status or mode text */}
//                 </div>
//               )}
//             </div>
//             <div className="flex space-x-1 items-center">
//               {" "}
//               {/* Added items-center */}
//               {/* <-- New Width Toggle Button --> */}
//               {!isMinimized && ( // Only show when not fully minimized
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleToggleWidth} // Use the new handler
//                   className="h-7 w-7 rounded-full text-white hover:bg-white/20"
//                   aria-label={
//                     isWidthMaximized ? "Restore Width" : "Expand Width"
//                   }
//                 >
//                   {isWidthMaximized ? (
//                     <Minimize2 className="h-4 w-4" /> // Icon when expanded (to shrink width)
//                   ) : (
//                     <Maximize2 className="h-4 w-4" /> // Icon when standard (to expand width)
//                   )}
//                 </Button>
//               )}
//               {/* Full Minimize/Restore Button */}
//               {/* Close Button */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleCloseBot}
//                 className="h-7 w-7 rounded-full text-white hover:bg-white/20"
//                 aria-label="Close Chat"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Body - only rendered when not fully minimized */}
//           {!isMinimized && (
//             <div className="flex flex-col flex-grow min-h-0">
//               {/* Mode Toggle (optional, keep if needed) */}
//               {/* <div className="flex border-b flex-shrink-0"> ... </div> */}

//               {/* Content Area */}
//               <div className="flex-grow overflow-hidden">
//                 {mode === "chat" ? (
//                   <div className="h-full flex flex-col">
//                     {/* Messages Container */}
//                     <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-300">
//                       {messages.map((msg) => (
//                         // ... (message rendering remains the same) ...
//                         <div
//                           key={msg.id}
//                           className={cn(
//                             "flex",
//                             msg.sender === "user"
//                               ? "justify-end"
//                               : "justify-start"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "flex items-end max-w-[85%]",
//                               msg.sender === "user"
//                                 ? "flex-row-reverse"
//                                 : "flex-row"
//                             )}
//                           >
//                             {msg.sender === "bot" && (
//                               <GNayanaAvatar
//                                 size="sm"
//                                 className="mr-2 mb-1 self-start flex-shrink-0"
//                               />
//                             )}
//                             <Card
//                               className={cn(
//                                 "p-3 rounded-lg shadow-sm",
//                                 msg.sender === "user"
//                                   ? "bg-cyan-600 text-white rounded-br-none"
//                                   : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
//                               )}
//                             >
//                               <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                                 {msg.text}
//                               </p>
//                               <p className="text-xs mt-1 opacity-70 text-right">
//                                 {msg.timestamp.toLocaleTimeString([], {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   hour12: true,
//                                 })}
//                               </p>
//                             </Card>
//                           </div>
//                         </div>
//                       ))}
//                       {/* Typing Indicator */}
//                       {isBotTyping && (
//                         <div className="flex items-end mb-4 max-w-[85%]">
//                           <GNayanaAvatar
//                             size="sm"
//                             className="mr-2 mb-1 self-start flex-shrink-0"
//                           />
//                           <Card className="p-3 bg-white border border-gray-200 rounded-lg rounded-bl-none shadow-sm">
//                             <div className="flex space-x-1">
//                               <div
//                                 className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                                 style={{ animationDelay: "0ms" }}
//                               ></div>
//                               <div
//                                 className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                                 style={{ animationDelay: "200ms" }}
//                               ></div>
//                               <div
//                                 className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                                 style={{ animationDelay: "400ms" }}
//                               ></div>
//                             </div>
//                           </Card>
//                         </div>
//                       )}
//                       <div ref={messagesEndRef} />
//                     </div>

//                     {/* Input Area */}
//                     <div className="p-3 border-t bg-white flex-shrink-0">
//                       <div className="flex space-x-2 items-center">
//                         <Input
//                           ref={inputRef}
//                           type="text"
//                           placeholder={
//                             readyState === ReadyState.OPEN
//                               ? "Ask about eye health..."
//                               : "Connecting..."
//                           }
//                           value={message}
//                           onChange={(e) => setMessage(e.target.value)}
//                           onKeyDown={handleKeyPress}
//                           className="flex-1"
//                           disabled={readyState !== ReadyState.OPEN}
//                         />
//                         <Button
//                           onClick={handleSendMessage}
//                           className="bg-teal-600 hover:bg-teal-700 rounded-full w-10 h-10 p-0 flex items-center justify-center disabled:opacity-50"
//                           disabled={
//                             !message.trim() ||
//                             isBotTyping ||
//                             readyState !== ReadyState.OPEN
//                           }
//                           aria-label="Send Message"
//                         >
//                           <ArrowUp className="h-5 w-5" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <AssistantMode /> // Assistant mode content
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default GNayanaBot;

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUp, X, Eye, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GNayanaAvatar from "./GNayanaAvatar";
import FriendlyBotGreeting from "@/components/GNayana/AnimatedBotGreeting";
import { useToast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:7000/chat/";
const WELCOME_MESSAGE_DELAY = 1000;
const POPUP_DELAY = 10000;
const STANDARD_WIDTH = "w-[300px]";
const MAXIMIZED_WIDTH = "w-[500px]";
const OPEN_BOTTOM_OFFSET = "bottom-[5.5rem]";
const MINIMIZED_BOTTOM_OFFSET = "bottom-6";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const GNayanaBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isWidthMaximized, setIsWidthMaximized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !isChatOpen) setShowGreeting(true);
    }, WELCOME_MESSAGE_DELAY);
    return () => clearTimeout(timer);
  }, [isOpen, isChatOpen]);

  useEffect(() => {
    if (!isOpen) schedulePopup();
    return () => {
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, [isOpen]);

  const schedulePopup = () => {
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    popupTimeoutRef.current = setTimeout(() => {
      if (!isOpen) setShowGreeting(true);
    }, POPUP_DELAY);
  };

  const handleSendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString() + "-user",
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsBotTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: trimmed }),
      });
      const data = await response.json();
      const botText = data["G-Nayan"] ?? data.reply ?? data.text ?? "";
      const botMsg: Message = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to get reply.",
        variant: "destructive",
      });
    } finally {
      setIsBotTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleOpenBot = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowGreeting(false);
    setIsChatOpen(true);
  };

  const handleCloseBot = () => {
    setIsOpen(false);
    setIsChatOpen(false);
    schedulePopup();
  };

  const handleToggleWidth = () => setIsWidthMaximized((prev) => !prev);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          {showGreeting && (
            <FriendlyBotGreeting onOpenChat={handleOpenBot} isVisible={false} />
          )}
          <Button
            aria-label="Open G-Nayana Chatbot"
            onClick={handleOpenBot}
            className="w-14 h-14 rounded-full bg-blue-900"
          >
            <Eye className="w-7 h-7 text-white" />
          </Button>
        </div>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed right-6 bg-white rounded-2xl shadow-xl z-50 flex flex-col transition-all overflow-hidden",
            isMinimized
              ? `${MINIMIZED_BOTTOM_OFFSET} w-64 h-16`
              : `${OPEN_BOTTOM_OFFSET} h-[400px] ${
                  isWidthMaximized ? MAXIMIZED_WIDTH : STANDARD_WIDTH
                }`
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <GNayanaAvatar size={isMinimized ? "sm" : "md"} />
              {!isMinimized && (
                <h3 className="text-white font-semibold">G-Nayana</h3>
              )}
            </div>
            <div className="flex space-x-1">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleWidth}
                  className="h-7 w-7 text-white hover:bg-white/20"
                >
                  {isWidthMaximized ? <Minimize2 /> : <Maximize2 />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseBot}
                className="h-7 w-7 text-white hover:bg-white/20"
              >
                <X />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-grow min-h-0">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-300">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn("flex items-end max-w-[85%]", msg.sender === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {msg.sender === "bot" && (
                      <GNayanaAvatar size="sm" className="mr-2 mb-1 self-start" />
                    )}
                    <Card
                      className={cn(
                        "p-3 rounded-lg shadow-sm break-words",
                        msg.sender === "user"
                          ? "bg-cyan-600 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </Card>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex items-end mb-4 max-w-[85%]">
                  <GNayanaAvatar size="sm" className="mr-2 mb-1 self-start" />
                  <Card className="p-3 bg-white border border-gray-200 rounded-lg rounded-bl-none shadow-sm">
                    <div className="flex space-x-1">
                      {[0, 200, 400].map((delay) => (
                        <div
                          key={delay}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex-shrink-0">
              <div className="flex space-x-2 items-center">
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
                  className="bg-teal-600 hover:bg-teal-700 rounded-full w-10 h-10 p-0 flex items-center justify-center disabled:opacity-50"
                  disabled={!message.trim() || isBotTyping}
                >
                  <ArrowUp className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GNayanaBot;
