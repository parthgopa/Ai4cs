import React, { useState } from "react";
import { FaUpload, FaPaste, FaFileAlt, FaTimes } from "react-icons/fa";
import { backend_URL } from "../../HomePage";


const InputMethod = ({ onContentChange, onMethodChange }) => {
  const [inputMethod, setInputMethod] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");

  const handleMethodSelect = (method) => {
    setInputMethod(method);
    setUploadedFile(null);
    setPastedText("");
    onMethodChange(method);
    onContentChange("");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // For now, we'll simulate file reading
      // In a real implementation, you'd use FileReader API or backend processing
      const formData = new FormData();
    formData.append("file", file);

    try {
      // Note the URL matches your Blueprint prefix + route
      const response = await fetch(`${backend_URL}/texttool/extract-text`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.extractedText) {
        console.log("Extracted text:", data.extractedText);
        onContentChange(data.extractedText);
      } else {
        alert(data.error || "Failed to extract text");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
    }
  };

  const handleTextPaste = (event) => {
    const text = event.target.value;
    setPastedText(text);
    onContentChange(text);
  };

  const removeFile = () => {
    setUploadedFile(null);
    onContentChange("");
  };

  const clearText = () => {
    setPastedText("");
    onContentChange("");
  };

  return (
    <div className="input-method-section">
      <div className="input-method-header">
        <h4 className="input-method-title">Choose Input Method</h4>
        <p className="input-method-description">Select how you want to provide your content</p>
      </div>

      {!inputMethod && (
        <div className="input-method-options">
          <div 
            className="input-method-card"
            onClick={() => handleMethodSelect("upload")}
          >
            <div className="method-icon">
              <FaUpload />
            </div>
            <div className="method-content">
              <h5>Upload File</h5>
              <p>PDF / DOCX / TXT</p>
            </div>
          </div>

          <div 
            className="input-method-card"
            onClick={() => handleMethodSelect("paste")}
          >
            <div className="method-icon">
              <FaPaste />
            </div>
            <div className="method-content">
              <h5>Paste Text</h5>
              <p>Direct text input</p>
            </div>
          </div>
        </div>
      )}

      {inputMethod === "upload" && (
        <div className="file-upload-area">
          <div className="upload-header">
            <h5>Upload Your File</h5>
            <button 
              className="back-button"
              onClick={() => handleMethodSelect("")}
            >
              Change Method
            </button>
          </div>
          
          {!uploadedFile ? (
            <div className="upload-zone">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-label">
                <FaUpload className="upload-icon" />
                <p>Click to upload or drag and drop</p>
                <span>PDF, DOCX, TXT files (Max 10MB)</span>
              </label>
            </div>
          ) : (
            <div className="uploaded-file">
              <div className="file-info">
                <FaFileAlt className="file-icon" />
                <div className="file-details">
                  <p className="file-name">{uploadedFile.name}</p>
                  <p className="file-size">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button 
                className="remove-file-btn"
                onClick={removeFile}
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      )}

      {inputMethod === "paste" && (
        <div className="text-paste-area">
          <div className="paste-header">
            <h5>Paste Your Text</h5>
            <button 
              className="back-button"
              onClick={() => handleMethodSelect("")}
            >
              Change Method
            </button>
          </div>
          
          <div className="paste-textarea-container">
            <textarea
              className="paste-textarea"
              placeholder="Paste your text content here..."
              value={pastedText}
              onChange={handleTextPaste}
              rows={8}
            />
            {pastedText && (
              <button 
                className="clear-text-btn"
                onClick={clearText}
              >
                <FaTimes />
                Clear
              </button>
            )}
          </div>
          
          <div className="text-stats">
            <span>Characters: {pastedText.length}</span>
            <span>Words: {pastedText.split(/\s+/).filter(word => word.length > 0).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputMethod;
