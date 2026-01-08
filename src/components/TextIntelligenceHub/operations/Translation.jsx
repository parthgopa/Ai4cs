import React, { useState } from "react";
import { FaLanguage, FaCog, FaChevronDown } from "react-icons/fa";

const Translation = ({ onGenerate, content }) => {
  const [formData, setFormData] = useState({
    sourceLanguage: "Auto-detect",
    targetLanguage: "English",
    translationStyle: "Professional",
    industryContext: ""
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
      alert("Please provide content to translate");
      return;
    }
    onGenerate("translation", { ...formData, content });
  };

  const handleReset = () => {
    setFormData({
      sourceLanguage: "Auto-detect",
      targetLanguage: "English",
      translationStyle: "Professional",
      industryContext: ""
    });
  };

  return (
    <div className="operation-form">
      <div className="form-header">
        <FaLanguage className="form-icon" />
        <div className="form-header-content">
          <h4>Translation</h4>
          <p>Translate text to different languages</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Show operation-specific inputs since content is already provided */}
        <div className="operation-inputs">
          <div className="inputs-header">
            <FaCog className="inputs-icon" />
            <h5>Translation Settings</h5>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Source Language</label>
              <div className="select-wrapper">
                <select
                  name="sourceLanguage"
                  value={formData.sourceLanguage}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Auto-detect">Auto-detect</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                  <option value="Arabic">Arabic</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Language</label>
              <div className="select-wrapper">
                <select
                  name="targetLanguage"
                  value={formData.targetLanguage}
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
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Italian">Italian</option>
                  <option value="Korean">Korean</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Translation Style</label>
              <div className="select-wrapper">
                <select
                  name="translationStyle"
                  value={formData.translationStyle}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Literal">Literal</option>
                  <option value="Professional">Professional</option>
                  <option value="Simple">Simple</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Industry Context (Optional)</label>
              <div className="select-wrapper">
                <select
                  name="industryContext"
                  value={formData.industryContext}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">None</option>
                  <option value="Legal">Legal</option>
                  <option value="Medical">Medical</option>
                  <option value="Technical">Technical</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Government">Government</option>
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
            <FaLanguage className="me-1" />
            Generate Translation
          </button>
          <button className="btn-reset" type="button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default Translation;
