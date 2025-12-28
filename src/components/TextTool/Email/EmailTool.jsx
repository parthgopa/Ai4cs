import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaReply, FaSpinner } from "react-icons/fa";
import { TextToolAPI } from "../../../Common/API";
import NewEmail from "./NewEmail";
import EmailReply from "./EmailReply";
import ResponseDisplay from "../ResponseDisplay";
import "./EmailTool.css";
import { backend_URL } from "../../HomePage";

const EmailTool = () => {
  // console.log(backend_URL)
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("New Email");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const modes = [
    { key: "New Email", label: "New Email", icon: <FaEnvelope /> },
    { key: "Reply", label: "Reply", icon: <FaReply /> },
  ];

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    setResponse("");
    setLoading(false);
  };

  const resetForm = () => {
    setResponse("");
    setLoading(false);
    setCurrentFormData(null);
  };

  // Generation functions
  const generateEmail = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    try {
      if (type === "new-email") {
        await TextToolAPI.newEmail(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the email. Please try again.");
          }
        });
      } else if (type === "email-reply") {
        await TextToolAPI.replyEmail(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the email. Please try again.");
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the email. Please try again later.");
      console.error("Error:", error);
    }
  };

  // Render mode-specific content
  const renderModeContent = () => {
    if (loading) {
      return (
        <div className="form-card">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Processing...</p>
            <p>Please wait while we process your request.</p>
          </div>
        </div>
      );
    }

    switch (currentMode) {
      case "New Email":
        return <NewEmail onGenerate={generateEmail} />;
      case "Reply":
        return <EmailReply onGenerate={generateEmail} />;
      default:
        return <NewEmail onGenerate={generateEmail} />;
    }
  };

  return (
    <div className="email-tool-page">
      {/* <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate("/office-assistant")}
        >
          <FaArrowLeft className="me-1" />
          Back to Tools
        </button>
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">
              <FaEnvelope />
            </span>
            Email Tool
          </h1>
          <p className="page-description">Create and reply to professional emails</p>
        </div>
      </div> */}

        {/* Mode Selection */}
      <div className="mode-selector">
        <h3 className="mode-title">Choose Action:</h3>
        <div className="mode-buttons-email">
          {modes.map((mode) => (
            <button
              key={mode.key}
              className={`mode-button ${currentMode === mode.key ? 'active' : ''}`}
              onClick={() => handleModeChange(mode.key)}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-label">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Section */}
      <div className="response-section">
        <ResponseDisplay
          response={response}
          currentTool="email"
          currentMode={currentMode}
          formData={currentFormData}
          onReset={resetForm}
          title={
            currentMode === "New Email" && "Draft Email:"
          }
          subject={
            currentMode === "New Email" && currentFormData?.subject
          }
        />
      </div>

      {/* Content Area */}
      {!response && (
        <div className="form-section">
          <div className="form-card">
            {renderModeContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTool;