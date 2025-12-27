import React, { useState } from 'react';
import { FaProjectDiagram, FaUser, FaBuilding, FaCalendarAlt, FaBullseye, FaCogs, FaChartLine } from 'react-icons/fa';

const ProjectReport = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    projectTitle: "",
    studentTeamName: "",
    organization: "",
    duration: "",
    problemStatement: "",
    objectives: "",
    proposedSolution: "",
    technologiesUsed: "",
    systemArchitecture: "",
    implementationDetails: "",
    resultsOutcomes: "",
    futureEnhancements: "",
    conclusion: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleGenerateReport = () => {
    const requiredFields = ['projectTitle', 'studentTeamName', 'organization', 'duration', 'problemStatement', 'objectives', 'proposedSolution', 'technologiesUsed', 'systemArchitecture', 'implementationDetails', 'resultsOutcomes', 'futureEnhancements', 'conclusion'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('project-report', reportData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Project Report</h3>
      <div className="form-grid">
        {/* 1. Project Title */}
        <div className="form-group">
          <label className="form-label">
            <FaProjectDiagram className="me-2" />
            Project Title
          </label>
          <input
            type="text"
            name="projectTitle"
            value={reportData.projectTitle}
            onChange={handleInputChange}
            placeholder="Enter the project title"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Student/Team Name */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            Student / Team Name
          </label>
          <input
            type="text"
            name="studentTeamName"
            value={reportData.studentTeamName}
            onChange={handleInputChange}
            placeholder="Enter your name or team name"
            className="form-control"
          />
        </div>

        {/* 3. Organization */}
        <div className="form-group">
          <label className="form-label">
            <FaBuilding className="me-2" />
            Organization / Institution
          </label>
          <input
            type="text"
            name="organization"
            value={reportData.organization}
            onChange={handleInputChange}
            placeholder="Enter organization or institution name"
            className="form-control"
          />
        </div>

        {/* 4. Duration */}
        <div className="form-group">
          <label className="form-label">
            <FaCalendarAlt className="me-2" />
            Project Duration
          </label>
          <input
            type="text"
            name="duration"
            value={reportData.duration}
            onChange={handleInputChange}
            placeholder="e.g., 3 months, 6 weeks, January-March 2024"
            className="form-control"
          />
        </div>

        {/* 5. Problem Statement */}
        <div className="form-group">
          <label className="form-label">Problem Statement</label>
          <textarea
            rows={4}
            name="problemStatement"
            value={reportData.problemStatement}
            onChange={handleInputChange}
            placeholder="Clearly describe the problem or challenge that this project addresses"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Objectives */}
        <div className="form-group">
          <label className="form-label">
            <FaBullseye className="me-2" />
            Project Objectives
          </label>
          <textarea
            rows={4}
            name="objectives"
            value={reportData.objectives}
            onChange={handleInputChange}
            placeholder="List the main objectives and goals of the project. Each objective on a new line:
• To develop an efficient inventory management system
• To reduce manual data entry errors by 80%
• To provide real-time inventory tracking
• To generate automated reports for management"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Proposed Solution */}
        <div className="form-group">
          <label className="form-label">Proposed Solution</label>
          <textarea
            rows={4}
            name="proposedSolution"
            value={reportData.proposedSolution}
            onChange={handleInputChange}
            placeholder="Describe the proposed solution and how it addresses the problem statement"
            className="form-control form-textarea"
          />
        </div>

        {/* 8. Technologies Used */}
        <div className="form-group">
          <label className="form-label">
            <FaCogs className="me-2" />
            Technologies Used
          </label>
          <textarea
            rows={3}
            name="technologiesUsed"
            value={reportData.technologiesUsed}
            onChange={handleInputChange}
            placeholder="List all technologies, frameworks, and tools used:
• Frontend: React, HTML5, CSS3
• Backend: Node.js, Express.js
• Database: MongoDB
• Tools: Git, VS Code, Postman"
            className="form-control form-textarea"
          />
        </div>

        {/* 9. System Architecture */}
        <div className="form-group">
          <label className="form-label">System Architecture / Workflow</label>
          <textarea
            rows={4}
            name="systemArchitecture"
            value={reportData.systemArchitecture}
            onChange={handleInputChange}
            placeholder="Describe the system architecture, components, and workflow of the project"
            className="form-control form-textarea"
          />
        </div>

        {/* 10. Implementation Details */}
        <div className="form-group">
          <label className="form-label">Implementation Details</label>
          <textarea
            rows={5}
            name="implementationDetails"
            value={reportData.implementationDetails}
            onChange={handleInputChange}
            placeholder="Provide detailed information about how the project was implemented, including key features, modules, and development process"
            className="form-control form-textarea"
          />
        </div>

        {/* 11. Results/Outcomes */}
        <div className="form-group">
          <label className="form-label">
            <FaChartLine className="me-2" />
            Results / Outcomes
          </label>
          <textarea
            rows={4}
            name="resultsOutcomes"
            value={reportData.resultsOutcomes}
            onChange={handleInputChange}
            placeholder="Describe the results and outcomes achieved by the project, including metrics and achievements"
            className="form-control form-textarea"
          />
        </div>

        {/* 12. Future Enhancements */}
        <div className="form-group">
          <label className="form-label">Future Enhancements</label>
          <textarea
            rows={3}
            name="futureEnhancements"
            value={reportData.futureEnhancements}
            onChange={handleInputChange}
            placeholder="Describe potential improvements and future development plans for the project"
            className="form-control form-textarea"
          />
        </div>

        {/* 13. Conclusion */}
        <div className="form-group">
          <label className="form-label">Conclusion</label>
          <textarea
            rows={3}
            name="conclusion"
            value={reportData.conclusion}
            onChange={handleInputChange}
            placeholder="Summarize the project achievements, learnings, and overall impact"
            className="form-control form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReport}
          >
            <FaProjectDiagram className="me-1" />
            Generate Report
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReportData({
              projectTitle: "",
              studentTeamName: "",
              organization: "",
              duration: "",
              problemStatement: "",
              objectives: "",
              proposedSolution: "",
              technologiesUsed: "",
              systemArchitecture: "",
              implementationDetails: "",
              resultsOutcomes: "",
              futureEnhancements: "",
              conclusion: "",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectReport;
