import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaGraduationCap, FaProjectDiagram, FaCogs, FaChartLine, FaExclamationTriangle, FaSpinner, FaHistory, FaDatabase } from "react-icons/fa";
import { TextToolAPI } from "../../../Common/API";
import InternshipReport from "./InternshipReport";
import ProjectReport from "./ProjectReport";
import TechnicalReport from "./TechnicalReport";
import BusinessMarketReport from "./BusinessMarketReport";
import IncidentStatusReport from "./IncidentStatusReport";
import ResponseDisplay from "../ResponseDisplay";
import "./ReportTool.css";

const ReportTool = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("Internship");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const modes = [
    { key: "Internship", label: "Internship Report", icon: <FaGraduationCap /> },
    { key: "Project", label: "Project Report", icon: <FaProjectDiagram /> },
    { key: "Technical", label: "Technical Report", icon: <FaCogs /> },
    { key: "Business", label: "Business/Market Report", icon: <FaChartLine /> },
    { key: "Incident", label: "Incident/Status Report", icon: <FaExclamationTriangle /> },
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
  const generateReport = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    try {
      if (type === "internship-report") {
        await TextToolAPI.internshipReport(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the report. Please try again.");
          }
        });
      } else if (type === "project-report") {
        await TextToolAPI.projectReport(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the report. Please try again.");
          }
        });
      } else if (type === "technical-report") {
        await TextToolAPI.technicalReport(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the report. Please try again.");
          }
        });
      } else if (type === "business-market-report") {
        await TextToolAPI.businessMarketReport(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the report. Please try again.");
          }
        });
      } else if (type === "incident-status-report") {
        await TextToolAPI.incidentStatusReport(data, (response) => {
          setLoading(false);
          if (response.candidates && response.candidates[0].content.parts) {
            setResponse(response.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the report. Please try again.");
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the report. Please try again later.");
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
      case "Internship":
        return <InternshipReport onGenerate={generateReport} />;
      case "Project":
        return <ProjectReport onGenerate={generateReport} />;
      case "Technical":
        return <TechnicalReport onGenerate={generateReport} />;
      case "Business":
        return <BusinessMarketReport onGenerate={generateReport} />;
      case "Incident":
        return <IncidentStatusReport onGenerate={generateReport} />;
      default:
        return <InternshipReport onGenerate={generateReport} />;
    }
  };

  return (
    <div className="report-tool-page">
      {/* Mode Selection */}
      <div className="mode-selector">
        <h3 className="mode-title">Choose Report Type:</h3>
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
          currentTool="report"
          currentMode={currentMode}
          formData={currentFormData}
          onReset={resetForm}
          title={`${currentMode} Report:`}
          subject={currentFormData?.projectTitle || currentFormData?.reportTitle || currentFormData?.incidentTitle}
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

export default ReportTool;
