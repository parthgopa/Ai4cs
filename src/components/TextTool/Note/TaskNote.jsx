import React, { useState } from "react";

const TaskNote = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    purpose: "task activity tracking",
    noteType: "Task/Activity Note",
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
    onGenerate("task-note", formData);
  };

  return (
    <div className="note-form">
      <div className="form-header">
        <h4>Task/Activity Note</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task/Activity Title *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter task or activity title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Task Context *</label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleChange}
            className="form-control"
            placeholder="Describe the task, project, or activity context"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Timeline/Deadline</label>
          <input
            type="text"
            name="dateTimeReference"
            value={formData.dateTimeReference}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., Due January 20, 2024, Week 3, Q1 2024"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Task Details and Progress *</label>
          <textarea
            name="keyPoints"
            value={formData.keyPoints}
            onChange={handleChange}
            className="form-control"
            placeholder="Describe task details, current progress, status"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Observations and Issues *</label>
          <textarea
            name="factsObservations"
            value={formData.factsObservations}
            onChange={handleChange}
            className="form-control"
            placeholder="Progress made, challenges faced, observations"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Team Members/Assignees *</label>
          <input
            type="text"
            name="peopleInvolved"
            value={formData.peopleInvolved}
            onChange={handleChange}
            className="form-control"
            placeholder="Names of people involved or responsible"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Next Steps and Dependencies *</label>
          <textarea
            name="decisionsOutcomes"
            value={formData.decisionsOutcomes}
            onChange={handleChange}
            className="form-control"
            placeholder="Next steps, dependencies, blockers, expected outcomes"
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
            Generate Task Note
          </button>
          <button className="btn-reset" onClick={() => setFormData({
            purpose: "task activity tracking",
            noteType: "Task/Activity Note",
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

export default TaskNote;
