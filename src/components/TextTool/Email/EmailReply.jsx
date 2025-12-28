import React, { useState } from 'react';
import { FaReply, FaFile, FaUpload, FaImage, FaFilePdf, FaFileWord, FaEye, FaCheck, FaHistory, FaDatabase } from 'react-icons/fa';

const EmailReply = ({ onGenerate }) => {
  // Sample previous data for demonstration
  const previousReplyData = {
    to: "John Smith, Legal Counsel",
    uploadMethod: "text",
    originalEmail: "Dear Team,\n\nWe need to schedule a board meeting for next month to discuss the quarterly results and upcoming projects. Please provide your availability for the first week of next month.\n\nBest regards,\nSarah Johnson\nCEO",
    subject: "Re: Board Meeting Schedule",
    connotation: "Dear Sir",
    replyMatter: "Confirm availability for board meeting and propose specific dates",
    additionalMatter: "Request agenda items and prepare necessary documents",
    tone: "Professional",
    size: "Medium",
    closing: "Best regards",
    signature: "Jane Smith, Company Secretary",
    language: "English",
  };

  const [replyData, setReplyData] = useState({
    to: "",
    uploadMethod: "text",
    originalEmail: "",
    subject: "",
    connotation: "",
    replyMatter: "",
    additionalMatter: "",
    tone: "",
    size: "",
    closing: "",
    signature: "",
    language: "",
  });

  const [fileProcessing, setFileProcessing] = useState({
    isProcessing: false,
    progress: 0,
    status: "",
    error: null,
  });

  const [savedReplyData, setSavedReplyData] = useState(() => {
    // Load saved data from localStorage on component mount
    const saved = localStorage.getItem('emailReplySavedData');
    return saved ? JSON.parse(saved) : null;
  });

  const connotationOptions = [
    { value: "", label: "Select connotation..." },
    { value: "Sir", label: "Sir" },
    { value: "Dear Sir", label: "Dear Sir" },
    { value: "Madam", label: "Madam" },
    { value: "Dear Madam", label: "Dear Madam" },
    { value: "Dear Sir/Madam", label: "Dear Sir/Madam" },
    { value: "Respected Sir", label: "Respected Sir" },
    { value: "Respected Madam", label: "Respected Madam" },
    { value: "Dear Mr.", label: "Dear Mr." },
    { value: "Dear Ms.", label: "Dear Ms." },
  ];

  const toneOptions = [
    { value: "", label: "Select tone..." },
    { value: "Simple", label: "Simple" },
    { value: "Professional", label: "Professional" },
    { value: "Legal", label: "Legal" },
    { value: "Requesting", label: "Requesting" },
    { value: "Friendly", label: "Friendly" },
    { value: "Formal", label: "Formal" },
    { value: "Apologetic", label: "Apologetic" },
    { value: "Assertive", label: "Assertive" },
    { value: "Grateful", label: "Grateful" },
    { value: "Urgent", label: "Urgent" },
  ];

  const sizeOptions = [
    { value: "", label: "Select size..." },
    { value: "Summary", label: "Summary" },
    { value: "Medium", label: "Medium" },
    { value: "Detailed", label: "Detailed" },
  ];

  const closingOptions = [
    { value: "", label: "Select closing..." },
    { value: "With regards", label: "With regards" },
    { value: "Yours faithfully", label: "Yours faithfully" },
    { value: "Yours sincerely", label: "Yours sincerely" },
    { value: "Best regards", label: "Best regards" },
    { value: "Warm regards", label: "Warm regards" },
    { value: "Respectfully yours", label: "Respectfully yours" },
    { value: "Thank you", label: "Thank you" },
  ];

  const languageOptions = [
    { value: "", label: "Select language..." },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Gujarati", label: "Gujarati" },
  ];

  const handleReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyData({ ...replyData, [name]: value });
  };

  const processTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error("Failed to read text file"));
      reader.readAsText(file);
    });
  };

  const processPDFFile = async (file) => {
    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc =
        "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (error) {
      throw new Error(
        "PDF processing failed. Please try copying and pasting the text manually."
      );
    }
  };

  const processImageFile = async (file) => {
    try {
      const { createWorker } = await import("tesseract.js");

      const worker = await createWorker({
        logger: (m) => {
          if (m.status === "recognizing text") {
            setFileProcessing((prev) => ({
              ...prev,
              progress: Math.round(m.progress * 100),
              status: "Recognizing text...",
            }));
          }
        },
      });

      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();

      return text;
    } catch (error) {
      throw new Error(
        "OCR processing failed. Please try a clearer image or paste text manually."
      );
    }
  };

  const processWordFile = async (file) => {
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error(
        "Word document processing failed. Please try copying and pasting the text manually."
      );
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileProcessing({
      isProcessing: true,
      progress: 0,
      status: "Processing file...",
      error: null,
    });

    try {
      let extractedText = "";
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        setFileProcessing((prev) => ({
          ...prev,
          status: "Reading text file...",
        }));
        extractedText = await processTextFile(file);
      } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        setFileProcessing((prev) => ({
          ...prev,
          status: "Extracting text from PDF...",
        }));
        extractedText = await processPDFFile(file);
      } else if (
        fileType.startsWith("image/") ||
        fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
      ) {
        setFileProcessing((prev) => ({
          ...prev,
          status: "Running OCR on image...",
        }));
        extractedText = await processImageFile(file);
      } else if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
      ) {
        setFileProcessing((prev) => ({
          ...prev,
          status: "Extracting text from Word document...",
        }));
        extractedText = await processWordFile(file);
      } else {
        throw new Error(
          "Unsupported file type. Please use TXT, PDF, DOCX, or image files."
        );
      }

      setReplyData((prev) => ({
        ...prev,
        originalEmail: extractedText.trim(),
      }));

      setFileProcessing({
        isProcessing: false,
        progress: 100,
        status: "File processed successfully!",
        error: null,
      });

      setTimeout(() => {
        setFileProcessing((prev) => ({ ...prev, status: "" }));
      }, 3000);
    } catch (error) {
      setFileProcessing({
        isProcessing: false,
        progress: 0,
        status: "",
        error: error.message,
      });
    }
  };

  const handleGenerateReply = () => {
    const requiredFields = ['to', 'originalEmail', 'subject', 'connotation', 'replyMatter', 'tone', 'size', 'closing', 'signature', 'language'];
    const missingFields = requiredFields.filter(field => !replyData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    
    // Automatically save the current data to localStorage when generating
    setSavedReplyData({...replyData});
    localStorage.setItem('emailReplySavedData', JSON.stringify(replyData));
    
    onGenerate('email-reply', replyData);
  };

  const loadPreviousData = () => {
    setReplyData(previousReplyData);
  };

  const loadSavedData = () => {
    // Try to get fresh data from localStorage first
    const freshSavedData = localStorage.getItem('emailReplySavedData');
    if (freshSavedData) {
      const parsedData = JSON.parse(freshSavedData);
      setSavedReplyData(parsedData);
      setReplyData(parsedData);
    } else if (savedReplyData) {
      setReplyData(savedReplyData);
    } else {
      alert("No saved data found. Generate an email reply first to save your data automatically.");
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h3 className="form-section-title">Reply to Email</h3>
        <div className="form-header-buttons">
          <button 
            className="btn-load-saved" 
            onClick={loadSavedData}
            title="Load your saved data"
          >
            <FaDatabase />
          </button>
          <button 
            className="btn-load-previous" 
            onClick={loadPreviousData}
            title="Load sample data"
          >
            <FaHistory />
          </button>
        </div>
      </div>
      <div className="form-grid">
        {/* 1. To Field */}
        <div className="form-group">
          <label className="form-label">To: (Recipient's name + position)</label>
          <input
            type="text"
            name="to"
            value={replyData.to}
            onChange={handleReplyInputChange}
            placeholder="e.g., John Doe, Company Secretary"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Copy Paste Text vs Upload */}
        <div className="form-group">
          <label className="form-label">
            How would you like to provide the original email?
          </label>
          <div className="d-flex gap-3 mb-3">
            <label className="d-flex align-items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="text"
                checked={replyData.uploadMethod === "text"}
                onChange={handleReplyInputChange}
                className="me-2"
              />
              <FaFile className="me-2" />
              Type/Paste Text
            </label>
            <label className="d-flex align-items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="file"
                checked={replyData.uploadMethod === "file"}
                onChange={handleReplyInputChange}
                className="me-2"
              />
              <FaUpload className="me-2" />
              Upload File
            </label>
          </div>
        </div>

        {/* Text Input Method */}
        {replyData.uploadMethod === "text" && (
          <div className="form-group">
            <label className="form-label">Original Email</label>
            <textarea
              rows={8}
              name="originalEmail"
              value={replyData.originalEmail}
              onChange={handleReplyInputChange}
              placeholder="Paste the original email here..."
              className="form-control form-textarea"
            />
          </div>
        )}

        {/* File Upload Method */}
        {replyData.uploadMethod === "file" && (
          <div className="form-group">
            <label className="form-label">Upload File</label>
            <div className="mb-3">
              <div className="alert alert-info small">
                <strong>Supported formats:</strong>
                <ul className="mb-0 mt-2">
                  <li>
                    <FaImage className="me-1" /> Images (JPG, PNG, GIF, BMP,
                    WebP) - OCR text extraction
                  </li>
                  <li>
                    <FaFilePdf className="me-1" /> PDF files - Text extraction
                  </li>
                  <li>
                    <FaFileWord className="me-1" /> Word documents (.docx) -
                    Text extraction
                  </li>
                  <li>
                    <FaFile className="me-1" /> Text files (.txt) - Direct
                    reading
                  </li>
                </ul>
              </div>
            </div>

            <input
              type="file"
              accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleFileUpload}
              className="form-control"
              disabled={fileProcessing.isProcessing}
            />

            {/* File Processing Status */}
            {fileProcessing.isProcessing && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">{fileProcessing.status}</small>
                  <small className="text-muted">
                    {fileProcessing.progress}%
                  </small>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    style={{ width: `${fileProcessing.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {fileProcessing.status &&
              !fileProcessing.isProcessing &&
              !fileProcessing.error && (
                <div className="alert alert-success mt-3 small">
                  <FaCheck className="me-1" />
                  {fileProcessing.status}
                </div>
              )}

            {fileProcessing.error && (
              <div className="alert alert-danger mt-3 small">
                <strong>Error:</strong> {fileProcessing.error}
              </div>
            )}

            {/* Extracted Text Preview */}
            {replyData.originalEmail && replyData.uploadMethod === "file" && (
              <div className="form-group mt-3">
                <label className="form-label">
                  <FaEye className="me-1" />
                  Extracted Text (You can edit if needed)
                </label>
                <textarea
                  rows={6}
                  name="originalEmail"
                  value={replyData.originalEmail}
                  onChange={handleReplyInputChange}
                  className="form-control form-textarea"
                />
              </div>
            )}
          </div>
        )}

        {/* 3. Subject Field */}
        <div className="form-group">
          <label className="form-label">Subject of the reply</label>
          <input
            type="text"
            name="subject"
            value={replyData.subject}
            onChange={handleReplyInputChange}
            placeholder="Enter the subject line for your reply"
            className="form-control"
          />
        </div>

        {/* 4. Connotation Field */}
        <div className="form-group">
          <label className="form-label">Connotation</label>
          <select
            name="connotation"
            value={replyData.connotation}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            {connotationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Reply Matter Field */}
        <div className="form-group">
          <label className="form-label">Reply matter (brief context / purpose)</label>
          <textarea
            rows={4}
            name="replyMatter"
            value={replyData.replyMatter}
            onChange={handleReplyInputChange}
            placeholder="Provide brief context or purpose of the reply"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Additional Matter Field */}
        <div className="form-group">
          <label className="form-label">Additional matter (optional)</label>
          <textarea
            rows={3}
            name="additionalMatter"
            value={replyData.additionalMatter}
            onChange={handleReplyInputChange}
            placeholder="Any additional points you want to include (optional)"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Tone Field */}
        <div className="form-group">
          <label className="form-label">Tone</label>
          <select
            name="tone"
            value={replyData.tone}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 8. Size Field */}
        <div className="form-group">
          <label className="form-label">Size</label>
          <select
            name="size"
            value={replyData.size}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            {sizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 9. Closing Field */}
        <div className="form-group">
          <label className="form-label">Closing</label>
          <select
            name="closing"
            value={replyData.closing}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            {closingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 10. Signature Field */}
        <div className="form-group">
          <label className="form-label">Signature (Your name + position)</label>
          <input
            type="text"
            name="signature"
            value={replyData.signature}
            onChange={handleReplyInputChange}
            placeholder="e.g., Jane Smith, Legal Counsel"
            className="form-control"
          />
        </div>

        {/* 11. Language Field */}
        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            name="language"
            value={replyData.language}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReply}
            disabled={fileProcessing.isProcessing}
          >
            <FaReply className="me-1" />
            Generate Reply
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReplyData({
              to: "",
              uploadMethod: "text",
              originalEmail: "",
              subject: "",
              connotation: "",
              replyMatter: "",
              additionalMatter: "",
              tone: "",
              size: "",
              closing: "",
              signature: "",
              language: "",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailReply;