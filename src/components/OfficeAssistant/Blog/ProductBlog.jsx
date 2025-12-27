import React, { useState } from "react";
import { FaBox } from "react-icons/fa";

function ProductBlog({ onGenerate }) {
  const [formData, setFormData] = useState({
    language: "English",
    tone: "Professional",
    length: "Medium (800–1000 words)",
    targetAudience: "General Audience",
    blogTopic: "",
    productType: "SaaS",
    announcementType: "New Product",
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
    onGenerate("product-blog", formData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Product/Feature Blog</h3>

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
          placeholder="e.g., Introducing Our AI Office Assistant, New Features Release"
          className="form-control"
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="productType">Product Type</label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="form-control"
          >
            <option value="SaaS">SaaS</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI Tool">AI Tool</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="announcementType">Announcement Type</label>
          <select
            id="announcementType"
            name="announcementType"
            value={formData.announcementType}
            onChange={handleChange}
            className="form-control"
          >
            <option value="New Product">New Product</option>
            <option value="New Feature">New Feature</option>
            <option value="Update">Update</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-generate" onClick={handleSubmit}>
          <FaBox className="me-1" />
          Generate Product Blog
        </button>
        <button className="btn-reset" onClick={() => setFormData({
          language: "English",
          tone: "Professional",
          length: "Medium (800–1000 words)",
          targetAudience: "General Audience",
          blogTopic: "",
          productType: "SaaS",
          announcementType: "New Product",
        })}>
          Reset Form
        </button>
      </div>
    </div>
  );
}

export default ProductBlog;
