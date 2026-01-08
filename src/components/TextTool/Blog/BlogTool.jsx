import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBlog, FaGraduationCap, FaBriefcase, FaListOl, FaCode, FaLightbulb, FaBullhorn, FaBox, FaSpinner } from "react-icons/fa";
import { TextToolAPI } from "../../../Common/API";
import EducationalBlog from "./EducationalBlog";
import BusinessBlog from "./BusinessBlog";
import TechBlog from "./TechBlog";
import OpinionBlog from "./OpinionBlog";
import MarketingBlog from "./MarketingBlog";
import ProductBlog from "./ProductBlog";
import ResponseDisplay from "../ResponseDisplay";
import "./BlogTool.css";

const BlogTool = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("Educational");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const modes = [
    { key: "Educational", label: "Educational/Explainer", icon: <FaGraduationCap /> },
    { key: "Business", label: "Business/Corporate", icon: <FaBriefcase /> },
    { key: "Tech", label: "Tech/Developer", icon: <FaCode /> },
    { key: "Opinion", label: "Opinion/Thought Leadership", icon: <FaLightbulb /> },
    { key: "Marketing", label: "Marketing/SEO", icon: <FaBullhorn /> },
    { key: "Product", label: "Product/Feature", icon: <FaBox /> },
  ];

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    setResponse("");
    setLoading(false);
    
    // Scroll to form section on small screens when a mode is selected
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const formSection = document.querySelector('.form-section');
        if (formSection) {
          formSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  const resetForm = () => {
    setResponse("");
    setLoading(false);
    setCurrentFormData(null);
  };

  // Generation functions
  const generateBlog = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    try {
      await TextToolAPI.generateBlog({
        blogType: type,
        data: data
      }, (response) => {
        setLoading(false);
        if (response.candidates && response.candidates[0].content.parts) {
          setResponse(response.candidates[0].content.parts[0].text);
        } else {
          setResponse(
            "Sorry, we couldn't generate the blog. Please try again."
          );
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while generating the blog. Please try again later."
      );
      console.error("Error:", error);
    }
  };

  // Render mode-specific content
  const renderModeContent = () => {
    if (loading) {
      return (
        <div className="form-card">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Processing...</p>
            <p>Please wait while we process your request.</p>
          </div>
        </div>
      );
    }

    switch (currentMode) {
      case "Educational":
        return <EducationalBlog onGenerate={generateBlog} />;
      case "Business":
        return <BusinessBlog onGenerate={generateBlog} />;
      case "Tech":
        return <TechBlog onGenerate={generateBlog} />;
      case "Opinion":
        return <OpinionBlog onGenerate={generateBlog} />;
      case "Marketing":
        return <MarketingBlog onGenerate={generateBlog} />;
      case "Product":
        return <ProductBlog onGenerate={generateBlog} />;
      default:
        return <EducationalBlog onGenerate={generateBlog} />;
    }
  };

  return (
    <div className="blog-tool-page">
      {/* Mode Selection */}
      <div className="mode-selector">
        <h3 className="mode-title">Choose Blog Type:</h3>
        <div className="mode-buttons">
          {modes.map((mode) => (
            <button
              key={mode.key}
              className={`mode-button ${currentMode === mode.key ? 'active' : ''}`}
              onClick={() => handleModeChange(mode.key)}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-label">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Section */}
      <div className="response-section">
        <ResponseDisplay
          response={response}
          currentTool="blog"
          currentMode={currentMode}
          formData={currentFormData}
          onReset={resetForm}
          title={`${currentMode} Blog:`}
          subject={currentFormData?.blogTopic}
        />
      </div>

      {/* Content Area */}
      {!response && (
        <div className="form-section">
          <div className="form-card">
            {renderModeContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTool;
