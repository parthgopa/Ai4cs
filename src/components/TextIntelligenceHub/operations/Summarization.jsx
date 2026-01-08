import React, { useState } from "react";
import { FaFileAlt, FaCog, FaChevronDown } from "react-icons/fa";

const Summarization = ({ onGenerate, content }) => {
  const [formData, setFormData] = useState({
    summaryLength: "Medium",
    summaryStyle: "Neutral",
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
      alert("Please provide content to summarize");
      return;
    }
    onGenerate("summarization", { ...formData, content });
  };

  const handleReset = () => {
    setFormData({
      summaryLength: "Medium",
      summaryStyle: "Neutral",
      outputLanguage: "English"
    });
  };

  return (
    <div className="operation-form">
      <div className="form-header">
        <FaFileAlt className="form-icon" />
        <div className="form-header-content">
          <h4>Summarisation</h4>
          <p>Create concise summaries of documents and texts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Show operation-specific inputs since content is already provided */}
        <div className="operation-inputs">
          <div className="inputs-header">
            <FaCog className="inputs-icon" />
            <h5>Summarization Settings</h5>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Summary Length</label>
              <div className="select-wrapper">
                <select
                  name="summaryLength"
                  value={formData.summaryLength}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                  <option value="Custom characters">Custom characters</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Summary Style</label>
              <div className="select-wrapper">
                <select
                  name="summaryStyle"
                  value={formData.summaryStyle}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Executive">Executive</option>
                  <option value="Bullet Summary">Bullet Summary</option>
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
            <FaFileAlt className="me-1" />
            Generate Summary
          </button>
          <button className="btn-reset" type="button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default Summarization;
