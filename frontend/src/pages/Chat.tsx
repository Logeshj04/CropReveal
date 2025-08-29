/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  ChevronDown,
  Image as ImageIcon,
  X,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { Card } from "../components/UI/Card";
import { Button } from "../components/UI/Button";
import { Badge } from "../components/UI/Badge";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { DiagnosisResult } from "../types/index";
import { apiService } from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  image?: string;
}

interface KnowledgeCard {
  title: string;
  description: string;
  type: "remedy" | "prevention" | "symptom";
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your Agri AI Assistant. I can help you with crop diseases, pest identification, treatment recommendations, and agricultural best practices. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [history] = useLocalStorage<DiagnosisResult[]>("diagnosis-history", []);
  const [diagnosisContext, setDiagnosisContext] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for diagnosis context when component mounts
  useEffect(() => {
    const storedContext = localStorage.getItem("diagnosis-context");
    if (storedContext) {
      try {
        const context = JSON.parse(storedContext);
        setDiagnosisContext(context);

        // Clear the stored context so it doesn't trigger again
        localStorage.removeItem("diagnosis-context");

        // Add a welcome message with diagnosis context
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `I see you've just diagnosed your ${context.crop} with ${
            context.condition
          }. The detection confidence was ${Math.round(
            context.confidence * 100
          )}%. How can I help you with treatment recommendations, prevention strategies, or any other questions about this condition?`,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, welcomeMessage]);
      } catch (error) {
        console.error("Error parsing diagnosis context:", error);
      }
    }
  }, []);

  const getCommonQueries = () => {
    if (diagnosisContext) {
      const { condition, crop } = diagnosisContext;
      return [
        `What are the best treatments for ${condition}?`,
        `How to prevent ${condition} from spreading?`,
        `What causes ${condition} in ${crop}?`,
        `Are there organic treatments for ${condition}?`,
        `How long does it take to recover from ${condition}?`,
        `What are the early signs of ${condition}?`,
      ];
    }

    return [
      "How to prevent rice brown spot?",
      "What causes tomato leaf curl?",
      "Best organic pesticides for aphids",
      "Signs of apple scab disease",
      "How to treat corn blight?",
      "Natural remedies for spider mites",
    ];
  };

  const commonQueries = getCommonQueries();

  const knowledgeCards: KnowledgeCard[] = [
    {
      title: "Integrated Pest Management",
      description:
        "Use beneficial insects, crop rotation, and targeted treatments",
      type: "prevention",
    },
    {
      title: "Early Disease Detection",
      description: "Regular monitoring and prompt treatment prevent spread",
      type: "symptom",
    },
    {
      title: "Organic Treatments",
      description: "Neem oil, copper fungicides, and biological controls",
      type: "remedy",
    },
  ];
  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText || "Uploaded an image for analysis",
      sender: "user",
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedImage("");
    setIsTyping(true);

    try {
      let enhancedQuery = inputText;

      // If there's diagnosis context, include it in the query for better AI responses
      if (diagnosisContext) {
        enhancedQuery = `Context: I have ${diagnosisContext.crop} with ${
          diagnosisContext.condition
        } (${Math.round(
          diagnosisContext.confidence * 100
        )}% confidence). Question: ${inputText}`;
      }

      const response = await apiService.chatWithAI({
        query: enhancedQuery,
        language: selectedLanguage,
      });

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get response. Please try again.";

      // Show error message to user
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQueryClick = (query: string) => {
    setInputText(query);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "remedy":
        return <Lightbulb className="w-4 h-4" />;
      case "prevention":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "remedy":
        return "text-green-600";
      case "prevention":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  // Add this function to handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    
    // Add a system message to indicate language change
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Switched to ${newLanguage} language. I'll respond in ${newLanguage} from now on.`,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Agri AI Assistant
                  {diagnosisContext && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Diagnosis Mode
                    </span>
                  )}
                </h1>
                <p className="text-sm text-green-600">
                  {diagnosisContext
                    ? `Discussing ${diagnosisContext.condition}`
                    : "Online • Ready to help"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
              </select>
              {diagnosisContext && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDiagnosisContext(null)}
                  className="text-xs"
                >
                  Clear Context
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                Knowledge
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
                    message.sender === "user" ? "order-2" : "order-1"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-green-100 text-gray-900 ml-auto"
                        : "bg-white text-gray-900 shadow-sm border border-gray-200"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 mb-2">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-4 mb-2">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-green-200 px-1 py-0.5 rounded text-sm">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-green-200 p-2 rounded text-sm overflow-x-auto">
                            {children}
                          </pre>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImage("")}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crop diseases, pests, or treatments..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />

              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Upload image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() && !selectedImage}
              className="px-4 py-3 rounded-2xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Knowledge Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden lg:block bg-white border-l border-gray-200 overflow-hidden"
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Knowledge Center
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Diagnosis Context */}
              {diagnosisContext && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Current Diagnosis
                  </h3>
                  <Card className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={diagnosisContext.imageUrl}
                        alt="Current diagnosis"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {diagnosisContext.condition}
                        </p>
                        <p className="text-xs text-gray-600">
                          {diagnosisContext.crop} •{" "}
                          {Math.round(diagnosisContext.confidence * 100)}%
                          confidence
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Recent Diagnosis */}
              {history.length > 0 && !diagnosisContext && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Recent Diagnosis
                  </h3>
                  <Card className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={history[0].imageUrl}
                        alt="Recent diagnosis"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {history[0].detectedClass
                            .split("___")[1]
                            ?.replace(/_/g, " ")}
                        </p>
                        <Badge
                          variant={
                            history[0].healthStatus.toLowerCase() as
                              | "healthy"
                              | "disease"
                              | "pest"
                          }
                          size="sm"
                        >
                          {history[0].healthStatus}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Knowledge Cards */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Tips
                </h3>
                <div className="space-y-3">
                  {knowledgeCards.map((card, index) => (
                    <Card
                      key={index}
                      className="p-3 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`mt-0.5 ${getTypeColor(card.type)}`}>
                          {getTypeIcon(card.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {card.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Common Queries */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Common Questions
                </h3>
                <div className="space-y-2">
                  {commonQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleQueryClick(query)}
                      className="w-full text-left p-2 text-xs text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-10"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}