import React from "react";
import "./TextTool.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaFileAlt, FaChartBar, FaBlog } from "react-icons/fa";
// Tool Registry - Simple and easy to extend
const TOOLS = {
  email: {
    key: "email",
    label: "Email Drafting",
    icon: <FaEnvelope />,
    description: "Create professional emails and draft thoughtful replies with AI assistance",
    route: "/text-tool/email",
  },
  letter: {
    key: "letter",
    label: "Letter Drafting",
    icon: <FaFileAlt />,
    description: "Draft formal and personal letters with proper formatting",
    route: "/text-tool/letter",
  },
  // report: {
  //   key: "report",
  //   label: "Report Generation",
  //   icon: <FaChartBar />,
  //   description: "Generate comprehensive reports for various professional and academic purposes",
  //   route: "/text-tool/report",
  // },
  // blog: {
  //   key: "blog",
  //   label: "Blog Generation",
  //   icon: <FaBlog />,
  //   description: "Create engaging blogs for educational, business, technical, and marketing purposes",
  //   route: "/text-tool/blog",
  // },
};

const TextTool = () => {
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
            Text Tool
          </h1>
          <p className="assistant-description">
            Your intelligent document creation companion - craft professional communications with ease
          </p>
        </div>

        {/* Tools Grid */}
        <div className="assistant-tools-grid">
          {Object.values(TOOLS).map((tool) => (
            <div key={tool.key} className="tool-card-wrapper-office">
              <div
                className="tool-card-office"
                role="button"
                tabIndex={0}
                onClick={() => handleToolClick(tool)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleToolClick(tool);
                }}
              >
                <div className="tool-icon-office">{tool.icon}</div>
                <div className="tool-content-office">
                  <h3 className="tool-title-office">{tool.label}</h3>
                  <p className="tool-description-office">{tool.description}</p>
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

export default TextTool;