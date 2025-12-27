import React, { useState } from 'react';
import { FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClipboardList, FaChartLine, FaTools, FaShieldAlt } from 'react-icons/fa';

const IncidentStatusReport = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    incidentTitle: "",
    dateTime: "",
    locationSystem: "",
    reportedBy: "",
    description: "",
    impactAnalysis: "",
    actionsTaken: "",
    currentStatus: "",
    futurePrevention: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleGenerateReport = () => {
    const requiredFields = ['incidentTitle', 'dateTime', 'locationSystem', 'reportedBy', 'description', 'impactAnalysis', 'actionsTaken', 'currentStatus', 'futurePrevention'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('incident-status-report', reportData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Incident / Status Report</h3>
      <div className="form-grid">
        {/* 1. Incident Title */}
        <div className="form-group">
          <label className="form-label">
            <FaExclamationTriangle className="me-2" />
            Incident / Status Title
          </label>
          <input
            type="text"
            name="incidentTitle"
            value={reportData.incidentTitle}
            onChange={handleInputChange}
            placeholder="Enter incident or status title"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Date & Time */}
        <div className="form-group">
          <label className="form-label">
            <FaCalendarAlt className="me-2" />
            Date & Time
          </label>
          <input
            type="text"
            name="dateTime"
            value={reportData.dateTime}
            onChange={handleInputChange}
            placeholder="e.g., December 26, 2024, 2:30 PM IST"
            className="form-control"
          />
        </div>

        {/* 3. Location/System */}
        <div className="form-group">
          <label className="form-label">
            <FaMapMarkerAlt className="me-2" />
            Location / System Name
          </label>
          <input
            type="text"
            name="locationSystem"
            value={reportData.locationSystem}
            onChange={handleInputChange}
            placeholder="e.g., Server Room A, Production Database, Main Office"
            className="form-control"
          />
        </div>

        {/* 4. Reported By */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            Reported By
          </label>
          <input
            type="text"
            name="reportedBy"
            value={reportData.reportedBy}
            onChange={handleInputChange}
            placeholder="Enter name of person reporting the incident"
            className="form-control"
          />
        </div>

        {/* 5. Description */}
        <div className="form-group">
          <label className="form-label">
            <FaClipboardList className="me-2" />
            Description of Incident / Status
          </label>
          <textarea
            rows={4}
            name="description"
            value={reportData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed description of what happened, when it started, and how it was discovered"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Impact Analysis */}
        <div className="form-group">
          <label className="form-label">
            <FaChartLine className="me-2" />
            Impact Analysis
          </label>
          <textarea
            rows={4}
            name="impactAnalysis"
            value={reportData.impactAnalysis}
            onChange={handleInputChange}
            placeholder="Describe the impact on operations, users, systems, business processes, and any financial or operational consequences"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Actions Taken */}
        <div className="form-group">
          <label className="form-label">
            <FaTools className="me-2" />
            Actions Taken
          </label>
          <textarea
            rows={4}
            name="actionsTaken"
            value={reportData.actionsTaken}
            onChange={handleInputChange}
            placeholder="List all immediate actions taken to address the incident, including containment, mitigation, and response measures"
            className="form-control form-textarea"
          />
        </div>

        {/* 8. Current Status */}
        <div className="form-group">
          <label className="form-label">Current Status</label>
          <textarea
            rows={3}
            name="currentStatus"
            value={reportData.currentStatus}
            onChange={handleInputChange}
            placeholder="Describe the current status of the incident - resolved, ongoing, monitoring, etc."
            className="form-control form-textarea"
          />
        </div>

        {/* 9. Future Prevention Steps */}
        <div className="form-group">
          <label className="form-label">
            <FaShieldAlt className="me-2" />
            Future Prevention Steps
          </label>
          <textarea
            rows={4}
            name="futurePrevention"
            value={reportData.futurePrevention}
            onChange={handleInputChange}
            placeholder="Outline preventive measures, process improvements, and recommendations to avoid similar incidents in the future"
            className="form-control form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReport}
          >
            <FaExclamationTriangle className="me-1" />
            Generate Report
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReportData({
              incidentTitle: "",
              dateTime: "",
              locationSystem: "",
              reportedBy: "",
              description: "",
              impactAnalysis: "",
              actionsTaken: "",
              currentStatus: "",
              futurePrevention: "",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentStatusReport;
