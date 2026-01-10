import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { AgreementsAPI } from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch, FaMagic } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const AgreementDrafting = () => {
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [currentfeature, setCurrentfeature] = useState('');

  // Agreement types list
  const agreementTypes = [
    'Partnership Agreement',
    'Joint Venture Agreement',
    'Memorandum of Understanding (MOU)',
    'Service Level Agreement (SLA)',
    'Employment Contract',
    'Non-Compete Agreement',
    'Non-Disclosure Agreement (NDA)',
    'Loan Agreement',
    'Promissory Note',
    'Guarantee Agreement',
    'License Agreement',
    'Copyright Agreement',
    'Trademark License Agreement',
    'Rental Agreement',
    'Lease Agreement',
    'Purchase Agreement',
    'Supply Agreement',
    'Procurement Contract',
    'Software License Agreement',
    'Software Development Agreement',
    'Data Processing Agreement',
    'Confidentiality Agreement',
    'Settlement Agreement',
    'Collaboration Agreement'
  ];

  // Agreement Drafting form data
  const [formData, setFormData] = useState({
    agreementType: '',
    dateOfAgreement: '',
    partyAName: '',
    partyADescription: '',
    partyAAddress: '',
    partyBName: '',
    partyBDescription: '',
    partyBAddress: '',
    purpose: '',
    effectiveDate: '',
    duration: '',
    governingLaw: 'Andhra Pradesh',
    specialClauses: '',
    signatureNames: '',

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    
    // Check if agreement type is selected
    if (!formData.agreementType) {
      // Scroll to template section
      const templateSection = document.querySelector('.template-section');
      if (templateSection) {
        templateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Show warning message
      setResponse('⚠️ **Please select an agreement type first before generating a template.**\n\nChoose an agreement type from the dropdown menu above, then click "Generate Template" again.');
      setCurrentfeature('template-warning');
      return;
    }
    
    setTemplateLoading(true);
    setResponse('');
    setCurrentfeature('agreement-template');

    try {
      await AgreementsAPI.generateTemplate({
        agreementType: formData.agreementType
      }, (data) => {
        setTemplateLoading(false);
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
          setResponse(data.candidates[0].content.parts[0].text);
          // Scroll to output section after successful generation
          setTimeout(() => {
            const outputSection = document.querySelector('.output-card');
            if (outputSection) {
              outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          setResponse('Sorry, we couldn\'t generate a response. Please try again.');
        }
      });
    } catch (error) {
      setTemplateLoading(false);
      setResponse('An error occurred while processing your request. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentfeature('agreement-drafting');
    setResponse('');

    try {
      await AgreementsAPI.generateAgreement(formData, (data) => {
        setLoading(false);
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
          setResponse(data.candidates[0].content.parts[0].text);
        } else {
          setResponse('Sorry, we couldn\'t generate a response. Please try again.');
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse('An error occurred while processing your request. Please try again.');
    }
  };

  const indianRegions = [
    // States
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal","NCLT","Arbitration",
  
    // Union Territories
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];


  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Agreement Drafting</h2>

            {/* Template Generation Section */}
            <div className="template-section mb-4">
              <div className="template-card">
                <div className="template-header">
                  <div className="template-icon">
                    <FaMagic />
                  </div>
                  <div className="template-content">
                    <h4 className="template-title">Start with a Template?</h4>
                    <p className="template-description">
                      Generate a professional {formData.agreementType || 'agreement'} template to understand the structure before creating your complete agreement.
                    </p>
                  </div>
                </div>
                <div className="template-action">
                  <button 
                    onClick={handleTemplateSubmit} 
                    className="btn-template-generate" 
                    disabled={templateLoading || !formData.agreementType}
                  >
                    {templateLoading ? (
                      <>
                        <FaSpinner className="spinner me-2" />
                        Generating Template...
                      </>
                    ) : (
                      <>
                        <FaMagic className="me-2" />
                        Generate Template
                      </>
                    )}
                  </button>
                  {!formData.agreementType && (
                    <small className="text-muted d-block mt-2">Select an agreement type to enable template generation</small>
                  )}
                </div>
              </div>
            </div>

            <Form>
              {/* Agreement Type */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Agreement Type </Form.Label>
                <Form.Select
                  name="agreementType"
                  value={formData.agreementType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Agreement Type</option>
                  {agreementTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Date of Agreement */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Date of Agreement </Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfAgreement"
                  value={formData.dateOfAgreement}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              {/* Party A Details */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">First Party Name </Form.Label>
                    <Form.Control
                      type="text"
                      name="partyAName"
                      value={formData.partyAName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">First Party Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="partyADescription"
                      value={formData.partyADescription}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">First Party Address </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="partyAAddress"
                      value={formData.partyAAddress}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Party B Details */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Second Party Name </Form.Label>
                    <Form.Control
                      type="text"
                      name="partyBName"
                      value={formData.partyBName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Second Party Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="partyBDescription"
                      value={formData.partyBDescription}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Second Party Address </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="partyBAddress"
                      value={formData.partyBAddress}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Term Details */}
              <Row>
                <Col md={4}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Term / Duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., 3 years from Effective Date"
                      required
                    />
                  </Form.Group>
                </Col>
                
              </Row>
              {/* Purpose */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Purpose of Agreement</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe the purpose of this agreement"
                  required
                />
              </Form.Group>

              {/* Effective Date */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Effective Date</Form.Label>
                <Form.Control
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              {/* Governing Law & Jurisdiction -dropdown of indian states*/}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Governing Law & Jurisdiction</Form.Label>
                <Form.Select
                  name="governingLaw"
                  value={formData.governingLaw}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  {indianRegions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Special Clauses */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Special Clauses</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="specialClauses"
                  value={formData.specialClauses}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="IP rights, Exclusivity, Non-compete"
                />
              </Form.Group>

              {/* Signature Names & Designations */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Signature Names & Designations</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="signatureNames"
                  value={formData.signatureNames}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Name, title/designation for each party"
                />
              </Form.Group>

              <div className="form-actions">
                <button 
                  onClick={handleSubmit} 
                  className="btn-generate" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spinner me-2" />
                      Generating Agreement...
                    </>
                  ) : (
                    <>
                      <FaSearch className="me-2" />
                      Generate Agreement
                    </>
                  )}
                </button>
              </div>


            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            {currentfeature === 'template-warning' && (
              <h2 className="card-title" style={{ marginBottom: '20px', color: '#dc3545' }}>⚠️ Agreement Type Required</h2>
            )}
            {currentfeature === 'agreement-template' && (
              <h2 className="card-title" style={{ marginBottom: '20px' }}>{formData.agreementType} Agreement Template</h2>
            )}
            {currentfeature === 'agreement-drafting' && (
              <h2 className="card-title" style={{ marginBottom: '20px' }}>{formData.agreementType} Agreement Draft</h2>
            )}
            <Card className={`output-card ${currentfeature === 'template-warning' ? 'warning-card' : ''}`}>
              {currentfeature !== 'template-warning' && (
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => {
                      navigator.clipboard.writeText(response);
                      alert('Copied to clipboard!');
                    }}
                  >
                    <FaCopy className="me-1" />
                    <span className="d-none d-sm-inline">Copy to Clipboard</span>
                  </button>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => {
                      const { generatePDF } = PDFGenerator({
                        content: response,
                        fileName: `${formData.agreementType.replace(/\s+/g, '-').toLowerCase()}-${formData.partyAName}-${formData.partyBName}.pdf`,
                        title: `${formData.agreementType}`
                      });
                      generatePDF();
                    }}
                  >
                    <FaFilePdf className="me-1" />
                    <span className="d-none d-sm-inline">Download PDF</span>
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => {
                      const { generateWord } = WordGenerator({
                        content: response,
                        fileName: `${formData.agreementType.replace(/\s+/g, '-').toLowerCase()}-${formData.partyAName}-${formData.partyBName}.docx`,
                        title: `${formData.agreementType}`
                      });
                      generateWord();
                    }}
                  >
                    <FaFileWord className="me-1" />
                    <span className="d-none d-sm-inline">Download Word</span>
                  </button>
                </div>
              )}
              <div className="markdown-content">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
              {currentfeature !== 'template-warning' && <AIDisclaimer variant="light" />}
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AgreementDrafting;
