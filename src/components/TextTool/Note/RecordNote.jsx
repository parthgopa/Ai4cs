import React, { useState } from "react";

const RecordNote = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    purpose: "personal office record",
    noteType: "Personal/Office Record Note",
    subject: "",
    context: "",
    dateTimeReference: "",
    keyPoints: "",
    factsObservations: "",
    peopleInvolved: "",
    decisionsOutcomes: "",
    tone: "neutral professional",
    length: "medium",
    format: "headings with bullets"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate("record-note", formData);
  };

  return (
    <div className="note-form">
      <div className="form-header">
        <h4>Personal/Office Record</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Record Title/Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter record title or subject"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Record Context</label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleChange}
            className="form-control"
            placeholder="Describe the context or purpose of this record"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date/Time Reference *</label>
          <input
            type="text"
            name="dateTimeReference"
            value={formData.dateTimeReference}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., January 15, 2024, Today, Record date"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Record Details *</label>
          <textarea
            name="keyPoints"
            value={formData.keyPoints}
            onChange={handleChange}
            className="form-control"
            placeholder="Main details to record"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Facts and Information</label>
          <textarea
            name="factsObservations"
            value={formData.factsObservations}
            onChange={handleChange}
            className="form-control"
            placeholder="Relevant facts, data, or information"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Related People</label>
          <input
            type="text"
            name="peopleInvolved"
            value={formData.peopleInvolved}
            onChange={handleChange}
            className="form-control"
            placeholder="Names of relevant people (if any)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Outcomes or Status</label>
          <textarea
            name="decisionsOutcomes"
            value={formData.decisionsOutcomes}
            onChange={handleChange}
            className="form-control"
            placeholder="Current status, outcomes, or follow-up needed"
            rows="2"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tone</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="form-control"
            >
              <option value="very simple">Very Simple</option>
              <option value="neutral professional">Neutral Professional</option>
              <option value="descriptive/explanatory">Descriptive/Explanatory</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Length</label>
            <select
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="form-control"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Format</label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="form-control"
            >
              <option value="bullet points">Bullet Points</option>
              <option value="paragraphs">Paragraphs</option>
              <option value="headings with bullets">Headings with Bullets</option>
              <option value="mixed format">Mixed Format</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-generate" onClick={handleSubmit}>
            Generate Record Note
          </button>
          <button className="btn-reset" onClick={() => setFormData({
            purpose: "personal office record",
            noteType: "Personal/Office Record Note",
            subject: "",
            context: "",
            dateTimeReference: "",
            keyPoints: "",
            factsObservations: "",
            peopleInvolved: "",
            decisionsOutcomes: "",
            tone: "neutral professional",
            length: "medium",
            format: "headings with bullets"
          })}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordNote;
