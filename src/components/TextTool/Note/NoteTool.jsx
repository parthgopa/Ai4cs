import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStickyNote, FaInfoCircle, FaExclamationCircle, FaHistory, FaTasks, FaClipboard, FaEdit, FaSpinner } from "react-icons/fa";
import APIService from "../../../Common/API";
import InformationalNote from "./InformationalNote";
import ExplanatoryNote from "./ExplanatoryNote";
import BackgroundNote from "./BackgroundNote";
import MeetingNote from "./MeetingNote";
import TaskNote from "./TaskNote";
import RecordNote from "./RecordNote";
import CustomNote from "./CustomNote";
import ResponseDisplay from "../ResponseDisplay";
import "./NoteTool.css";

const NoteTool = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("Informational");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const modes = [
    { key: "Informational", label: "Informational Note", icon: <FaInfoCircle /> },
    { key: "Explanatory", label: "Explanatory Note", icon: <FaExclamationCircle /> },
    { key: "Background", label: "Background Note", icon: <FaHistory /> },
    { key: "Meeting", label: "Meeting/Discussion Note", icon: <FaClipboard /> },
    { key: "Task", label: "Task/Activity Note", icon: <FaTasks /> },
    { key: "Record", label: "Personal/Office Record", icon: <FaStickyNote /> },
    { key: "Custom", label: "Custom Note", icon: <FaEdit /> },
  ];

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    setResponse("");
    setLoading(false);
    
    // Scroll to form section on small screens when a mode is selected
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const formSection = document.querySelector('.form-section');
        if (formSection) {
          formSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  const resetForm = () => {
    setResponse("");
    setLoading(false);
    setCurrentFormData(null);
  };

  // Generation functions
  const generateNote = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    let prompt = `You are a General Note Writing Assistant.

Your task is to help the user prepare clear, structured, and easy-to-understand notes for general daily use.
This note is not a corporate, legal, or compliance note unless the user explicitly requests it.

Note Details:
- Purpose: ${data.purpose}
- Type: ${data.noteType}
- Title/Subject: ${data.subject}
- Context: ${data.context}
- Date/Time Reference: ${data.dateTimeReference}
- Key Points: ${data.keyPoints}
- Facts/Observations: ${data.factsObservations}
- People Involved: ${data.peopleInvolved}
- Decisions/Outcomes: ${data.decisionsOutcomes}
- Tone: ${data.tone}
- Length: ${data.length}
- Format: ${data.format}

Instructions:
1. Generate a professional note following the exact format below
2. Use ${data.tone.toLowerCase()} tone throughout
3. Make it ${data.length.toLowerCase()} in length
4. Format using ${data.format.toLowerCase()}
5. Keep language simple and clear
6. Avoid legal, regulatory, or compliance terminology unless requested
7. Do not add unnecessary assumptions
8. Ensure the note is ready for immediate use

Generate the note in this format:

NOTE
${data.subject}

Purpose of the Note
Brief statement explaining why the note is prepared.

Background / Context
Relevant background or situation details.

Main Points
Key facts, explanations, observations, or discussion points.

Outcome / Current Status (if applicable)
Decisions taken or present position.

Action Items / Next Steps (if any)
Tasks, responsibilities, or follow-up points.

Additional Remarks (optional)
Any other useful information.

Format the note professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse(
              "Sorry, we couldn't generate the note. Please try again."
            );
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while generating the note. Please try again later."
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
      case "Informational":
        return <InformationalNote onGenerate={generateNote} />;
      case "Explanatory":
        return <ExplanatoryNote onGenerate={generateNote} />;
      case "Background":
        return <BackgroundNote onGenerate={generateNote} />;
      case "Meeting":
        return <MeetingNote onGenerate={generateNote} />;
      case "Task":
        return <TaskNote onGenerate={generateNote} />;
      case "Record":
        return <RecordNote onGenerate={generateNote} />;
      case "Custom":
        return <CustomNote onGenerate={generateNote} />;
      default:
        return <InformationalNote onGenerate={generateNote} />;
    }
  };

  return (
    <div className="note-tool-page">
      {/* Mode Selection */}
      <div className="mode-selector">
        <h3 className="mode-title">Choose Note Type:</h3>
        <div className="mode-buttons">
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
          currentTool="note"
          currentMode={currentMode}
          formData={currentFormData}
          onReset={resetForm}
          title={`${currentMode} Note:`}
          subject={currentFormData?.subject}
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

export default NoteTool;
