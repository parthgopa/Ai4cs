import React, { useState } from 'react';
import { FaChartLine, FaBuilding, FaUsers, FaBullseye, FaChartBar, FaExclamationTriangle, FaHistory, FaDatabase } from 'react-icons/fa';

const BusinessMarketReport = ({ onGenerate }) => {
  // Sample dummy data for demonstration
  const dummyData = {
    reportTitle: "Strategic Market Analysis: Sustainable Fashion Industry Growth 2024-2025",
    companyIndustry: "EcoStyle Fashion Inc.",
    marketOverview: "The global sustainable fashion market is experiencing unprecedented growth, valued at $7.5 billion in 2023 and projected to reach $11.1 billion by 2025, growing at a CAGR of 21.5%. Consumer awareness about environmental impact, coupled with regulatory pressures and technological innovations, is driving this transformation. Key trends include circular economy models, recycled materials, and transparent supply chains.",
    targetAudience: "Primary target includes environmentally conscious millennials and Gen Z consumers (ages 18-35) with annual incomes above $50,000. Secondary audience includes corporate clients seeking sustainable uniform solutions and B2B partners in the hospitality industry. Geographic focus on North America and European markets with high sustainability awareness.",
    keyProblems: "• High production costs for sustainable materials\n• Limited consumer education on sustainable fashion benefits\n• Supply chain transparency challenges\n• Competition from fast fashion brands\n• Inconsistent regulatory standards across regions\n• Limited scalability of eco-friendly manufacturing processes",
    marketAnalysis: "Market segmentation reveals premium segment (35% growth), mid-range sustainable options (28% growth), and affordable eco-friendly lines (18% growth). Digital channels account for 60% of sustainable fashion sales. Consumer behavior analysis shows 73% willingness to pay premium for sustainable products. Brand loyalty in sustainable segment is 40% higher than traditional fashion.",
    competitorAnalysis: "Key competitors include Patagonia (market leader with 22% share), Stella McCartney (luxury segment 15%), and H&M Conscious (mass market 18%). Competitive advantages include brand heritage, supply chain control, and innovation capabilities. Market gaps exist in plus-size sustainable fashion and men's sustainable business wear.",
    proposedStrategy: "Implement a three-phase growth strategy: Phase 1 (Q1-Q2 2024): Launch core sustainable collection with digital marketing campaign. Phase 2 (Q3-Q4 2024): Expand to physical retail partnerships and introduce circular economy program. Phase 3 (2025): Develop proprietary sustainable materials and enter international markets. Focus on omnichannel experience and community building.",
    financialGrowth: "Projected revenue growth: Year 1 - $2.5M, Year 2 - $4.8M, Year 3 - $8.2M. EBITDA margins expected to improve from 12% to 18% by Year 3. Initial investment requirement of $1.2M for inventory and marketing. Break-even expected by month 18. ROI projection of 35% over 3-year period.",
    risksChallenges: "• Supply chain disruptions due to climate change\n• Changing consumer preferences and trends\n• Regulatory compliance costs\n• Currency fluctuations in international markets\n• Technology adoption barriers\n• Potential greenwashing accusations and brand reputation risks",
    conclusionRecommendations: "The sustainable fashion market presents significant growth opportunities for EcoStyle Fashion Inc. Key recommendations include investing in supply chain transparency, developing strong brand storytelling around sustainability, leveraging digital platforms for customer education, and forming strategic partnerships with environmental organizations. Focus on innovation in sustainable materials and circular business models to maintain competitive advantage.",
  };

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

  const [savedData, setSavedData] = useState(() => {
    // Load saved data from localStorage on component mount
    const saved = localStorage.getItem('businessMarketReportSavedData');
    return saved ? JSON.parse(saved) : null;
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
    
    // Automatically save the current data to localStorage when generating
    setSavedData({...reportData});
    localStorage.setItem('businessMarketReportSavedData', JSON.stringify(reportData));
    
    onGenerate('business-market-report', reportData);
  };

  const loadDummyData = () => {
    setReportData(dummyData);
  };

  const loadSavedData = () => {
    // Try to get fresh data from localStorage first
    const freshSavedData = localStorage.getItem('businessMarketReportSavedData');
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
        <h3 className="form-section-title">Business / Market Report</h3>
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
