import React, { useState } from 'react';
import { FaProjectDiagram, FaUser, FaBuilding, FaCalendarAlt, FaBullseye, FaCogs, FaChartLine, FaHistory, FaDatabase } from 'react-icons/fa';

const ProjectReport = ({ onGenerate }) => {
  // Sample dummy data for demonstration
  const dummyData = {
    projectTitle: "Smart Inventory Management System for Retail Operations",
    studentTeamName: "Tech Innovators Team - Computer Science Department",
    organization: "Retail Solutions Inc.",
    duration: "6 months (January-June 2025)",
    problemStatement: "Retail businesses face significant challenges in inventory management, including stock discrepancies, manual tracking errors, delayed reorder processes, and lack of real-time visibility. Current systems are often disconnected, leading to inefficient operations, lost sales opportunities, and increased carrying costs. Small to medium retailers particularly struggle with affordable, integrated inventory solutions.",
    objectives: "• Develop a real-time inventory tracking system using IoT sensors\n• Implement automated reorder alerts based on predictive analytics\n• Create a user-friendly dashboard for inventory visualization\n• Reduce manual inventory management efforts by 80%\n• Achieve 99% inventory accuracy across all product categories\n• Integrate with existing POS systems for seamless operation",
    proposedSolution: "The Smart Inventory Management System combines IoT technology, cloud computing, and machine learning to provide real-time inventory visibility. The system uses RFID tags and weight sensors on shelves to track product movement automatically. A cloud-based backend processes this data and provides insights through a web dashboard. Machine learning algorithms predict demand patterns and optimize reorder points. The solution includes mobile apps for store staff and automated reporting for management.",
    technologiesUsed: "• Frontend: React.js, Material-UI, Chart.js\n• Backend: Node.js, Express.js, MongoDB\n• IoT: RFID readers, Weight sensors, ESP32 microcontrollers\n• Cloud: AWS EC2, S3, Lambda\n• ML: Python, TensorFlow, scikit-learn\n• Mobile: React Native\n• APIs: RESTful APIs, WebSocket for real-time updates\n• Tools: Git, Docker, Jenkins CI/CD",
    systemArchitecture: "The system follows a microservices architecture with the following components: 1) Data Collection Layer - IoT sensors and RFID readers collect inventory data. 2) Processing Layer - Edge devices process raw data and transmit to cloud. 3) Cloud Backend - Microservices handle data storage, processing, and analytics. 4) Application Layer - Web dashboard and mobile apps provide user interfaces. 5) Integration Layer - APIs connect with external POS and supplier systems. The architecture supports horizontal scaling and fault tolerance.",
    implementationDetails: "Phase 1 (Months 1-2): Requirements gathering, system design, and prototype development. Phase 2 (Months 3-4): Core functionality implementation including IoT integration, database setup, and basic dashboard. Phase 3 (Months 5-6): Advanced features, testing, deployment, and user training. The team used Agile methodology with two-week sprints. Regular stakeholder meetings ensured alignment with business requirements. Comprehensive testing included unit tests, integration tests, and user acceptance testing.",
    resultsOutcomes: "• Achieved 98.5% inventory accuracy in pilot testing\n• Reduced manual inventory time from 4 hours to 30 minutes daily\n• Decreased stockouts by 75% through predictive reordering\n• Improved customer satisfaction scores by 25%\n• Estimated ROI of 180% over 2-year period\n• Successfully deployed in 3 pilot stores with positive feedback\n• Scalable architecture ready for expansion to 50+ locations",
    futureEnhancements: "• Implement AI-powered demand forecasting for seasonal products\n• Add supplier integration for automated purchase orders\n• Develop mobile scanning app for manual inventory adjustments\n• Create analytics module for business intelligence\n• Implement blockchain for supply chain transparency\n• Add voice-activated inventory queries for staff\n• Develop customer-facing inventory availability API",
    conclusion: "The Smart Inventory Management System successfully addresses the critical challenges faced by retail businesses in inventory management. By leveraging IoT technology and modern software architecture, the project delivers significant improvements in accuracy, efficiency, and cost reduction. The system demonstrates the potential for technology to transform traditional retail operations and provides a solid foundation for future enhancements. The project showcases successful collaboration between academic research and practical business applications.",
  };

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

  const [savedData, setSavedData] = useState(() => {
    // Load saved data from localStorage on component mount
    const saved = localStorage.getItem('projectReportSavedData');
    return saved ? JSON.parse(saved) : null;
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
    
    // Automatically save the current data to localStorage when generating
    setSavedData({...reportData});
    localStorage.setItem('projectReportSavedData', JSON.stringify(reportData));
    
    onGenerate('project-report', reportData);
  };

  const loadDummyData = () => {
    setReportData(dummyData);
  };

  const loadSavedData = () => {
    // Try to get fresh data from localStorage first
    const freshSavedData = localStorage.getItem('projectReportSavedData');
    if (freshSavedData) {
      const parsedData = JSON.parse(freshSavedData);
      setSavedData(parsedData);
      setReportData(parsedData);
    } else if (savedData) {
      setReportData(savedData);
    } else {
      alert("No saved data found. Generate a report first to save your data automatically.");
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h3 className="form-section-title">Project Report</h3>
        <div className="form-header-buttons">
          <button 
            className="btn-load-saved" 
            onClick={loadSavedData}
            title="Load your saved data"
          >
            <FaDatabase />
          </button>
          <button 
            className="btn-load-previous" 
            onClick={loadDummyData}
            title="Load sample data"
          >
            <FaHistory />
          </button>
        </div>
      </div>
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
