import React, { useState } from "react";
import {
  Card,
  Form,
  Container,
  Row,
  Col,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import APIService from "../../Common/API";
import {
  FaCopy,
  FaFilePdf,
  FaSpinner,
  FaFileWord,
  FaBuilding,
  FaChartLine,
  FaCoins,
  FaBriefcase,
  FaCalculator,
  FaFileContract,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
} from "react-icons/fa";
import PDFGenerator from "../PDFGenerator";
import WordGenerator from "../WordGenerator";
import AIDisclaimer from "../AIDisclaimer";
import {
  generatePDFTemplate,
  generateWordTemplate,
} from "./ValuationTemplateGenerator";

const PreferentialIssueValuation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    cin: "",
    registeredOffice: "",
    dateOfIncorporation: "",
    businessNature: "",
    industryClassification: "",
    shareholdingPattern: "",
    financialStatements: "",
    latestFinancials: "",
    assetsLiabilities: "",
    profitLossTrends: "",
    cashFlowStatements: "",
    keyRatios: "",
    authorizedCapital: "",
    issuedCapital: "",
    subscribedCapital: "",
    paidUpCapital: "",
    existingShareClasses: "",
    existingInstruments: "",
    numberOfShares: "",
    shareClass: "",
    faceValue: "",
    issuePrice: "",
    considerationType: "",
    allotteeDetails: "",
    issueObjective: "",
    boardResolution: "",
    valuationDate: "",
    valuationMethodology: "",
    valuationAssumptions: "",
    discountRate: "",
    growthRate: "",
    multiples: "",
    marketData: "",
    rule13Compliance: "",
    boardResolutionValuer: "",
    valuerDeclaration: "",
    sebiRbiGuidelines: "",
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: "Company Details", icon: <FaBuilding /> },
    { number: 2, title: "Financial Info", icon: <FaChartLine /> },
    { number: 3, title: "Share Capital", icon: <FaCoins /> },
    { number: 4, title: "Proposed Issue", icon: <FaBriefcase /> },
    { number: 5, title: "Valuation", icon: <FaCalculator /> },
    { number: 6, title: "Compliance", icon: <FaFileContract /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.companyName &&
          formData.cin &&
          formData.registeredOffice &&
          formData.dateOfIncorporation &&
          formData.businessNature &&
          formData.industryClassification &&
          formData.shareholdingPattern
        );
      case 2:
        return (
          formData.financialStatements &&
          formData.assetsLiabilities &&
          formData.profitLossTrends &&
          formData.cashFlowStatements &&
          formData.keyRatios
        );
      case 3:
        return (
          formData.authorizedCapital &&
          formData.issuedCapital &&
          formData.subscribedCapital &&
          formData.paidUpCapital &&
          formData.existingShareClasses
        );
      case 4:
        return (
          formData.numberOfShares &&
          formData.shareClass &&
          formData.faceValue &&
          formData.issuePrice &&
          formData.considerationType &&
          formData.allotteeDetails &&
          formData.issueObjective &&
          formData.boardResolution
        );
      case 5:
        return (
          formData.valuationDate &&
          formData.valuationMethodology &&
          formData.valuationAssumptions &&
          formData.discountRate &&
          formData.growthRate &&
          formData.marketData
        );
      case 6:
        return (
          formData.rule13Compliance &&
          formData.boardResolutionValuer &&
          formData.valuerDeclaration
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    const prompt = `You are a valuation assistant helping a Company Secretary prepare a valuation report for a preferential issue of shares/securities under Section 62(1)(c) of the Companies Act, 2013 and Rule 13 of the Share Capital & Debentures Rules, 2014.

Input Details:
🏢 Company: ${formData.companyName}, CIN: ${formData.cin}, Office: ${formData.registeredOffice}, Incorporation: ${formData.dateOfIncorporation}, Business: ${formData.businessNature}, Industry: ${formData.industryClassification}, Shareholding: ${formData.shareholdingPattern}

📊 Financials: Audited: ${formData.financialStatements}, Latest: ${formData.latestFinancials}, Assets/Liabilities: ${formData.assetsLiabilities}, P&L: ${formData.profitLossTrends}, Cash Flow: ${formData.cashFlowStatements}, Ratios: ${formData.keyRatios}

📈 Capital: Authorized: ${formData.authorizedCapital}, Issued: ${formData.issuedCapital}, Subscribed: ${formData.subscribedCapital}, Paid-up: ${formData.paidUpCapital}, Classes: ${formData.existingShareClasses}, Instruments: ${formData.existingInstruments}

💼 Issue: Shares: ${formData.numberOfShares}, Class: ${formData.shareClass}, Face: ${formData.faceValue}, Price: ${formData.issuePrice}, Consideration: ${formData.considerationType}, Allottees: ${formData.allotteeDetails}, Objective: ${formData.issueObjective}, Resolution: ${formData.boardResolution}

📐 Valuation: Date: ${formData.valuationDate}, Method: ${formData.valuationMethodology}, Assumptions: ${formData.valuationAssumptions}, Discount: ${formData.discountRate}, Growth: ${formData.growthRate}, Multiples: ${formData.multiples}, Market Data: ${formData.marketData}

📄 Compliance: Rule 13: ${formData.rule13Compliance}, Resolution: ${formData.boardResolutionValuer}, Declaration: ${formData.valuerDeclaration}, Guidelines: ${formData.sebiRbiGuidelines}

Generate a detailed valuation report with sections:
1. Title Page 2. Introduction 3. Company Overview 4. Financial Overview 5. Capital Structure 6. Proposed Issue Details 7. Valuation Methodology 8. Fair Value Conclusion 9. Declaration 10. Annexures`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data?.candidates?.[0]?.content?.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse(
              "Sorry, we couldn't generate a valuation report. Please try again."
            );
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred. Please try again later.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="text-center mb-4">
              <FaBuilding size={48} className="text-primary mb-3" />
              <h4 className="mb-2">Company Details</h4>
              <p className="text-muted">
                Let's start with your company information
              </p>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Company Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter company name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">CIN *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Corporate Identification Number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Registered Office Address *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="registeredOffice"
                value={formData.registeredOffice}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Complete registered office address"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Date of Incorporation *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfIncorporation"
                    value={formData.dateOfIncorporation}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Industry Classification *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="industryClassification"
                    value={formData.industryClassification}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., IT Services, Manufacturing"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Nature of Business *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="businessNature"
                value={formData.businessNature}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Describe the business activities"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Shareholding Pattern (Pre-issue) *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="shareholdingPattern"
                value={formData.shareholdingPattern}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Promoters: 60%, Public: 40%"
              />
            </Form.Group>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="text-center mb-4">
              <FaChartLine size={48} className="text-primary mb-3" />
              <h4 className="mb-2">Financial Information</h4>
              <p className="text-muted">
                Provide financial statements and key metrics
              </p>
            </div>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Audited Financial Statements (Last 3 years) *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="financialStatements"
                value={formData.financialStatements}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Summary of audited financials for the last 3 years"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Latest Unaudited Financials
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="latestFinancials"
                value={formData.latestFinancials}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Most recent unaudited financial data (if applicable)"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Assets and Liabilities Details *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="assetsLiabilities"
                value={formData.assetsLiabilities}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Breakdown of current assets, liabilities, and net worth"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Profit and Loss Trends *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="profitLossTrends"
                value={formData.profitLossTrends}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Revenue, EBITDA, and net profit trends"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Cash Flow Statements *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="cashFlowStatements"
                value={formData.cashFlowStatements}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Operating, investing, and financing cash flows"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Key Financial Ratios *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="keyRatios"
                value={formData.keyRatios}
                onChange={handleInputChange}
                className="form-control"
                placeholder="P/E ratio, ROE, ROA, Debt-to-Equity, Current Ratio, etc."
              />
            </Form.Group>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="text-center mb-4">
              <FaCoins size={48} className="text-primary mb-3" />
              <h4 className="mb-2">Share Capital Structure</h4>
              <p className="text-muted">Detail your existing share capital</p>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Authorized Capital *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="authorizedCapital"
                    value={formData.authorizedCapital}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Rs. 10,00,00,000"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Issued Capital *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="issuedCapital"
                    value={formData.issuedCapital}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Rs. 8,00,00,000"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Subscribed Capital *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="subscribedCapital"
                    value={formData.subscribedCapital}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Rs. 7,50,00,000"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Paid-up Capital *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="paidUpCapital"
                    value={formData.paidUpCapital}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Rs. 7,50,00,000"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Existing Classes of Shares *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="existingShareClasses"
                value={formData.existingShareClasses}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Equity shares of Rs. 10 each, Preference shares of Rs. 100 each"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Terms of Existing Instruments
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="existingInstruments"
                value={formData.existingInstruments}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Convertible debentures, warrants, or other securities with terms"
              />
            </Form.Group>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="text-center mb-4">
              <FaBriefcase size={48} className="text-primary mb-3" />
              <h4 className="mb-2">Proposed Preferential Issue</h4>
              <p className="text-muted">
                Details about the shares to be issued
              </p>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Number of Shares *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="numberOfShares"
                    value={formData.numberOfShares}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="1,00,000 equity shares"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Share Class *</Form.Label>
                  <Form.Control
                    type="text"
                    name="shareClass"
                    value={formData.shareClass}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Equity shares / Preference shares"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Face Value *</Form.Label>
                  <Form.Control
                    type="text"
                    name="faceValue"
                    value={formData.faceValue}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Rs. 10"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Issue Price *</Form.Label>
                  <Form.Control
                    type="text"
                    name="issuePrice"
                    value={formData.issuePrice}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Rs. 100"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Consideration *
                  </Form.Label>
                  <Form.Select
                    name="considerationType"
                    value={formData.considerationType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Non-Cash">Non-Cash</option>
                    <option value="Mixed">Mixed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Allottee Details *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="allotteeDetails"
                value={formData.allotteeDetails}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Name, category, and relationship of proposed allottees"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Purpose/Objective of Issue *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="issueObjective"
                value={formData.issueObjective}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Business expansion, debt repayment, working capital"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Board Resolutions *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="boardResolution"
                value={formData.boardResolution}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Resolution number, date, and key approvals"
              />
            </Form.Group>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <div className="text-center mb-4">
              <FaCalculator size={48} className="text-primary mb-3" />
              <h4 className="mb-2">Valuation Inputs</h4>
              <p className="text-muted">
                Methodology and assumptions for valuation
              </p>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Valuation Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="valuationDate"
                    value={formData.valuationDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Methodology *</Form.Label>
                  <Form.Select
                    name="valuationMethodology"
                    value={formData.valuationMethodology}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Method</option>
                    <option value="DCF">Discounted Cash Flow (DCF)</option>
                    <option value="NAV">Net Asset Value (NAV)</option>
                    <option value="Comparable Companies">
                      Comparable Companies
                    </option>
                    <option value="Market Multiples">Market Multiples</option>
                    <option value="Book Value">Book Value</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Valuation Assumptions *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="valuationAssumptions"
                value={formData.valuationAssumptions}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Key assumptions used in valuation"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Discount Rate (%) *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="12%"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Growth Rate (%) *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="growthRate"
                    value={formData.growthRate}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="8%"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Multiples (if applicable)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="multiples"
                value={formData.multiples}
                onChange={handleInputChange}
                className="form-control"
                placeholder="P/E: 15x, EV/EBITDA: 8x"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Market Data & Benchmarks *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="marketData"
                value={formData.marketData}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Industry benchmarks and comparable company data"
              />
            </Form.Group>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <div className="text-center mb-4">
              <FaFileContract size={48} className="text-primary mb-3" />
              <h4 className="mb-2">Regulatory Compliance</h4>
              <p className="text-muted">
                Final compliance and declaration details
              </p>
            </div>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Rule 13 Compliance Checklist *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="rule13Compliance"
                value={formData.rule13Compliance}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Details of compliance with Rule 13 of Share Capital & Debentures Rules"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Board Resolution Appointing Valuer *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="boardResolutionValuer"
                value={formData.boardResolutionValuer}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Resolution details and date"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                Valuer Independence Declaration *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="valuerDeclaration"
                value={formData.valuerDeclaration}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Valuer credentials and independence statement"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                SEBI/RBI Guidelines (if applicable)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="sebiRbiGuidelines"
                value={formData.sebiRbiGuidelines}
                onChange={handleInputChange}
                className="form-control"
                placeholder="For listed or foreign-invested companies"
              />
            </Form.Group>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">
              Preferential Issue of Shares / Securities
            </h2>
            <p className="text-center text-muted mb-4">
              Section 62(1)(c), Companies Act 2013
            </p>

            {/* Template Download Section */}
            {!response && (
              <Alert
                variant="info"
                className="mb-4"
                style={{
                  background: "var(--icon-bg)",
                  border: "1px solid var(--primary-color)",
                  borderRadius: "12px",
                }}
              >
                <div className="d-flex align-items-start">
                  <FaDownload size={24} className="text-primary me-3 mt-1" />
                  <div className="flex-grow-1">
                    <h6
                      className="mb-2"
                      style={{
                        color: "var(--primary-color)",
                        fontWeight: "600",
                      }}
                    >
                      📥 Download Information Collection Template
                    </h6>
                    <p
                      className="mb-3"
                      style={{ fontSize: "0.9rem", color: "var(--text-color)" }}
                    >
                      Download the template to share with your company. Once
                      they fill in all required details, you can use those
                      inputs to complete this valuation report form.
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={generatePDFTemplate}
                        style={{
                          borderRadius: "8px",
                          fontWeight: "500",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        <FaFilePdf className="me-2" />
                        Download PDF Template
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={generateWordTemplate}
                        style={{
                          borderRadius: "8px",
                          fontWeight: "500",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        <FaFileWord className="me-2" />
                        Download Word Template
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <ProgressBar
                now={(currentStep / totalSteps) * 100}
                label={`Step ${currentStep} of ${totalSteps}`}
                className="mb-3"
                style={{ height: "25px" }}
              />

              {/* Step Indicators */}
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="text-center"
                    style={{ flex: 1, minWidth: "80px" }}
                  >
                    <div
                      className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                        currentStep === step.number
                          ? "bg-primary text-white"
                          : currentStep > step.number
                          ? "bg-success text-white"
                          : "bg-light text-muted"
                      }`}
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                      }}
                    >
                      {currentStep > step.number ? (
                        <FaCheckCircle />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="small" style={{ fontSize: "11px" }}>
                      {step.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {!response && renderStepContent()}

            {/* Navigation Buttons */}
            {!response && (
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <FaArrowLeft className="me-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    className="features-button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                  >
                    Next
                    <FaArrowRight className="ms-2" />
                  </Button>
                ) : (
                  <Button
                    className="features-button"
                    onClick={handleSubmit}
                    disabled={!isStepValid() || loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="spinner me-2" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="me-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: "12px" }}>
              {formData.companyName} - Valuation Report
            </h1>
            <Card className="output-card">
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    alert("Copied!");
                  }}
                >
                  <FaCopy className="me-1" />
                  <span className="d-none d-sm-inline">Copy</span>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `${formData.companyName}-valuation-report.pdf`,
                      title: "Valuation Report",
                    });
                    generatePDF();
                  }}
                  className="me-2"
                >
                  <FaFilePdf className="me-1" />
                  <span className="d-none d-sm-inline">PDF</span>
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `${formData.companyName}-valuation-report.docx`,
                      title: "Valuation Report",
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Word</span>
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PreferentialIssueValuation;
