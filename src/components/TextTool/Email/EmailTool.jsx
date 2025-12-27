import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaReply, FaSpinner, FaArrowLeft } from "react-icons/fa";
import APIService from "../../../Common/API";
import NewEmail from "./NewEmail";
import EmailReply from "./EmailReply";
import ResponseDisplay from "../ResponseDisplay";
import "./EmailTool.css";

const EmailTool = () => {
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

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let prompt = "";

    if (type === "new-email") {
      prompt = `You are my Email Writing Assistant.

Your task is to draft a professional email based on the following inputs:

Content Details/stats:
- 
- To:.
- Subject: 
- Context:
- 
Output Preferences:
- Language: ${data.language}
- Tone: ${data.tone}
- Include References/Case Law: ${data.references}
- Length: ${data.length}
- Closing: ${data.closingConnotation}
- Signatory: ${data.signatory}

Instructions:
1. Auto-insert today's date (${currentDate}) at top-right of the email
2. Show Subject line on top
3. Write the body in short paragraphs (1-3 sentences each)
4. End with closing connotation + signatory
5. Keep formatting clean and copy-paste ready (Note format)
6. Use ${data.tone.toLowerCase()} tone throughout
7. Write in ${data.language}
8. ${
        data.references === "Yes"
          ? "Include relevant legal references or case laws where applicable"
          : "Do not include legal references or case laws"
      }
9. Make it ${data.length.toLowerCase()} in length

Format the email professionally with proper spacing and structure. Make it ready for immediate use.

Remove all introductory paragraph, end notes and any other non-relevant content.`;
    } 
    
    
    else if (type === "email-reply") {
      prompt = `You are my Email Reply Assistant.

Original Email:
${data.originalEmail}

Reply Requirements:
- To: ${data.to}
- Subject: ${data.subject}
- Connotation: ${data.connotation}
- Reply Matter: ${data.replyMatter}
- Additional Matter: ${data.additionalMatter || "None"}
- Tone: ${data.tone}
- Size: ${data.size}
- Closing: ${data.closing}
- Signature: ${data.signature}
- Language: ${data.language}

Instructions:
1. Auto-insert today's date (${currentDate}) at top-right
2. Generate an appropriate subject line (Re: ${data.subject})
3. Start with ${data.connotation} ${data.to}
4. Write a professional reply with ${data.tone.toLowerCase()} tone
5. Address the reply matter: ${data.replyMatter}
6. Include additional matter if provided: ${data.additionalMatter || "None"}
7. Make it ${data.size.toLowerCase()} in length
8. End with ${data.closing} and ${data.signature}
9. Write in ${data.language}
10. Keep formatting clean and copy-paste ready
11. Include appropriate greeting and closing

Format the reply professionally with proper spacing and structure.

Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse(
              "Sorry, we couldn't generate the email. Please try again."
            );
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while generating the email. Please try again later."
      );
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