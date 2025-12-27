import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaGraduationCap, FaProjectDiagram, FaCogs, FaChartLine, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import APIService from "../../../Common/API";
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

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let prompt = "";

    if (type === "internship-report") {
      prompt = `You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Internship Report based on the following inputs:

Report Details:
- Student Name: ${data.studentName}
- Organization Name: ${data.organizationName}
- Internship Role: ${data.internshipRole}
- Department: ${data.department}
- Duration: ${data.duration}
- Supervisor: ${data.supervisorName}
- Organization Overview: ${data.organizationOverview}
- Key Responsibilities: ${data.keyResponsibilities}
- Tools/Technologies: ${data.toolsTechnologies}
- Key Learnings: ${data.keyLearnings}
- Challenges: ${data.challenges || "Not specified"}
- Solutions: ${data.solutions || "Not specified"}
- Conclusion: ${data.conclusion || "Not specified"}
- Date: ${currentDate}

Instructions:
1. Format as a professional internship report with proper structure
2. Include title page with all details
3. Follow the exact output structure:
   - Title Page
   - 1. Introduction
   - 2. Organization Overview
   - 3. Internship Role and Responsibilities
   - 4. Tools and Technologies Used
   - 5. Key Learnings
   - 6. Challenges (if provided)
   - 7. Conclusion (if provided)
   - 8. Acknowledgement
4. Use professional academic tone
5. Include proper headings and subheadings
6. Format responsibilities as bullet points
7. Ensure proper spacing and structure
8. Make it comprehensive and detailed

Format the report professionally with proper academic structure. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    } 
    
    else if (type === "project-report") {
      prompt = `You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Project Report based on the following inputs:

Report Details:
- Project Title: ${data.projectTitle}
- Student/Team Name: ${data.studentTeamName}
- Organization: ${data.organization}
- Duration: ${data.duration}
- Problem Statement: ${data.problemStatement}
- Objectives: ${data.objectives}
- Proposed Solution: ${data.proposedSolution}
- Technologies Used: ${data.technologiesUsed}
- System Architecture: ${data.systemArchitecture}
- Implementation Details: ${data.implementationDetails}
- Results/Outcomes: ${data.resultsOutcomes}
- Future Enhancements: ${data.futureEnhancements}
- Conclusion: ${data.conclusion}
- Date: ${currentDate}

Instructions:
1. Format as a professional project report with proper structure
2. Follow the exact output structure:
   - 1. Introduction
   - 2. Problem Statement
   - 3. Objectives
   - 4. Proposed Solution
   - 5. System Architecture
   - 6. Implementation
   - 7. Results
   - 8. Future Scope
   - 9. Conclusion
3. Use technical and professional tone
4. Include proper headings and subheadings
5. Format objectives and results as clear points
6. Ensure proper technical documentation style
7. Make it comprehensive and detailed

Format the report professionally with proper technical structure. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "technical-report") {
      prompt = `You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Technical Report based on the following inputs:

Report Details:
- Report Title: ${data.reportTitle}
- Author Name: ${data.authorName}
- Organization: ${data.organization}
- Purpose: ${data.purpose}
- Technical Background: ${data.technicalBackground}
- Tools/Technologies: ${data.toolsTechnologies}
- Methodology: ${data.methodology}
- Implementation Details: ${data.implementationDetails}
- Performance/Evaluation: ${data.performanceEvaluation}
- Limitations: ${data.limitations}
- Conclusion: ${data.conclusion}
- Date: ${currentDate}

Instructions:
1. Format as a professional technical report with proper structure
2. Follow the exact output structure:
   - 1. Abstract
   - 2. Introduction
   - 3. Technical Background
   - 4. Methodology
   - 5. Implementation
   - 6. Performance Analysis
   - 7. Limitations
   - 8. Conclusion
3. Use technical and analytical tone
4. Include proper headings and subheadings
5. Ensure proper technical documentation style
6. Make it comprehensive and detailed with technical depth

Format the report professionally with proper technical structure. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "business-market-report") {
      prompt = `You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Business/Market Report based on the following inputs:

Report Details:
- Report Title: ${data.reportTitle}
- Company/Industry: ${data.companyIndustry}
- Market Overview: ${data.marketOverview}
- Target Audience: ${data.targetAudience}
- Key Problems/Gaps: ${data.keyProblems}
- Market Analysis: ${data.marketAnalysis}
- Competitor Analysis: ${data.competitorAnalysis}
- Proposed Strategy: ${data.proposedStrategy}
- Financial/Growth Insights: ${data.financialGrowth || "Not specified"}
- Risks & Challenges: ${data.risksChallenges}
- Conclusion & Recommendations: ${data.conclusionRecommendations}
- Date: ${currentDate}

Instructions:
1. Format as a professional business report with proper structure
2. Follow the exact output structure:
   - 1. Executive Summary
   - 2. Market Overview
   - 3. Industry Analysis
   - 4. Competitor Analysis
   - 5. Strategy Proposal
   - 6. Risk Assessment
   - 7. Recommendations
3. Use business professional tone
4. Include proper headings and subheadings
5. Ensure proper business documentation style
6. Make it comprehensive and strategic

Format the report professionally with proper business structure. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "incident-status-report") {
      prompt = `You are my Professional Report Writing Assistant.

Your task is to draft a comprehensive Incident/Status Report based on the following inputs:

Report Details:
- Incident Title: ${data.incidentTitle}
- Date & Time: ${data.dateTime}
- Location/System: ${data.locationSystem}
- Reported By: ${data.reportedBy}
- Description: ${data.description}
- Impact Analysis: ${data.impactAnalysis}
- Actions Taken: ${data.actionsTaken}
- Current Status: ${data.currentStatus}
- Future Prevention: ${data.futurePrevention}
- Date: ${currentDate}

Instructions:
1. Format as a professional incident report with proper structure
2. Follow the exact output structure:
   - 1. Incident Overview
   - 2. Description
   - 3. Impact Analysis
   - 4. Actions Taken
   - 5. Current Status
   - 6. Preventive Measures
3. Use factual and objective tone
4. Include proper headings and subheadings
5. Ensure proper incident documentation style
6. Make it comprehensive and precise

Format the report professionally with proper incident structure. Remove all introductory paragraph, end notes and any other non-relevant content.`;
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
              "Sorry, we couldn't generate the report. Please try again."
            );
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while generating the report. Please try again later."
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
