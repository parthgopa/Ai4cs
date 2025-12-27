import React, { useState } from 'react';
import { FaCogs, FaUser, FaBuilding, FaBullseye, FaTools, FaChartLine } from 'react-icons/fa';

const TechnicalReport = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    reportTitle: "",
    authorName: "",
    organization: "",
    purpose: "",
    technicalBackground: "",
    toolsTechnologies: "",
    methodology: "",
    implementationDetails: "",
    performanceEvaluation: "",
    limitations: "",
    conclusion: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleGenerateReport = () => {
    const requiredFields = ['reportTitle', 'authorName', 'organization', 'purpose', 'technicalBackground', 'toolsTechnologies', 'methodology', 'implementationDetails', 'performanceEvaluation', 'limitations', 'conclusion'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('technical-report', reportData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Technical Report</h3>
      <div className="form-grid">
        {/* 1. Report Title */}
        <div className="form-group">
          <label className="form-label">
            <FaCogs className="me-2" />
            Report Title
          </label>
          <input
            type="text"
            name="reportTitle"
            value={reportData.reportTitle}
            onChange={handleInputChange}
            placeholder="Enter the technical report title"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Author Name */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            Author Name
          </label>
          <input
            type="text"
            name="authorName"
            value={reportData.authorName}
            onChange={handleInputChange}
            placeholder="Enter author name"
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

        {/* 4. Purpose of the Report */}
        <div className="form-group">
          <label className="form-label">
            <FaBullseye className="me-2" />
            Purpose of the Report
          </label>
          <textarea
            rows={3}
            name="purpose"
            value={reportData.purpose}
            onChange={handleInputChange}
            placeholder="Clearly state the purpose and objectives of this technical report"
            className="form-control form-textarea"
          />
        </div>

        {/* 5. Technical Background */}
        <div className="form-group">
          <label className="form-label">Technical Background</label>
          <textarea
            rows={4}
            name="technicalBackground"
            value={reportData.technicalBackground}
            onChange={handleInputChange}
            placeholder="Provide relevant technical background, context, and literature review"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Tools/Technologies Used */}
        <div className="form-group">
          <label className="form-label">
            <FaTools className="me-2" />
            Tools / Technologies Used
          </label>
          <textarea
            rows={3}
            name="toolsTechnologies"
            value={reportData.toolsTechnologies}
            onChange={handleInputChange}
            placeholder="List all technical tools, software, and technologies used:
• Programming Languages: Python, JavaScript
• Frameworks: TensorFlow, React
• Tools: Docker, Git, Jupyter Notebook
• Hardware: GPU servers, IoT devices"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Methodology */}
        <div className="form-group">
          <label className="form-label">Methodology / Approach</label>
          <textarea
            rows={4}
            name="methodology"
            value={reportData.methodology}
            onChange={handleInputChange}
            placeholder="Describe the technical methodology, approach, and experimental design used"
            className="form-control form-textarea"
          />
        </div>

        {/* 8. Implementation Details */}
        <div className="form-group">
          <label className="form-label">Implementation Details</label>
          <textarea
            rows={5}
            name="implementationDetails"
            value={reportData.implementationDetails}
            onChange={handleInputChange}
            placeholder="Provide detailed technical implementation information, algorithms, and system design"
            className="form-control form-textarea"
          />
        </div>

        {/* 9. Performance/Evaluation */}
        <div className="form-group">
          <label className="form-label">
            <FaChartLine className="me-2" />
            Performance / Evaluation
          </label>
          <textarea
            rows={4}
            name="performanceEvaluation"
            value={reportData.performanceEvaluation}
            onChange={handleInputChange}
            placeholder="Describe performance metrics, evaluation results, and analysis of the technical solution"
            className="form-control form-textarea"
          />
        </div>

        {/* 10. Limitations */}
        <div className="form-group">
          <label className="form-label">Limitations</label>
          <textarea
            rows={3}
            name="limitations"
            value={reportData.limitations}
            onChange={handleInputChange}
            placeholder="Discuss the limitations, constraints, and boundaries of the technical solution"
            className="form-control form-textarea"
          />
        </div>

        {/* 11. Conclusion */}
        <div className="form-group">
          <label className="form-label">Conclusion</label>
          <textarea
            rows={3}
            name="conclusion"
            value={reportData.conclusion}
            onChange={handleInputChange}
            placeholder="Summarize the technical findings, contributions, and future work recommendations"
            className="form-control form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReport}
          >
            <FaCogs className="me-1" />
            Generate Report
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReportData({
              reportTitle: "",
              authorName: "",
              organization: "",
              purpose: "",
              technicalBackground: "",
              toolsTechnologies: "",
              methodology: "",
              implementationDetails: "",
              performanceEvaluation: "",
              limitations: "",
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

export default TechnicalReport;
