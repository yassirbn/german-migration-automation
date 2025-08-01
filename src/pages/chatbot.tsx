import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { mockApplications, Application } from "../data/mockApplications";

interface Message {
  type: "user" | "bot";
  content: string;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content:
        "Hello! I'm your virtual assistant for the German Foreign Office. I can help you check your visa application status, understand document requirements, and answer questions about processing times. How may I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Application | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const smoothScrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Use smooth scroll for new messages
    smoothScrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Immediate scroll when typing indicator appears/disappears
    if (isTyping) {
      smoothScrollToBottom();
    }
  }, [isTyping]);

  const authenticateUser = (input: string): string => {
    const cleanInput = input.toLowerCase().trim();

    // Try to authenticate by application ID
    const byId = mockApplications.find((app) =>
      cleanInput.includes(app.id.toLowerCase())
    );

    if (byId) {
      setCurrentUser(byId);
      setIsAuthenticated(true);
      return `Welcome back, ${
        byId.applicantName
      }! I found your ${byId.visaType.replace(
        "_",
        " "
      )} application. How can I help you today?`;
    }

    // Try to authenticate by name and date of birth
    const nameMatch = mockApplications.find((app) => {
      const fullName = app.applicantName.toLowerCase();
      const dob = app.dateOfBirth;
      return (
        cleanInput.includes(fullName.split(" ")[0]) &&
        (cleanInput.includes(dob) ||
          cleanInput.includes(dob.replace(/-/g, ".")))
      );
    });

    if (nameMatch) {
      setCurrentUser(nameMatch);
      setIsAuthenticated(true);
      return `Welcome, ${
        nameMatch.applicantName
      }! I found your ${nameMatch.visaType.replace(
        "_",
        " "
      )} application. How can I help you today?`;
    }

    return "I couldn't find your application. Please provide your application ID (e.g., WP-2024-1234) or your full name and date of birth (e.g., Hans Mueller, born 15.03.1985).";
  };

  const generateIntelligentResponse = (input: string): string => {
    const cleanInput = input.toLowerCase();

    if (!isAuthenticated || !currentUser) {
      return authenticateUser(input);
    }

    // Status inquiry
    if (cleanInput.includes("status") || cleanInput.includes("application")) {
      const status = currentUser.status;
      const visaType = currentUser.visaType.replace("_", " ");

      switch (status) {
        case "documents_required":
          const missingDocs = currentUser.requiredDocuments.filter(
            (doc) => doc?.status === "missing"
          );
          return `Your ${visaType} application is currently waiting for additional documents. You need to submit:\n\n${missingDocs
            .map((doc) => `• ${doc?.name}`)
            .join("\n")}\n\nDeadline: ${
            missingDocs[0]?.deadline || "As soon as possible"
          }\n\nWould you like me to send you the document templates?`;

        case "under_review":
          return `Your ${visaType} application is currently under review. We received all required documents and our team is processing your case. Expected completion: ${currentUser.expectedCompletion}.\n\nYou don't need to take any action at this time. We'll notify you once a decision is made.`;

        case "approved":
          return `Great news! Your ${visaType} application has been approved on ${currentUser.approvalDate}. You should receive your visa within 5-7 business days by mail.\n\nIf you have urgent travel needs, you can collect your passport from our office starting tomorrow.`;

        default:
          return `Your ${visaType} application status is: ${status}. Expected completion: ${currentUser.expectedCompletion}.`;
      }
    }

    // Document requirements
    if (
      cleanInput.includes("document") ||
      cleanInput.includes("paper") ||
      cleanInput.includes("need")
    ) {
      const missingDocs = currentUser.requiredDocuments.filter(
        (doc) => doc?.status === "missing"
      );
      const receivedDocs = currentUser.requiredDocuments.filter(
        (doc) => doc?.status === "received"
      );

      if (missingDocs.length === 0) {
        return `All required documents have been received for your ${currentUser.visaType.replace(
          "_",
          " "
        )} application:\n\n${receivedDocs
          .map((doc) => `✓ ${doc?.name}`)
          .join("\n")}`;
      }

      return `Here's your document status:\n\n**Still needed:**\n${missingDocs
        .map((doc) => `• ${doc?.name} (deadline: ${doc?.deadline})`)
        .join("\n")}\n\n**Already received:**\n${receivedDocs
        .map((doc) => `✓ ${doc?.name}`)
        .join(
          "\n"
        )}\n\nWould you like me to email you the templates for missing documents?`;
    }

    // Timeline inquiry
    if (
      cleanInput.includes("time") ||
      cleanInput.includes("when") ||
      cleanInput.includes("long") ||
      cleanInput.includes("deadline")
    ) {
      const visaType = currentUser.visaType.replace("_", " ");
      const timeline = currentUser.timeline;

      return `Processing timeline for your ${visaType} application:\n\n• Submitted: ${timeline.submitted}\n• Initial Review: ${timeline.initialReview}\n• Expected Decision: ${currentUser.expectedCompletion}\n\nTypical processing time for ${visaType} applications is 6-8 weeks. Your application is progressing normally.`;
    }

    // Urgent/emergency requests
    if (
      cleanInput.includes("urgent") ||
      cleanInput.includes("emergency") ||
      cleanInput.includes("fast")
    ) {
      return `I understand you need urgent processing. For emergency visa requests:\n\n1. Email: emergency-visa@germany.gov with subject "URGENT PROCESSING REQUEST"\n2. Include medical certificates or official documentation of emergency\n3. Pay expedited processing fee (€50)\n4. Processing time reduces to 48-72 hours\n\nI can escalate your case to our emergency team. Would you like me to create an urgent processing request for you?`;
    }

    // Appointment related
    if (
      cleanInput.includes("appointment") ||
      cleanInput.includes("visit") ||
      cleanInput.includes("office")
    ) {
      return `For appointments at the German Foreign Office:\n\n• Online booking: www.germany.diplo.de\n• Phone: +49 (0) 30 1817 0\n• Walk-in hours: Monday-Friday, 8:00-12:00 (limited availability)\n\nFor your ${currentUser.visaType.replace(
        "_",
        " "
      )} application, an appointment is typically not required unless requested by our staff.`;
    }

    // Default intelligent response
    return `I understand you're asking about "${input}". For your ${currentUser.visaType.replace(
      "_",
      " "
    )} application, I can help you with:\n\n• Application status updates\n• Document requirements\n• Processing timelines\n• Appointment scheduling\n• Emergency processing requests\n\nCould you please be more specific about what you'd like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateIntelligentResponse(userMessage);
      setMessages((prev) => [...prev, { type: "bot", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Check my application status",
    "What documents do I need?",
    "How long will processing take?",
    "I need urgent processing",
  ];

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI Chatbot Interface
          </h2>
          <p className="text-gray-600 mb-6">
            Get instant answers about your visa application status, required
            documents, and processing timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="flex flex-col h-96 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center p-4 border-b border-gray-200 bg-blue-50">
                <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Virtual Assistant
                </h3>
                {isAuthenticated && currentUser && (
                  <span className="ml-auto text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {currentUser.applicantName}
                  </span>
                )}
              </div>

              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      isAuthenticated
                        ? "Ask me about your application..."
                        : "Enter your application ID or name and date of birth..."
                    }
                    className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Quick Actions and Help */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(action)}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Applications for Testing */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Test Accounts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Hans Mueller</p>
                  <p className="text-gray-600">ID: WP-2024-1234</p>
                  <p className="text-gray-600">DOB: 15.03.1985</p>
                  <p className="text-xs text-red-600">
                    Status: Documents Required
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-gray-600">ID: SV-2024-7891</p>
                  <p className="text-gray-600">DOB: 22.08.1992</p>
                  <p className="text-xs text-yellow-600">
                    Status: Under Review
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Ahmed Hassan</p>
                  <p className="text-gray-600">ID: TV-2024-3456</p>
                  <p className="text-gray-600">DOB: 03.12.1978</p>
                  <p className="text-xs text-green-600">Status: Approved</p>
                </div>
              </div>
            </div>

            {/* Help Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">How to Use</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  1. Start by providing your application ID or name + date of
                  birth
                </p>
                <p>2. Ask questions about your application status</p>
                <p>3. Request document information or processing timelines</p>
                <p>4. Get help with appointments or urgent requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default ChatbotPage;