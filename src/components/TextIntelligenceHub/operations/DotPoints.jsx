import React, { useState } from "react";
import { FaListUl, FaCog, FaChevronDown } from "react-icons/fa";

const DotPoints = ({ onGenerate, content }) => {
  const [formData, setFormData] = useState({
    numberOfPoints: "5",
    detailLevel: "High-level",
    tone: "Neutral",
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
      alert("Please provide content to extract dot points from");
      return;
    }
    onGenerate("dotpoints", { ...formData, content });
  };

  const handleReset = () => {
    setFormData({
      numberOfPoints: "5",
      detailLevel: "High-level",
      tone: "Neutral",
      outputLanguage: "English"
    });
  };

  return (
    <div className="operation-form">
      <div className="form-header">
        <FaListUl className="form-icon" />
        <div className="form-header-content">
          <h4>Dot Points</h4>
          <p>Extract key points as bullet lists</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Show operation-specific inputs since content is already provided */}
        <div className="operation-inputs">
          <div className="inputs-header">
            <FaCog className="inputs-icon" />
            <h5>Dot Points Settings</h5>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Number of Points</label>
              <div className="select-wrapper">
                <select
                  name="numberOfPoints"
                  value={formData.numberOfPoints}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="5">5 Points</option>
                  <option value="10">10 Points</option>
                  <option value="Custom">Custom</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detail Level</label>
              <div className="select-wrapper">
                <select
                  name="detailLevel"
                  value={formData.detailLevel}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="High-level">High-level</option>
                  <option value="Detailed">Detailed</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tone</label>
              <div className="select-wrapper">
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Professional">Professional</option>
                  <option value="Crisp">Crisp</option>
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
            <FaListUl className="me-1" />
            Generate Dot Points
          </button>
          <button className="btn-reset" type="button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default DotPoints;