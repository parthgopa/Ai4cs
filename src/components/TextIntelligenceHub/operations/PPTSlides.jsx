import React, { useState } from "react";
import { FaCog, FaChevronDown } from "react-icons/fa";

const PPTSlides = ({ onGenerate, content }) => {
  const [formData, setFormData] = useState({
    numberOfSlides: "5",
    slideStyle: "Executive",
    bulletPointsPerSlide: "3",
    outputLanguage: "English"
  });

  const [customValues, setCustomValues] = useState({
    customSlides: "",
    customBulletPoints: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    // Validate max value of 12
    if (value === "" || (numValue >= 1 && numValue <= 12)) {
      setCustomValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please provide content to convert into slides");
      return;
    }
    
    // Prepare data with custom values if applicable
    const submissionData = {
      ...formData,
      content,
      numberOfSlides: formData.numberOfSlides === "Custom" ? customValues.customSlides : formData.numberOfSlides,
      bulletPointsPerSlide: formData.bulletPointsPerSlide === "Custom" ? customValues.customBulletPoints : formData.bulletPointsPerSlide
    };
    
    onGenerate("pptslides", submissionData);
  };

  const handleReset = () => {
    setFormData({
      numberOfSlides: "5",
      slideStyle: "Executive",
      bulletPointsPerSlide: "3",
      outputLanguage: "English"
    });
    setCustomValues({
      customSlides: "",
      customBulletPoints: ""
    });
  };

  return (
    <div className="operation-form">
      <div className="form-header">
        {/* <RiPresentationFill className="form-icon" /> */}
        <div className="form-header-content">
          <h4>PPT Slides</h4>
          <p>Convert content to presentation slides</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Show operation-specific inputs since content is already provided */}
        <div className="operation-inputs">
          <div className="inputs-header">
            <FaCog className="inputs-icon" />
            <h5>PPT Slides Settings</h5>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Number of Slides</label>
              <div className="select-wrapper">
                <select
                  name="numberOfSlides"
                  value={formData.numberOfSlides}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="3">3 Slides</option>
                  <option value="5">5 Slides</option>
                  <option value="7">7 Slides</option>
                  <option value="10">10 Slides</option>
                  <option value="Custom">Custom</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
              {formData.numberOfSlides === "Custom" && (
                <div className="custom-input-wrapper mt-2">
                  <input
                    type="number"
                    name="customSlides"
                    value={customValues.customSlides}
                    onChange={handleCustomInputChange}
                    placeholder="Enter number (max 12)"
                    min="1"
                    max="12"
                    className="form-control"
                  />
                  <small className="text-muted">Maximum 12 slides allowed</small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Slide Style</label>
              <div className="select-wrapper">
                <select
                  name="slideStyle"
                  value={formData.slideStyle}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Executive">Executive</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Training">Training</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bullet Points per Slide</label>
              <div className="select-wrapper">
                <select
                  name="bulletPointsPerSlide"
                  value={formData.bulletPointsPerSlide}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="2">2 Points</option>
                  <option value="3">3 Points</option>
                  <option value="4">4 Points</option>
                  <option value="5">5 Points</option>
                  <option value="Custom">Custom</option>
                </select>
                <FaChevronDown className="dropdown-arrow" />
              </div>
              {formData.bulletPointsPerSlide === "Custom" && (
                <div className="custom-input-wrapper mt-2">
                  <input
                    type="number"
                    name="customBulletPoints"
                    value={customValues.customBulletPoints}
                    onChange={handleCustomInputChange}
                    placeholder="Enter number (max 12)"
                    min="1"
                    max="12"
                    className="form-control"
                  />
                  <small className="text-muted">Maximum 12 bullet points allowed</small>
                </div>
              )}
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
            {/* <RiPresentationFill className="me-1" /> */}
            Generate PPT Slides
          </button>
          <button className="btn-reset" type="button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default PPTSlides;
