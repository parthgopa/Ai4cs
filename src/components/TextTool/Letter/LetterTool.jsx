import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaPen, FaSpinner, FaArrowLeft } from "react-icons/fa";
import APIService from "../../../Common/API";
import FormalLetter from "./FormalLetter";
import InformalLetter from "./InformalLetter";
import ResponseDisplay from "../ResponseDisplay";
import "./LetterTool.css";

const LetterTool = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("Formal");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const modes = [
    { key: "Formal", label: "Formal Letter", icon: <FaFileAlt /> },
    { key: "Informal", label: "Informal Letter", icon: <FaPen /> },
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
  const generateLetter = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let prompt = "";

    if (type === "formal-letter") {
      prompt = `You are my Professional Letter Writing Assistant.

Your task is to draft a formal letter based on the following inputs:

Letter Details:
- From: ${data.fromName}, ${data.fromAddress}
- Date: ${currentDate}
- To: ${data.toRecipient}
- Subject: ${data.subject}
- Opening Connotation: ${data.openingConnotation}
- Main Matter: ${data.mainMatter}
- Additional Matter: ${data.additionalMatter || "None"}
- Closing Connotation: ${data.closingConnotation}
- Tone: ${data.tone}
- Length: ${data.length}
- Language: ${data.language}

Instructions:
1. Format as a professional formal letter with proper structure
2. Include sender's address at top-left
3. Include date at top-right
4. Include recipient's address after date
5. Use proper salutation with ${data.openingConnotation}
6. Write the body in clear, professional paragraphs
7. Address main matter: ${data.mainMatter}
8. ${data.additionalMatter ? `Include additional matter: ${data.additionalMatter}` : "No additional matter"}
9. Use ${data.tone.toLowerCase()} tone throughout
10. Make it ${data.length.toLowerCase()} in length
11. End with ${data.closingConnotation} and signature
12. Write in ${data.language}
13. Ensure proper formatting with spacing and structure
14. Make it ready for immediate use

Format the letter professionally with proper spacing and structure. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    } 
    
    else if (type === "informal-letter") {
      prompt = `You are my Personal Letter Writing Assistant.

Letter Details:
- To: ${data.toWhom}
- Purpose: ${data.purpose}
- Tone: ${data.tone}
- Language: ${data.language || "English"}

Instructions:
1. Format as a warm, personal letter
2. Include today's date: ${currentDate}
3. Use friendly greeting appropriate for ${data.toWhom}
4. Write naturally about the purpose: ${data.purpose}
5. Use ${data.tone.toLowerCase()} tone throughout
6. Keep it conversational and heartfelt
7. Include appropriate personal closing
8. Write in ${data.language || "English"}
9. Make it feel genuine and personal
10. Ensure proper letter structure with spacing

Format the letter warmly and naturally. Remove all introductory paragraph, end notes and any other non-relevant content.`;
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
              "Sorry, we couldn't generate the letter. Please try again."
            );
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while generating the letter. Please try again later."
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
      case "Formal":
        return <FormalLetter onGenerate={generateLetter} />;
      case "Informal":
        return <InformalLetter onGenerate={generateLetter} />;
      default:
        return <FormalLetter onGenerate={generateLetter} />;
    }
  };

  return (
    <div className="letter-tool-page">
      {/* Mode Selection */}
      <div className="mode-selector">
        <h3 className="mode-title">Choose Letter Type:</h3>
        <div className="mode-buttons-letter">
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
          currentTool="letter"
          currentMode={currentMode}
          formData={currentFormData}
          onReset={resetForm}
          title={
            currentMode === "Formal" ? "Formal Letter:" : "Informal Letter:"
          }
          subject={
            currentMode === "Formal" && currentFormData?.subject
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

export default LetterTool;
