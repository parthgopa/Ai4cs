import React, { useState } from "react";

const MeetingNote = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    purpose: "meeting discussion summary",
    noteType: "Meeting/Discussion Note",
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
    onGenerate("meeting-note", formData);
  };

  return (
    <div className="note-form">
      <div className="form-header">
        <h4>Meeting/Discussion Note</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Meeting Title/Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter meeting title or subject"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Meeting Context *</label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleChange}
            className="form-control"
            placeholder="Describe the meeting purpose and context"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date and Time *</label>
          <input
            type="text"
            name="dateTimeReference"
            value={formData.dateTimeReference}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., January 15, 2024, 2:00 PM"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Key Discussion Points *</label>
          <textarea
            name="keyPoints"
            value={formData.keyPoints}
            onChange={handleChange}
            className="form-control"
            placeholder="List the main topics discussed"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Key Points and Observations *</label>
          <textarea
            name="factsObservations"
            value={formData.factsObservations}
            onChange={handleChange}
            className="form-control"
            placeholder="Important points, data shared, observations made"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Attendees/Participants *</label>
          <input
            type="text"
            name="peopleInvolved"
            value={formData.peopleInvolved}
            onChange={handleChange}
            className="form-control"
            placeholder="Names of people who attended the meeting"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Decisions and Outcomes *</label>
          <textarea
            name="decisionsOutcomes"
            value={formData.decisionsOutcomes}
            onChange={handleChange}
            className="form-control"
            placeholder="Decisions made, action items, next steps"
            rows="3"
            required
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
            Generate Meeting Note
          </button>
          <button className="btn-reset" onClick={() => setFormData({
            purpose: "meeting discussion summary",
            noteType: "Meeting/Discussion Note",
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

export default MeetingNote;
