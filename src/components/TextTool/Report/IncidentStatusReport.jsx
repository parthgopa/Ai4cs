import React, { useState } from 'react';
import { FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClipboardList, FaChartLine, FaTools, FaShieldAlt, FaHistory, FaDatabase } from 'react-icons/fa';

const IncidentStatusReport = ({ onGenerate }) => {
  // Sample dummy data for demonstration
  const dummyData = {
    incidentTitle: "Critical Database Server Outage - Production Environment",
    dateTime: "December 26, 2024, 2:30 PM IST",
    locationSystem: "Primary Database Server Cluster, Data Center - Mumbai Region",
    reportedBy: "System Administrator - Rajesh Kumar",
    description: "The primary database server cluster experienced a complete outage at 2:30 PM IST, affecting all production applications. Initial investigation indicates hardware failure in the primary storage array. The incident was automatically detected by monitoring systems when database response times exceeded threshold limits. All redundant systems failed to take over due to configuration issues in the failover mechanism.",
    impactAnalysis: "• 100% service disruption for all customer-facing applications\n• Estimated 15,000 affected users across multiple regions\n• Financial impact: Approximately $50,000 per hour in lost revenue\n• Customer service hotline experiencing 300% increase in call volume\n• SLA breach notifications triggered for 42 enterprise clients\n• Brand reputation impact due to extended downtime",
    actionsTaken: "• Immediate emergency response team assembled at 2:35 PM\n• Failed storage hardware identified and isolated at 3:15 PM\n• Backup systems manually activated at 3:45 PM\n• Partial service restored for critical applications at 4:20 PM\n• Full service restoration achieved at 6:30 PM\n• Post-incident analysis initiated at 7:00 PM\n• Customer communications sent at regular intervals",
    currentStatus: "SERVICES RESTORED - All systems are now operational with normal performance metrics. Monitoring systems show stable database response times within acceptable limits. The emergency response team has transitioned to normal operations mode. Continuous monitoring is in place to ensure system stability. Root cause analysis is in progress.",
    futurePrevention: "• Implement automated failover testing procedures\n• Upgrade storage array hardware with redundant components\n• Review and update disaster recovery protocols\n• Conduct quarterly incident response drills\n• Implement predictive maintenance for critical hardware\n• Enhance monitoring and alerting systems\n• Establish secondary data center for geographic redundancy\n• Review and update SLA compensation procedures",
  };

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

  const [savedData, setSavedData] = useState(() => {
    // Load saved data from localStorage on component mount
    const saved = localStorage.getItem('incidentStatusReportSavedData');
    return saved ? JSON.parse(saved) : null;
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
    
    // Automatically save the current data to localStorage when generating
    setSavedData({...reportData});
    localStorage.setItem('incidentStatusReportSavedData', JSON.stringify(reportData));
    
    onGenerate('incident-status-report', reportData);
  };

  const loadDummyData = () => {
    setReportData(dummyData);
  };

  const loadSavedData = () => {
    // Try to get fresh data from localStorage first
    const freshSavedData = localStorage.getItem('incidentStatusReportSavedData');
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
        <h3 className="form-section-title">Incident / Status Report</h3>
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
