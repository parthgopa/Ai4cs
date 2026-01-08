import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaPen, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { TextToolAPI } from "../../../Common/API";
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

    try {
      await TextToolAPI.generateLetter({
        letterType: type,
        data: data
      }, (response) => {
        setLoading(false);
        if (response.candidates && response.candidates[0].content.parts) {
          setResponse(response.candidates[0].content.parts[0].text);
        } else {
          setResponse(
            "Sorry, we couldn't generate the letter. Please try again."
          );
        }
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
