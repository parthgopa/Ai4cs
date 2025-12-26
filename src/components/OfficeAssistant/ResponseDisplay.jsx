import React from 'react';
import { Card, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaCopy, FaFilePdf, FaFileWord, FaArrowLeft } from 'react-icons/fa';
import PDFGenerator from '../PDFGenerator';
import WordGenerator from '../WordGenerator';
import AIDisclaimer from '../AIDisclaimer';

const ResponseDisplay = ({ 
  response, 
  currentTool, 
  currentMode, 
  formData, 
  onReset,
  title,
  subject 
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert("Copied to clipboard!");
  };

  const handlePDFExport = () => {
    let fileName, content;

    if (currentTool === "email" && currentMode === "New Email" && formData.subject) {
      fileName = `${formData.subject}-email.pdf`;
      content = response;
    } else {
      fileName = `${currentMode.toLowerCase().replace(" ", "-")}.pdf`;
      content = response;
    }

    const { generatePDF } = PDFGenerator({
      content,
      fileName,
      title: title || currentMode,
    });
    generatePDF();
  };

  const handleWordExport = () => {
    let fileName, content;

    if (currentTool === "email" && currentMode === "New Email" && formData.subject) {
      fileName = `${formData.subject}-email.docx`;
      content = response;
    } else {
      fileName = `${currentMode.toLowerCase().replace(" ", "-")}.docx`;
      content = response;
    }

    const { generateWord } = WordGenerator({
      content,
      fileName,
      title: title || currentMode,
    });
    generateWord();
  };

  if (!response) return null;

  return (
    <div className="mb-4">
      <h2 className="card-title" style={{ marginBottom: "6px" }}>
        {title || `${currentMode}:`}
      </h2>
      {subject && (
        <h3 className="card-title" style={{ marginBottom: "12px" }}>
          {subject}
        </h3>
      )}
      <Card className="output-card">
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Button variant="outline-secondary" onClick={onReset}>
            <FaArrowLeft className="me-1" />
            {currentMode}
          </Button>
          <div className="d-flex">
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={handleCopy}
            >
              <FaCopy className="me-1" />
              <span className="d-none d-sm-inline">Copy</span>
            </Button>
            <Button
              variant="outline-danger"
              onClick={handlePDFExport}
              className="me-2"
            >
              <FaFilePdf className="me-1" />
              <span className="d-none d-sm-inline">PDF</span>
            </Button>
            <Button
              variant="outline-success"
              onClick={handleWordExport}
            >
              <FaFileWord className="me-1" />
              <span className="d-none d-sm-inline">Word</span>
            </Button>
          </div>
        </div>
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {response}
          </ReactMarkdown>
        </div>
        <AIDisclaimer variant="light" />
      </Card>
    </div>
  );
};

export default ResponseDisplay;
