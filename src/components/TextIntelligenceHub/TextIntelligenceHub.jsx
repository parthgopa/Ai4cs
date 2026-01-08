import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaListUl, FaLanguage, FaTasks, FaStickyNote, FaSpinner } from "react-icons/fa";
import { RiPresentationFill } from "react-icons/ri";
import APIService, { TextToolAPI } from "../../Common/API";
import Summarization from "./operations/Summarization";
import DotPoints from "./operations/DotPoints";
import PPTSlides from "./operations/PPTSlides";
import Translation from "./operations/Translation";
import ActionPoints from "./operations/ActionPoints";
import InternalNote from "./operations/InternalNote";
import ResponseDisplay from "../TextTool/ResponseDisplay";
import InputMethod from "./common/InputMethod";
import "./TextIntelligenceHub.css";

const TextIntelligenceHub = () => {
  const navigate = useNavigate();
  const [currentOperation, setCurrentOperation] = useState("");
  const [inputMethod, setInputMethod] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const operations = [
    { 
      key: "summarization", 
      label: "Summarisation", 
      icon: <FaFileAlt />,
      description: "Create concise summaries of documents and texts"
    },
    { 
      key: "dotpoints", 
      label: "Dot Points", 
      icon: <FaListUl />,
      description: "Extract key points as bullet lists"
    },
    { 
      key: "pptslides", 
      label: "PPT Slides", 
      icon: <RiPresentationFill />,
      description: "Convert content to presentation slides"
    },
    { 
      key: "translation", 
      label: "Translation", 
      icon: <FaLanguage />,
      description: "Translate text to different languages"
    },
    { 
      key: "actionpoints", 
      label: "Action Points", 
      icon: <FaTasks />,
      description: "Extract actionable items from content"
    },
    { 
      key: "internalnote", 
      label: "Internal Note", 
      icon: <FaStickyNote />,
      description: "Create structured office notes for internal use"
    },
  ];

  const handleOperationChange = (newOperation) => {
    setCurrentOperation(newOperation);
    setResponse("");
    setLoading(false);
    setCurrentFormData(null);
    setInputMethod("");
    setContent("");
    
    // Scroll to form section on small screens when an operation is selected
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

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setResponse("");
    setCurrentFormData(null);
  };

  const resetForm = () => {
    setResponse("");
    setLoading(false);
    setCurrentFormData(null);
    setInputMethod("");
    setContent("");
  };

  // Generation functions
  const generateContent = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    try {
      await TextToolAPI.generateTextIntelligence({
        operationType: type,
        ...data
      }, (response) => {
        setLoading(false);
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
          setResponse(response.candidates[0].content.parts[0].text);
        } else {
          setResponse(
            "Sorry, we couldn't process your request. Please try again."
          );
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while processing your request. Please try again later."
      );
      console.error("Error:", error);
    }
  };

  // Render content based on workflow state
  const renderContent = () => {
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

    // Step 1: Show operation selection if no operation selected
    if (!currentOperation) {
      return (
        <div className="operation-selector">
          <h3 className="operation-title">What do you want to create?</h3>
          <div className="operation-buttons">
            {operations.map((operation) => (
              <button
                key={operation.key}
                className={`operation-button ${currentOperation === operation.key ? 'active' : ''}`}
                onClick={() => handleOperationChange(operation.key)}
              >
                <span className="operation-icon">{operation.icon}</span>
                <span className="operation-label">{operation.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Step 2: Show input method selection if operation selected but no content
    if (currentOperation && !content) {
      return (
        <div className="form-section">
          <div className="form-card">
            <InputMethod 
              onContentChange={handleContentChange}
              onMethodChange={setInputMethod}
            />
          </div>
        </div>
      );
    }

    // Step 3: Show operation-specific inputs if content is provided
    if (currentOperation && content) {
      switch (currentOperation) {
        case "summarization":
          return <Summarization onGenerate={generateContent} content={content} />;
        case "dotpoints":
          return <DotPoints onGenerate={generateContent} content={content} />;
        case "pptslides":
          return <PPTSlides onGenerate={generateContent} content={content} />;
        case "translation":
          return <Translation onGenerate={generateContent} content={content} />;
        case "actionpoints":
          return <ActionPoints onGenerate={generateContent} content={content} />;
        case "internalnote":
          return <InternalNote onGenerate={generateContent} content={content} />;
        default:
          return (
            <div className="form-card">
              <div className="welcome-state">
                <h3>Welcome to Text Intelligence Hub</h3>
                <p>Select an operation type above to get started with professional text processing.</p>
              </div>
            </div>
          );
      }
    }

    return null;
  };

  return (
    <div className="text-intelligence-hub">
      {/* Content Area - Dynamic based on workflow state */}
      {renderContent()}

      {/* Response Section */}
      <div className="response-section">
        <ResponseDisplay
          response={response}
          currentTool="text-intelligence"
          currentMode={currentOperation}
          formData={currentFormData}
          onReset={resetForm}
          title={`${currentOperation ? operations.find(op => op.key === currentOperation)?.label : ''} Result:`}
          subject={currentFormData?.subject || "Processed Content"}
        />
      </div>
    </div>
  );
};

export default TextIntelligenceHub;
