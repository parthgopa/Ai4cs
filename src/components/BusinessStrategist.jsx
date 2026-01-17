import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import "../styles/BusinessStrategist.css";
import { backend_URL } from "./HomePage";
import { FaSuitcase, FaSuitcaseRolling, FaPaperPlane } from "react-icons/fa";
import { FaSuitcaseMedical } from "react-icons/fa6";

const BusinessStrategist = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConsultation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backend_URL}/business-strategist/consultation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "start"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start consultation");
      }

      const data = await response.json();
      setSessionId(data.session_id);
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
  };

  return (
    <div className="business-strategist-page">
      <Container fluid className="h-100">
        <Row className="justify-content-center h-100">
          <Col xs={12} lg={10} xl={9} className="h-100">
            <div className="strategist-container">
              <div className="strategist-header">
                <h1 className="strategist-title">Business Strategist</h1>
                <p className="strategist-subtitle">
                  AI-Powered Senior Management Consultant
                </p>
              </div>

              {!consultationStarted ? (
                <Card className="welcome-card">
                  <Card.Body>
                    <div className="welcome-content">
                      {/* <div className="welcome-icon"> <FaSuitcaseRolling /></div> */}
                      <h2 style={{marginTop :"25px"}}>Welcome to Business Strategist</h2>
                      <p className="welcome-description">
                        Get expert strategic advice on business functions including:
                      </p>
                      <ul className="features-list">
                        <li>Business Diagnosis & Problem Identification</li>
                        <li>Market & Competitive Analysis</li>
                        <li>Strategic Planning & Growth Strategy</li>
                        <li>Financial Strategy & Profitability</li>
                        <li>Go-To-Market Strategy</li>
                        <li>Operations & Process Optimization</li>
                        <li>Risk Management & Business Continuity</li>
                        <li>Leadership / Board-Level Decision Support</li>
                      </ul>
                      
                    </div>
                    <Button
                        className="start-btn"
                        onClick={startConsultation}
                        disabled={loading}
                      >
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
                          "Start Consultation"
                        )}
                      </Button>
                  </Card.Body>
                </Card>
              ) : (
                <div className="chat-container">
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
    </div>
  );
};

export default BusinessStrategist;
