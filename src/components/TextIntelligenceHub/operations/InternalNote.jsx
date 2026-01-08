import React, { useState } from "react";
import { FaStickyNote, FaCog, FaChevronDown } from "react-icons/fa";

const InternalNote = ({ onGenerate, content }) => {
  const [formData, setFormData] = useState({
    departmentSection: "",
    subject: "",
    reference: "",
    purpose: "Information",
    tone: "Neutral Office",
    structurePreference: "Short",
    recommendationRequired: "No",
    approvalRequiredFrom: "",
    outputLanguage: "English",
    datePreference: "Auto"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please provide content for the internal note background");
      return;
    }
    if (!formData.departmentSection.trim()) {
      alert("Please provide Department/Section Name");
      return;
    }
    if (!formData.subject.trim()) {
      alert("Please provide Subject of the Note");
      return;
    }
    onGenerate("internalnote", { ...formData, content });
  };

  const handleReset = () => {
    setFormData({
      departmentSection: "",
      subject: "",
      reference: "",
      purpose: "Information",
      tone: "Neutral Office",
      structurePreference: "Short",
      recommendationRequired: "No",
      approvalRequiredFrom: "",
      outputLanguage: "English",
      datePreference: "Auto"
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="operation-form">
      <div className="form-header">
        <FaStickyNote className="form-icon" />
        <div className="form-header-content">
          <h4>Internal Note</h4>
          <p>Create structured office notes for internal use</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Show operation-specific inputs since content is already provided */}
        <div className="operation-inputs">
          <div className="inputs-header">
            <FaCog className="inputs-icon" />
            <h5>Internal Note Settings</h5>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department / Section Name *</label>
              <input
                type="text"
                name="departmentSection"
                value={formData.departmentSection}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Human Resources, Finance Department"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject of the Note *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Budget Approval Request, Policy Update"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reference (Optional)</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="form-control"
                placeholder="File No., Email dated, Circular/Meeting reference"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Purpose of Note</label>
              <div className="select-wrapper">
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Information">Information</option>
                  <option value="Approval">Approval</option>
                  <option value="Decision">Decision</option>
                  <option value="Record">Record</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tone of Note</label>
              <div className="select-wrapper">
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Very Formal">Very Formal</option>
                  <option value="Formal">Formal</option>
                  <option value="Neutral Office">Neutral Office</option>
                  <option value="Polite">Polite</option>
                  <option value="Assertive">Assertive</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Structure Preference</label>
              <div className="select-wrapper">
                <select
                  name="structurePreference"
                  value={formData.structurePreference}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Short">Short</option>
                  <option value="Detailed">Detailed</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Recommendation Required</label>
              <div className="select-wrapper">
                <select
                  name="recommendationRequired"
                  value={formData.recommendationRequired}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Approval Required From</label>
              <input
                type="text"
                name="approvalRequiredFrom"
                value={formData.approvalRequiredFrom}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Designation only (e.g., General Manager, Director)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Output Language</label>
              <div className="select-wrapper">
                <select
                  name="outputLanguage"
                  value={formData.outputLanguage}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <div className="select-wrapper">
                <select
                  name="datePreference"
                  value={formData.datePreference}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Auto">Auto ({getCurrentDate()})</option>
                  <option value="Manual">Manual</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="content-preview">
            <h6>Background / Facts Content</h6>
            <div className="preview-text">
              {content.length > 300 ? `${content.substring(0, 300)}...` : content}
            </div>
            <p className="content-stats">
              Characters: {content.length} | Words: {content.split(/\s+/).filter(word => word.length > 0).length}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-generate" type="submit">
            <FaStickyNote className="me-1" />
            Generate Internal Note
          </button>
          <button className="btn-reset" type="button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternalNote;
