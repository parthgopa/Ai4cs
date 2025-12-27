import React, { useState } from "react";
import { FaBriefcase } from "react-icons/fa";

const BusinessBlog = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    language: "English",
    tone: "Professional",
    length: "Medium (800–1000 words)",
    targetAudience: "Business Professionals",
    blogTopic: "",
    businessFocusArea: "Automation",
    addCallToAction: "Yes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.blogTopic.trim()) {
      alert("Please enter a blog topic/title");
      return;
    }
    onGenerate("business-blog", formData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Business/Corporate Blog</h3>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="form-control"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tone">Tone</label>
          <select
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Informative">Informative</option>
            <option value="Professional">Professional</option>
            <option value="Conversational">Conversational</option>
            <option value="Thought Leadership">Thought Leadership</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="length">Length</label>
          <select
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Short (500–600 words)">Short (500–600 words)</option>
            <option value="Medium (800–1000 words)">Medium (800–1000 words)</option>
            <option value="Long (1200+ words)">Long (1200+ words)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience</label>
          <select
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="form-control"
          >
            <option value="General Audience">General Audience</option>
            <option value="Business Professionals">Business Professionals</option>
            <option value="Students">Students</option>
            <option value="Developers">Developers</option>
            <option value="Entrepreneurs">Entrepreneurs</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="blogTopic">Blog Topic / Title</label>
        <input
          type="text"
          id="blogTopic"
          name="blogTopic"
          value={formData.blogTopic}
          onChange={handleChange}
          placeholder="e.g., How AI Is Transforming Office Automation, Digital Transformation in Enterprises"
          className="form-control"
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="businessFocusArea">Business Focus Area</label>
          <select
            id="businessFocusArea"
            name="businessFocusArea"
            value={formData.businessFocusArea}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Automation">Automation</option>
            <option value="Productivity">Productivity</option>
            <option value="Cost Reduction">Cost Reduction</option>
            <option value="Strategy">Strategy</option>
            <option value="Growth">Growth</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="addCallToAction">Add Call-to-Action</label>
          <select
            id="addCallToAction"
            name="addCallToAction"
            value={formData.addCallToAction}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-generate" onClick={handleSubmit}>
          <FaBriefcase className="me-1" />
          Generate Business Blog
        </button>
        <button className="btn-reset" onClick={() => setFormData({
          language: "English",
          tone: "Professional",
          length: "Medium (800–1000 words)",
          targetAudience: "Business Professionals",
          blogTopic: "",
          businessFocusArea: "Automation",
          addCallToAction: "Yes",
        })}>
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default BusinessBlog;
