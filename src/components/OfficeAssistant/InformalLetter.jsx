import React, { useState } from 'react';
import { FaPen, FaUser, FaHeart } from 'react-icons/fa';

const InformalLetter = ({ onGenerate }) => {
  const [letterData, setLetterData] = useState({
    toWhom: "",
    purpose: "",
    tone: "",
    language: "English",
  });

  const toneOptions = [
    { value: "", label: "Select tone..." },
    { value: "Warm and friendly", label: "Warm and friendly" },
    { value: "Professional and polite", label: "Professional and polite" },
    { value: "Casual and cheerful", label: "Casual and cheerful" },
    { value: "Heartfelt and emotional", label: "Heartfelt and emotional" },
    { value: "Playful and humorous", label: "Playful and humorous" },
    { value: "Supportive and encouraging", label: "Supportive and encouraging" },
    { value: "Nostalgic and reflective", label: "Nostalgic and reflective" },
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
    const requiredFields = ['toWhom', 'purpose', 'tone', 'language'];
    const missingFields = requiredFields.filter(field => !letterData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('informal-letter', letterData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Informal Letter</h3>
      <div className="form-grid">
        {/* 1. To Whom */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            To Whom (Recipient's Name)
          </label>
          <input
            type="text"
            name="toWhom"
            value={letterData.toWhom}
            onChange={handleInputChange}
            placeholder="e.g., Dear Sarah, My friend John, Mom"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Purpose */}
        <div className="form-group">
          <label className="form-label">
            <FaHeart className="me-2" />
            Purpose (Main Matter)
          </label>
          <textarea
            rows={6}
            name="purpose"
            value={letterData.purpose}
            onChange={handleInputChange}
            placeholder="Describe what you want to say in this letter. For example: 
- Share news or updates about your life
- Express gratitude or appreciation
- Offer support or encouragement
- Share memories or experiences
- Ask for advice or help
- Simply reconnect and catch up"
            className="form-control form-textarea"
          />
        </div>

        {/* 3. Tone */}
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

        {/* 4. Language */}
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
            <FaPen className="me-1" />
            Generate Letter
          </button>
          <button 
            className="btn-reset"
            onClick={() => setLetterData({
              toWhom: "",
              purpose: "",
              tone: "",
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

export default InformalLetter;
