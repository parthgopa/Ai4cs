import React, { useState } from "react";
import { FaTasks, FaCog, FaChevronDown } from "react-icons/fa";

const ActionPoints = ({ onGenerate, content }) => {
  const [formData, setFormData] = useState({
    perspective: "Management",
    timelinePreference: "Short-term",
    outputFormat: "Bullet List",
    outputLanguage: "English"
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
      alert("Please provide content to extract action points from");
      return;
    }
    onGenerate("actionpoints", { ...formData, content });
  };

  const handleReset = () => {
    setFormData({
      perspective: "Management",
      timelinePreference: "Short-term",
      outputFormat: "Bullet List",
      outputLanguage: "English"
    });
  };

  return (
    <div className="operation-form">
      <div className="form-header">
        <FaTasks className="form-icon" />
        <div className="form-header-content">
          <h4>Action Points</h4>
          <p>Extract actionable items from content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Show operation-specific inputs since content is already provided */}
        <div className="operation-inputs">
          <div className="inputs-header">
            <FaCog className="inputs-icon" />
            <h5>Action Points Settings</h5>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Perspective</label>
              <div className="select-wrapper">
                <select
                  name="perspective"
                  value={formData.perspective}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Management">Management</option>
                  <option value="Team">Team</option>
                  <option value="Individual">Individual</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Timeline Preference</label>
              <div className="select-wrapper">
                <select
                  name="timelinePreference"
                  value={formData.timelinePreference}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Short-term">Short-term</option>
                  <option value="Long-term">Long-term</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Output Format</label>
              <div className="select-wrapper">
                <select
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Bullet List">Bullet List</option>
                  <option value="Table">Table (Action | Responsibility | Timeline)</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

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
          </div>

          {/* Content Preview */}
          <div className="content-preview">
            <h6>Content Preview</h6>
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
            <FaTasks className="me-1" />
            Generate Action Points
          </button>
          <button className="btn-reset" type="button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActionPoints;
