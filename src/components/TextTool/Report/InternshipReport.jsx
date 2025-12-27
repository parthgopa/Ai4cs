import React, { useState } from 'react';
import { FaGraduationCap, FaUser, FaBuilding, FaCalendarAlt, FaTools, FaLightbulb } from 'react-icons/fa';

const InternshipReport = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    studentName: "",
    organizationName: "",
    internshipRole: "",
    department: "",
    duration: "",
    supervisorName: "",
    organizationOverview: "",
    keyResponsibilities: "",
    toolsTechnologies: "",
    keyLearnings: "",
    challenges: "",
    solutions: "",
    conclusion: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleGenerateReport = () => {
    const requiredFields = ['studentName', 'organizationName', 'internshipRole', 'department', 'duration', 'supervisorName', 'organizationOverview', 'keyResponsibilities', 'toolsTechnologies', 'keyLearnings'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('internship-report', reportData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Internship Report</h3>
      <div className="form-grid">
        {/* 1. Student Name */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            Student Name
          </label>
          <input
            type="text"
            name="studentName"
            value={reportData.studentName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Organization Name */}
        <div className="form-group">
          <label className="form-label">
            <FaBuilding className="me-2" />
            Organization Name
          </label>
          <input
            type="text"
            name="organizationName"
            value={reportData.organizationName}
            onChange={handleInputChange}
            placeholder="Enter organization name"
            className="form-control"
          />
        </div>

        {/* 3. Internship Role */}
        <div className="form-group">
          <label className="form-label">
            <FaGraduationCap className="me-2" />
            Internship Role / Title
          </label>
          <input
            type="text"
            name="internshipRole"
            value={reportData.internshipRole}
            onChange={handleInputChange}
            placeholder="e.g., Software Developer Intern, Marketing Intern"
            className="form-control"
          />
        </div>

        {/* 4. Department */}
        <div className="form-group">
          <label className="form-label">Department / Team</label>
          <input
            type="text"
            name="department"
            value={reportData.department}
            onChange={handleInputChange}
            placeholder="e.g., Engineering Department, Marketing Team"
            className="form-control"
          />
        </div>

        {/* 5. Duration */}
        <div className="form-group">
          <label className="form-label">
            <FaCalendarAlt className="me-2" />
            Internship Duration
          </label>
          <input
            type="text"
            name="duration"
            value={reportData.duration}
            onChange={handleInputChange}
            placeholder="e.g., 3 months (June-August 2024), 6 weeks"
            className="form-control"
          />
        </div>

        {/* 6. Supervisor Name */}
        <div className="form-group">
          <label className="form-label">Supervisor / Mentor Name</label>
          <input
            type="text"
            name="supervisorName"
            value={reportData.supervisorName}
            onChange={handleInputChange}
            placeholder="Enter supervisor's name"
            className="form-control"
          />
        </div>

        {/* 7. Organization Overview */}
        <div className="form-group">
          <label className="form-label">Organization Overview</label>
          <textarea
            rows={4}
            name="organizationOverview"
            value={reportData.organizationOverview}
            onChange={handleInputChange}
            placeholder="Brief description of the organization, its mission, products/services, and industry position"
            className="form-control form-textarea"
          />
        </div>

        {/* 8. Key Responsibilities */}
        <div className="form-group">
          <label className="form-label">Key Responsibilities (3-5 points)</label>
          <textarea
            rows={5}
            name="keyResponsibilities"
            value={reportData.keyResponsibilities}
            onChange={handleInputChange}
            placeholder="List your main responsibilities during the internship. Each point on a new line:
• Developed web applications using React and Node.js
• Assisted in database design and optimization
• Participated in daily stand-up meetings and sprint planning
• Conducted testing and debugging of software components
• Collaborated with cross-functional teams on project delivery"
            className="form-control form-textarea"
          />
        </div>

        {/* 9. Tools/Technologies Used */}
        <div className="form-group">
          <label className="form-label">
            <FaTools className="me-2" />
            Tools / Technologies Used
          </label>
          <textarea
            rows={3}
            name="toolsTechnologies"
            value={reportData.toolsTechnologies}
            onChange={handleInputChange}
            placeholder="List the tools, software, and technologies you worked with:
• Programming Languages: JavaScript, Python
• Frameworks: React, Django
• Tools: Git, JIRA, VS Code
• Databases: MySQL, MongoDB"
            className="form-control form-textarea"
          />
        </div>

        {/* 10. Key Learnings */}
        <div className="form-group">
          <label className="form-label">
            <FaLightbulb className="me-2" />
            Key Learnings
          </label>
          <textarea
            rows={4}
            name="keyLearnings"
            value={reportData.keyLearnings}
            onChange={handleInputChange}
            placeholder="Describe the key skills, knowledge, and experiences you gained during the internship"
            className="form-control form-textarea"
          />
        </div>

        {/* 11. Challenges Faced (Optional) */}
        <div className="form-group">
          <label className="form-label">Challenges Faced (Optional)</label>
          <textarea
            rows={3}
            name="challenges"
            value={reportData.challenges}
            onChange={handleInputChange}
            placeholder="Describe any challenges or difficulties you encountered during the internship"
            className="form-control form-textarea"
          />
        </div>

        {/* 12. Solutions (Optional) */}
        <div className="form-group">
          <label className="form-label">Solutions to Challenges (Optional)</label>
          <textarea
            rows={3}
            name="solutions"
            value={reportData.solutions}
            onChange={handleInputChange}
            placeholder="How you overcame the challenges mentioned above"
            className="form-control form-textarea"
          />
        </div>

        {/* 13. Conclusion */}
        <div className="form-group">
          <label className="form-label">Conclusion / Overall Experience (Optional)</label>
          <textarea
            rows={3}
            name="conclusion"
            value={reportData.conclusion}
            onChange={handleInputChange}
            placeholder="Overall summary of your internship experience and its impact on your career goals"
            className="form-control form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReport}
          >
            <FaGraduationCap className="me-1" />
            Generate Report
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReportData({
              studentName: "",
              organizationName: "",
              internshipRole: "",
              department: "",
              duration: "",
              supervisorName: "",
              organizationOverview: "",
              keyResponsibilities: "",
              toolsTechnologies: "",
              keyLearnings: "",
              challenges: "",
              solutions: "",
              conclusion: "",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipReport;
