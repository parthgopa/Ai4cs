import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import "../styles/BusinessStrategist.css";
import { backend_URL } from "./HomePage";
import { FaPaperPlane } from "react-icons/fa";

const BusinessStrategist = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [functionName, setFunctionName] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 9 Strategy Functions
  const strategyFunctions = [
    { id: "business_diagnosis", name: "Business Diagnosis", image: "/images/diagnosis.jpeg" },
    { id: "market_analysis", name: "Market Analysis", image: "/images/market.jpeg" },
    { id: "strategic_planning", name: "Strategic Planning", image: "/images/planning.jpeg" },
    { id: "financial_strategy", name: "Financial Strategy", image: "/images/financial.jpeg" },
    { id: "gtm_strategy", name: "GTM Strategy", image: "/images/gtm.jpeg" },
    { id: "operations_optimization", name: "Operations", image: "/images/operations.jpeg" },
    { id: "risk_management", name: "Risk Management", image: "/images/risk.jpeg" },
    { id: "leadership_support", name: "Leadership Support", image: "/images/leadership.jpeg" },
    { id: "execution_roadmap", name: "Execution Roadmap", image: "/images/execution.jpeg" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFunctionSelect = (func) => {
    setSelectedFunction(func);
    setShowConfirmation(true);
  };

  const handleConfirmStart = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      const response = await fetch(`${backend_URL}/business-strategist/consultation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "start",
          function_type: selectedFunction.id
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start consultation");
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setFunctionName(data.function_name);
      setConsultationStarted(true);
      
      setMessages([
        {
          type: "ai",
          content: data.question,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Error starting consultation:", error);
      alert("Failed to start consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setSelectedFunction(null);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !sessionId) return;

    const userMessage = {
      type: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch(`${backend_URL}/business-strategist/consultation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "next",
          session_id: sessionId,
          answer: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get next question");
      }

      const data = await response.json();
      
      const aiMessage = {
        type: "ai",
        content: data.question,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConsultation = () => {
    setSessionId(null);
    setMessages([]);
    setUserInput("");
    setConsultationStarted(false);
    setSelectedFunction(null);
    setFunctionName("");
  };

  return (
    <div className="business-strategist-page">
      <Container fluid className="h-100">
        <Row className="justify-content-center h-100">
          <Col xs={12} lg={10} xl={9} className="h-100">
            <div className="strategist-container">
              <div className="strategist-header">
                <h1 className="strategist-title">Strategex AI</h1>
                <p className="strategist-subtitle">
                  AI-Powered Business Strategy Consultant
                </p>
              </div>

              {!consultationStarted ? (
                <div className="function-selection">
                  <h2 className="selection-title">Select Your Strategic Focus</h2>
                  <p className="selection-subtitle">Choose one area to begin your consultation</p>
                  
                  <div className="functions-grid">
                    {strategyFunctions.map((func) => (
                      <Card 
                        key={func.id} 
                        className="function-card"
                        onClick={() => handleFunctionSelect(func)}
                      >
                        <Card.Body className="function-card-body">
                          <div className="function-image-wrapper">
                            <img 
                              src={func.image} 
                              alt={func.name}
                              className="function-image"
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23666'%3E{func.name}%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                          <h5 className="function-name">{func.name}</h5>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="chat-container">
                  <div className="chat-header-bar">
                    <h4 className="chat-function-title">{functionName}</h4>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={resetConsultation}
                    >
                      Change Function
                    </Button>
                  </div>
                  <div className="chat-messages" ref={chatContainerRef}>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`message ${message.type === "user" ? "user-message" : "ai-message"}`}
                      >
                        {/* <div className="message-avatar">
                          {message.type === "user" ? "👤" : "🤖"}
                        </div> */}
                        <div className="message-content">
                          <div className="message-header">
                            {/* <span className="message-sender">
                              {message.type === "user" ? "You" : "Business Strategist"}
                            </span> */}
                            {/* <span className="message-time">{message.timestamp}</span> */}
                          </div>
                          <div className="message-text">
                            <ReactMarkdown>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="message ai-message">
                        {/* <div className="message-avatar">🤖</div> */}
                        <div className="message-content">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Type your answer here..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        className="chat-input"
                      />
                      <button
                        variant="primary"
                        onClick={sendMessage}
                        disabled={loading || !userInput.trim()}
                        className="send-btn"
                      >
                        {loading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <FaPaperPlane />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCancelConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Strategy Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You have selected:</p>
          <h5 className="text-primary">{selectedFunction?.name}</h5>
          <p className="mt-3">
            Would you like to continue and create a strategy for this function?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirmation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmStart} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Starting...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BusinessStrategist;
