import React, { useState } from 'react';
import { FaGraduationCap, FaUser, FaBuilding, FaCalendarAlt, FaTools, FaLightbulb, FaHistory, FaDatabase } from 'react-icons/fa';

const InternshipReport = ({ onGenerate }) => {
  // Sample dummy data for demonstration
  const dummyData = {
    studentName: "John Doe",
    organizationName: "Tech Solutions Inc.",
    internshipRole: "Software Developer Intern",
    department: "Engineering Department",
    duration: "3 months (June-August 2025)",
    supervisorName: "Jane Smith, Senior Developer",
    organizationOverview: "Tech Solutions Inc. is a leading software development company specializing in enterprise solutions and cloud-based applications. Founded in 2010, the company has grown to serve over 500 clients worldwide with innovative technology solutions.",
    keyResponsibilities: "• Developed and maintained web applications using React and Node.js\n• Assisted in database design and optimization using MongoDB\n• Participated in daily stand-up meetings and sprint planning sessions\n• Conducted unit testing and debugging of software components\n• Collaborated with cross-functional teams on project delivery and documentation",
    toolsTechnologies: "• Programming Languages: JavaScript, Python, HTML5, CSS3\n• Frameworks: React, Node.js, Express.js, Django\n• Tools: Git, JIRA, VS Code, Postman, Docker\n• Databases: MongoDB, MySQL, Redis\n• Cloud Platforms: AWS, Google Cloud Platform",
    keyLearnings: "• Gained hands-on experience in full-stack web development\n• Learned industry best practices for code version control and team collaboration\n• Developed problem-solving skills through debugging and optimization tasks\n• Improved communication and teamwork skills in an agile development environment\n• Acquired knowledge of cloud deployment and DevOps practices",
    challenges: "• Initial difficulty understanding complex codebase and architecture\n• Managing time effectively between multiple project tasks\n• Adapting to professional coding standards and review processes",
    solutions: "• Proactively sought guidance from senior developers and team members\n• Implemented time management techniques and prioritized tasks based on deadlines\n• Regularly reviewed coding standards and participated in code review sessions to improve quality",
    conclusion: "The internship at Tech Solutions Inc. provided invaluable industry experience and significantly enhanced my technical skills. Working on real-world projects helped bridge the gap between academic knowledge and practical application. This experience has solidified my career goals in software development and prepared me for future professional challenges.",
  };

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

  const [savedData, setSavedData] = useState(() => {
    // Load saved data from localStorage on component mount
    const saved = localStorage.getItem('internshipReportSavedData');
    return saved ? JSON.parse(saved) : null;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleKeyPress = (e) => {
    console.log(e);
    // if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
    //   e.preventDefault();
    //   handleGenerateReport();
    // }
  };



  const handleGenerateReport = () => {
    const requiredFields = ['studentName', 'organizationName', 'internshipRole', 'department', 'duration', 'supervisorName', 'organizationOverview', 'keyResponsibilities', 'toolsTechnologies', 'keyLearnings'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    
    // Automatically save the current data to localStorage when generating
    setSavedData({...reportData});
    localStorage.setItem('internshipReportSavedData', JSON.stringify(reportData));
    
    onGenerate('internship-report', reportData);
  };

  const loadDummyData = () => {
    setReportData(dummyData);
  };

  const loadSavedData = () => {
    // Try to get fresh data from localStorage first
    const freshSavedData = localStorage.getItem('internshipReportSavedData');
    if (freshSavedData) {
      const parsedData = JSON.parse(freshSavedData);
      setSavedData(parsedData);
      setReportData(parsedData);
    } else if (savedData) {
      setReportData(savedData);
    } else {
      alert("No saved data found. Generate a report first to save your data automatically.");
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h3 className="form-section-title">Internship Report</h3>
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
            onClick={loadDummyData}
            title="Load sample data"
          >
            <FaHistory />
          </button>
        </div>
      </div>
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
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
