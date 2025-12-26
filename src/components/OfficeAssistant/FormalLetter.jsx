import React, { useState } from 'react';
import { FaFileAlt, FaUser, FaBuilding, FaEnvelope } from 'react-icons/fa';

const FormalLetter = ({ onGenerate }) => {
  const [letterData, setLetterData] = useState({
    fromName: "",
    fromAddress: "",
    toRecipient: "",
    subject: "",
    openingConnotation: "",
    mainMatter: "",
    additionalMatter: "",
    closingConnotation: "",
    tone: "",
    length: "",
    language: "English",
  });

  const openingConnotationOptions = [
    { value: "", label: "Select opening..." },
    { value: "Dear Sir", label: "Dear Sir" },
    { value: "Dear Madam", label: "Dear Madam" },
    { value: "Dear Sir/Madam", label: "Dear Sir/Madam" },
    { value: "Respected Sir", label: "Respected Sir" },
    { value: "Respected Madam", label: "Respected Madam" },
    { value: "Dear Mr.", label: "Dear Mr." },
    { value: "Dear Ms.", label: "Dear Ms." },
    { value: "Dear Dr.", label: "Dear Dr." },
    { value: "Dear Prof.", label: "Dear Prof." },
    { value: "To Whom It May Concern", label: "To Whom It May Concern" },
  ];

  const toneOptions = [
    { value: "", label: "Select tone..." },
    { value: "Formal", label: "Formal" },
    { value: "Professional", label: "Professional" },
    { value: "Official", label: "Official" },
    { value: "Legal", label: "Legal" },
    { value: "Requesting", label: "Requesting" },
    { value: "Complaint", label: "Complaint" },
    { value: "Appreciative", label: "Appreciative" },
    { value: "Urgent", label: "Urgent" },
    { value: "Diplomatic", label: "Diplomatic" },
  ];

  const lengthOptions = [
    { value: "", label: "Select length..." },
    { value: "Concise", label: "Concise" },
    { value: "Medium", label: "Medium" },
    { value: "Detailed", label: "Detailed" },
    { value: "Comprehensive", label: "Comprehensive" },
  ];

  const closingConnotationOptions = [
    { value: "", label: "Select closing..." },
    { value: "Yours faithfully", label: "Yours faithfully" },
    { value: "Yours sincerely", label: "Yours sincerely" },
    { value: "With regards", label: "With regards" },
    { value: "Best regards", label: "Best regards" },
    { value: "Respectfully yours", label: "Respectfully yours" },
    { value: "Sincerely", label: "Sincerely" },
    { value: "Cordially", label: "Cordially" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" },
    { value: "German", label: "German" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLetterData({ ...letterData, [name]: value });
  };

  const handleGenerateLetter = () => {
    const requiredFields = ['fromName', 'fromAddress', 'toRecipient', 'subject', 'openingConnotation', 'mainMatter', 'closingConnotation', 'tone', 'length', 'language'];
    const missingFields = requiredFields.filter(field => !letterData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('formal-letter', letterData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Formal Letter</h3>
      <div className="form-grid">
        {/* 1. From Details */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            From (Your Name)
          </label>
          <input
            type="text"
            name="fromName"
            value={letterData.fromName}
            onChange={handleInputChange}
            placeholder="e.g., John Smith"
            className="form-control"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaBuilding className="me-2" />
            From (Your Address with PIN)
          </label>
          <textarea
            rows={3}
            name="fromAddress"
            value={letterData.fromAddress}
            onChange={handleInputChange}
            placeholder="123 Main Street, Apt 4B&#10;Mumbai, Maharashtra 400001&#10;India"
            className="form-control form-textarea"
          />
        </div>

        {/* 2. To Recipient */}
        <div className="form-group">
          <label className="form-label">
            <FaEnvelope className="me-2" />
            To (Recipient Details)
          </label>
          <textarea
            rows={3}
            name="toRecipient"
            value={letterData.toRecipient}
            onChange={handleInputChange}
            placeholder="Mr. Robert Johnson&#10;Human Resources Manager&#10;ABC Corporation, 456 Business Ave&#10;Delhi, Delhi 110001"
            className="form-control form-textarea"
          />
        </div>

        {/* 3. Subject */}
        <div className="form-group">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            value={letterData.subject}
            onChange={handleInputChange}
            placeholder="Enter the subject of your letter"
            className="form-control"
          />
        </div>

        {/* 4. Opening Connotation */}
        <div className="form-group">
          <label className="form-label">Opening Connotation</label>
          <select
            name="openingConnotation"
            value={letterData.openingConnotation}
            onChange={handleInputChange}
            className="form-select"
          >
            {openingConnotationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Main Matter */}
        <div className="form-group">
          <label className="form-label">Main Matter</label>
          <textarea
            rows={4}
            name="mainMatter"
            value={letterData.mainMatter}
            onChange={handleInputChange}
            placeholder="Describe the main purpose and content of your letter"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Additional Matter */}
        <div className="form-group">
          <label className="form-label">Additional Matter (Optional)</label>
          <textarea
            rows={3}
            name="additionalMatter"
            value={letterData.additionalMatter}
            onChange={handleInputChange}
            placeholder="Any additional points you want to include (optional)"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Closing Connotation */}
        <div className="form-group">
          <label className="form-label">Closing Connotation</label>
          <select
            name="closingConnotation"
            value={letterData.closingConnotation}
            onChange={handleInputChange}
            className="form-select"
          >
            {closingConnotationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 8. Tone */}
        <div className="form-group">
          <label className="form-label">Tone</label>
          <select
            name="tone"
            value={letterData.tone}
            onChange={handleInputChange}
            className="form-select"
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 9. Length */}
        <div className="form-group">
          <label className="form-label">Length</label>
          <select
            name="length"
            value={letterData.length}
            onChange={handleInputChange}
            className="form-select"
          >
            {lengthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 10. Language */}
        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            name="language"
            value={letterData.language}
            onChange={handleInputChange}
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
            onClick={handleGenerateLetter}
          >
            <FaFileAlt className="me-1" />
            Generate Letter
          </button>
          <button 
            className="btn-reset"
            onClick={() => setLetterData({
              fromName: "",
              fromAddress: "",
              toRecipient: "",
              subject: "",
              openingConnotation: "",
              mainMatter: "",
              additionalMatter: "",
              closingConnotation: "",
              tone: "",
              length: "",
              language: "English",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormalLetter;
