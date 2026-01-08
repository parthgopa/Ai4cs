import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

const ExplanatoryNote = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    purpose: "explanation",
    noteType: "Explanatory Note",
    subject: "",
    context: "",
    dateTimeReference: "",
    keyPoints: "",
    factsObservations: "",
    peopleInvolved: "",
    decisionsOutcomes: "",
    tone: "descriptive/explanatory",
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
    onGenerate("explanatory-note", formData);
  };

  return (
    <div className="note-form">
      <div className="form-header">
        <h4>Explanatory Note</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title or Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter note title or subject"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Context or Situation *</label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleChange}
            className="form-control"
            placeholder="Describe what needs to be explained"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date/Time Reference</label>
          <input
            type="text"
            name="dateTimeReference"
            value={formData.dateTimeReference}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., Today, Meeting date, Project timeline"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Key Points to Explain *</label>
          <textarea
            name="keyPoints"
            value={formData.keyPoints}
            onChange={handleChange}
            className="form-control"
            placeholder="List the main points that need explanation"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Facts and Observations *</label>
          <textarea
            name="factsObservations"
            value={formData.factsObservations}
            onChange={handleChange}
            className="form-control"
            placeholder="Relevant facts, data, or observations to support explanation"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">People Involved</label>
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
          <label className="form-label">Decisions or Outcomes</label>
          <textarea
            name="decisionsOutcomes"
            value={formData.decisionsOutcomes}
            onChange={handleChange}
            className="form-control"
            placeholder="Any decisions made or expected outcomes"
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
            Generate Explanatory Note
          </button>
          <button className="btn-reset" onClick={() => setFormData({
            purpose: "explanation",
            noteType: "Explanatory Note",
            subject: "",
            context: "",
            dateTimeReference: "",
            keyPoints: "",
            factsObservations: "",
            peopleInvolved: "",
            decisionsOutcomes: "",
            tone: "descriptive/explanatory",
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

export default ExplanatoryNote;
