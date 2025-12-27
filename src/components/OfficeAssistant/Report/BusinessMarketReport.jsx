import React, { useState } from 'react';
import { FaChartLine, FaBuilding, FaUsers, FaBullseye, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';

const BusinessMarketReport = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    reportTitle: "",
    companyIndustry: "",
    marketOverview: "",
    targetAudience: "",
    keyProblems: "",
    marketAnalysis: "",
    competitorAnalysis: "",
    proposedStrategy: "",
    financialGrowth: "",
    risksChallenges: "",
    conclusionRecommendations: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleGenerateReport = () => {
    const requiredFields = ['reportTitle', 'companyIndustry', 'marketOverview', 'targetAudience', 'keyProblems', 'marketAnalysis', 'competitorAnalysis', 'proposedStrategy', 'risksChallenges', 'conclusionRecommendations'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    onGenerate('business-market-report', reportData);
  };

  return (
    <div className="form-card">
      <h3 className="form-section-title">Business / Market Report</h3>
      <div className="form-grid">
        {/* 1. Report Title */}
        <div className="form-group">
          <label className="form-label">
            <FaChartLine className="me-2" />
            Report Title
          </label>
          <input
            type="text"
            name="reportTitle"
            value={reportData.reportTitle}
            onChange={handleInputChange}
            placeholder="Enter the business/market report title"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Company/Industry */}
        <div className="form-group">
          <label className="form-label">
            <FaBuilding className="me-2" />
            Company / Industry Name
          </label>
          <input
            type="text"
            name="companyIndustry"
            value={reportData.companyIndustry}
            onChange={handleInputChange}
            placeholder="Enter company or industry name"
            className="form-control"
          />
        </div>

        {/* 3. Market Overview */}
        <div className="form-group">
          <label className="form-label">Market Overview</label>
          <textarea
            rows={4}
            name="marketOverview"
            value={reportData.marketOverview}
            onChange={handleInputChange}
            placeholder="Provide a comprehensive overview of the current market landscape, trends, and dynamics"
            className="form-control form-textarea"
          />
        </div>

        {/* 4. Target Audience */}
        <div className="form-group">
          <label className="form-label">
            <FaUsers className="me-2" />
            Target Audience
          </label>
          <textarea
            rows={3}
            name="targetAudience"
            value={reportData.targetAudience}
            onChange={handleInputChange}
            placeholder="Describe the target audience, customer segments, and demographics"
            className="form-control form-textarea"
          />
        </div>

        {/* 5. Key Problems/Gaps */}
        <div className="form-group">
          <label className="form-label">
            <FaBullseye className="me-2" />
            Key Problems / Gaps
          </label>
          <textarea
            rows={4}
            name="keyProblems"
            value={reportData.keyProblems}
            onChange={handleInputChange}
            placeholder="Identify the key problems, gaps, or opportunities in the market that need to be addressed"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Market Analysis */}
        <div className="form-group">
          <label className="form-label">
            <FaChartBar className="me-2" />
            Market Analysis
          </label>
          <textarea
            rows={4}
            name="marketAnalysis"
            onChange={handleInputChange}
            placeholder="Provide detailed market analysis including size, growth rate, trends, and opportunities"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Competitor Analysis */}
        <div className="form-group">
          <label className="form-label">Competitor Analysis</label>
          <textarea
            rows={4}
            name="competitorAnalysis"
            value={reportData.competitorAnalysis}
            onChange={handleInputChange}
            placeholder="Analyze key competitors, their strengths, weaknesses, market share, and strategies"
            className="form-control form-textarea"
          />
        </div>

        {/* 8. Proposed Strategy */}
        <div className="form-group">
          <label className="form-label">Proposed Strategy</label>
          <textarea
            rows={4}
            name="proposedStrategy"
            value={reportData.proposedStrategy}
            onChange={handleInputChange}
            placeholder="Outline the proposed business strategy, action plan, and implementation approach"
            className="form-control form-textarea"
          />
        </div>

        {/* 9. Financial/Growth Insights (Optional) */}
        <div className="form-group">
          <label className="form-label">Financial / Growth Insights (Optional)</label>
          <textarea
            rows={3}
            name="financialGrowth"
            value={reportData.financialGrowth}
            onChange={handleInputChange}
            placeholder="Provide financial projections, growth forecasts, and revenue insights (optional)"
            className="form-control form-textarea"
          />
        </div>

        {/* 10. Risks & Challenges */}
        <div className="form-group">
          <label className="form-label">
            <FaExclamationTriangle className="me-2" />
            Risks & Challenges
          </label>
          <textarea
            rows={3}
            name="risksChallenges"
            value={reportData.risksChallenges}
            onChange={handleInputChange}
            placeholder="Identify potential risks, challenges, and mitigation strategies"
            className="form-control form-textarea"
          />
        </div>

        {/* 11. Conclusion & Recommendations */}
        <div className="form-group">
          <label className="form-label">Conclusion & Recommendations</label>
          <textarea
            rows={4}
            name="conclusionRecommendations"
            value={reportData.conclusionRecommendations}
            onChange={handleInputChange}
            placeholder="Provide strategic conclusions and actionable recommendations for business growth"
            className="form-control form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReport}
          >
            <FaChartLine className="me-1" />
            Generate Report
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReportData({
              reportTitle: "",
              companyIndustry: "",
              marketOverview: "",
              targetAudience: "",
              keyProblems: "",
              marketAnalysis: "",
              competitorAnalysis: "",
              proposedStrategy: "",
              financialGrowth: "",
              risksChallenges: "",
              conclusionRecommendations: "",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessMarketReport;
