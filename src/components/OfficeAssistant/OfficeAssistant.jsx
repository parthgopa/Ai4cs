import React from "react";
import "./OfficeAssistant.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaFileAlt } from "react-icons/fa";
// Tool Registry - Simple and easy to extend
const TOOLS = {
  email: {
    key: "email",
    label: "Email Drafting",
    icon: <FaEnvelope />,
    description: "Create professional emails and draft thoughtful replies with AI assistance",
    route: "/office-assistant/email",
  },
  // Future tools can be added here:
  // letter: {
  //   key: "letter",
  //   label: "Letter Drafting",
  //   icon: <FaFileAlt />,
  //   description: "Draft formal and personal letters with proper formatting",
  //   route: "/office-assistant/letter",
  // },
};

const OfficeAssistant = () => {
    const navigate = useNavigate();
  const handleToolClick = (tool) => {
    // In your actual app: navigate(tool.route);
    navigate(tool.route);
  };

  return (
    <main className="office-assistant-page">
      <div className="container">
        {/* Header Section */}
        <div className="assistant-header">
          <h1 className="assistant-title">
            <span className="title-icon"> <FaFileAlt /> </span>
            Office Assistant
          </h1>
          <p className="assistant-description">
            Your intelligent document creation companion - craft professional communications with ease
          </p>
        </div>

        {/* Tools Grid */}
        <div className="assistant-tools-grid">
          {Object.values(TOOLS).map((tool) => (
            <div key={tool.key} className="tool-card-wrapper">
              <div
                className="tool-card"
                role="button"
                tabIndex={0}
                onClick={() => handleToolClick(tool)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleToolClick(tool);
                }}
              >
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-content">
                  <h3 className="tool-title">{tool.label}</h3>
                  <p className="tool-description">{tool.description}</p>
                  <span className="tool-badge">Open Tool</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="coming-soon-section">
          <h4 className="coming-soon-title">More Tools Coming Soon</h4>
          <p className="coming-soon-description">
            We're constantly expanding our suite of tools to help streamline your document creation workflow. 
            Stay tuned for letter drafting, memo creation, and more professional writing assistants.
          </p>
        </div>
      </div>
    </main>
  );
};

export default OfficeAssistant;