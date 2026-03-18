import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import VerificationModal from './CourtDrafting/VerificationModal';
import OutputDisplay from './CourtDrafting/OutputDisplay';
import APIService from '../Common/API';

const AffidavitLegalNote = () => {
    const [step, setStep] = useState('form');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    
    const [formData, setFormData] = useState({
        documentType: 'Affidavit',
        
        // Affidavit Fields
        deponentName: '',
        deponentAge: '',
        deponentOccupation: '',
        deponentAddress: '',
        deponentCapacity: 'Petitioner',
        affidavitPurpose: '',
        relatedCaseTitle: '',
        relatedCaseNumber: '',
        relatedCourt: '',
        swornFacts: '',
        placeOfSwearing: '',
        dateOfSwearing: '',
        
        // Legal Note Fields
        legalIssue: '',
        notePurpose: 'Opinion',
        noteJurisdiction: '',
        factualScenario: '',
        depthLevel: 'Detailed'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVerificationConfirm = async () => {
        setStep('output');
        setLoading(true);
        
        const prompt = generatePrompt();
        
        try {
            await APIService({
                question: prompt,
                onResponse: (data) => {
                    setLoading(false);
                    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                        setResponse(data.candidates[0].content.parts[0].text);
                    } else {
                        setResponse("Sorry, we couldn't generate the document. Please try again.");
                    }
                }
            });
        } catch (error) {
            setLoading(false);
            setResponse("An error occurred while generating the document. Please try again later.");
            console.error("Error:", error);
        }
    };

    const generatePrompt = () => {
        if (formData.documentType === 'Affidavit') {
            return `
ROLE: AI Legal Drafting Assistant for Affidavit (Sworn Declaration)

CORE RULES (STRICT):
- Do NOT assume facts
- Do NOT fabricate information
- Use only user-provided verified information
- Accuracy > Length > Style
- No legal arguments or case laws in affidavit
- Formal sworn language only

DOCUMENT TYPE: AFFIDAVIT

DEPONENT DETAILS:
Full Name: ${formData.deponentName}
Age: ${formData.deponentAge} years
Occupation: ${formData.deponentOccupation}
Residential Address: ${formData.deponentAddress}
Capacity: ${formData.deponentCapacity}

PURPOSE OF AFFIDAVIT:
${formData.affidavitPurpose}

RELATED CASE DETAILS (if applicable):
Case Title: ${formData.relatedCaseTitle || 'N/A'}
Case Number: ${formData.relatedCaseNumber || 'N/A'}
Court: ${formData.relatedCourt || 'N/A'}

SWORN FACTS (to be declared on oath):
${formData.swornFacts}

PLACE & DATE OF SWEARING:
Place: ${formData.placeOfSwearing}
Date: ${formData.dateOfSwearing}

AFFIDAVIT DRAFTING RULES:
- Formal sworn language
- Numbered factual paragraphs
- No legal arguments
- No case law or citations
- Include verification clause
- "I, [name], do hereby solemnly affirm and state as follows:"

OUTPUT FORMAT:
1. Title
2. Deponent Details (Name, Age, Occupation, Address)
3. Capacity Declaration
4. Sworn Statements (Numbered Paragraphs)
5. Verification Clause
6. Signature Section

MANDATORY DISCLAIMER:
"This affidavit is AI-assisted and prepared using user-provided facts only.
All details must be independently verified before notarization or official use."

Generate the Affidavit now.
`;
        } else {
            return `
ROLE: AI Legal Drafting Assistant for Legal Note (Advisory / Analytical)

CORE RULES (STRICT):
- Do NOT assume facts
- Do NOT fabricate citations
- Use only user-provided information
- Neutral and professional tone
- Principle-based reasoning

DOCUMENT TYPE: LEGAL NOTE

LEGAL ISSUE / TOPIC:
${formData.legalIssue}

PURPOSE:
${formData.notePurpose}

JURISDICTION (if applicable):
${formData.noteJurisdiction || 'General'}

FACTUAL SCENARIO:
${formData.factualScenario}

DEPTH LEVEL REQUIRED:
${formData.depthLevel}

LEGAL NOTE DRAFTING RULES:
- Structured legal analysis
- Principle-based reasoning
- No fabricated citations
- Neutral and professional tone
- Clearly separate facts, issue, and conclusion
- If case laws are needed, use only widely known principles
- Mark uncertain authorities as "Requires verification"

OUTPUT FORMAT:
1. Issue Framed
2. Facts Presented
3. Legal Analysis
   - Applicable Legal Principles
   - Relevant Statutory Provisions (if any)
   - Case Law Principles (if highly verifiable)
4. Conclusion / Opinion / Risk Assessment
5. Recommendations (if applicable)

MANDATORY DISCLAIMER:
"This legal note is AI-assisted and prepared using user-provided facts only.
All details, legal authorities, and conclusions must be independently verified before reliance."

Generate the Legal Note with ${formData.depthLevel} analysis now.
`;
        }
    };

    const getFactSummary = () => {
        if (formData.documentType === 'Affidavit') {
            return {
                'Document Type': 'Affidavit',
                'Deponent Name': formData.deponentName,
                'Age': formData.deponentAge,
                'Occupation': formData.deponentOccupation,
                'Address': formData.deponentAddress,
                'Capacity': formData.deponentCapacity,
                'Purpose': formData.affidavitPurpose,
                'Facts Summary': formData.swornFacts.substring(0, 150) + '...',
            };
        } else {
            return {
                'Document Type': 'Legal Note',
                'Legal Issue': formData.legalIssue,
                'Purpose': formData.notePurpose,
                'Jurisdiction': formData.noteJurisdiction || 'General',
                'Depth Level': formData.depthLevel,
            };
        }
    };

    if (step === 'verify') {
        return (
            <VerificationModal
                facts={getFactSummary()}
                onConfirm={handleVerificationConfirm}
                onEdit={() => setStep('form')}
                loading={loading}
            />
        );
    }

    if (step === 'output') {
        return (
            <OutputDisplay
                response={response}
                loading={loading}
                documentType={formData.documentType}
                onBack={() => {
                    setStep('form');
                    setResponse('');
                }}
            />
        );
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="page-header mb-4">
                        <h2 className="mb-0" style={{ color: 'var(--secondary-color)' }}>
                            Affidavit & Legal Note
                        </h2>
                        <p className="text-muted mb-0">
                            Professional Drafting for {formData.documentType}
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="input-card">
                        <Form>
                            {/* Document Type Selection */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="secondary" className="me-2">1</Badge>
                                    Document Type
                                </h5>
                                <Form.Group className="form-group">
                                    <Form.Label className="form-label">What type of document do you want to prepare?</Form.Label>
                                    <Form.Select
                                        name="documentType"
                                        value={formData.documentType}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="Affidavit">Affidavit (Sworn Declaration)</option>
                                        <option value="Legal Note">Legal Note (Advisory / Analytical)</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {formData.documentType === 'Affidavit' ? (
                                <>
                                    {/* Affidavit Fields */}
                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">2</Badge>
                                            Deponent Personal Details
                                        </h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Full Name (Exact as record)
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="deponentName"
                                                        value={formData.deponentName}
                                                        onChange={handleInputChange}
                                                        placeholder="Complete name"
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Age
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="deponentAge"
                                                        value={formData.deponentAge}
                                                        onChange={handleInputChange}
                                                        placeholder="Years"
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Occupation
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="deponentOccupation"
                                                        value={formData.deponentOccupation}
                                                        onChange={handleInputChange}
                                                        placeholder="Profession"
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Full Residential Address
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        name="deponentAddress"
                                                        value={formData.deponentAddress}
                                                        onChange={handleInputChange}
                                                        placeholder="Complete address with pin code"
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">3</Badge>
                                            Capacity & Purpose
                                        </h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Capacity of Deponent</Form.Label>
                                                    <Form.Select
                                                        name="deponentCapacity"
                                                        value={formData.deponentCapacity}
                                                        onChange={handleInputChange}
                                                        className="form-select"
                                                    >
                                                        <option value="Petitioner">Petitioner</option>
                                                        <option value="Respondent">Respondent</option>
                                                        <option value="Witness">Witness</option>
                                                        <option value="Applicant">Applicant</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Purpose of Affidavit
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="affidavitPurpose"
                                                        value={formData.affidavitPurpose}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., In support of petition / As evidence"
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">4</Badge>
                                            Related Case Details (if applicable)
                                        </h5>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Case Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="relatedCaseTitle"
                                                        value={formData.relatedCaseTitle}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., ABC vs. XYZ (leave blank if not applicable)"
                                                        className="form-control"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Case Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="relatedCaseNumber"
                                                        value={formData.relatedCaseNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="Case number"
                                                        className="form-control"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Court</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="relatedCourt"
                                                        value={formData.relatedCourt}
                                                        onChange={handleInputChange}
                                                        placeholder="Court name"
                                                        className="form-control"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">5</Badge>
                                            Facts to be Declared on Oath
                                        </h5>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">
                                                Sworn Facts (Numbered, Factual Only)
                                                <span className="text-danger"> *</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                name="swornFacts"
                                                value={formData.swornFacts}
                                                onChange={handleInputChange}
                                                placeholder="List facts to be sworn on oath. Be specific, truthful, and factual only - no legal arguments."
                                                className="form-control"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                ⚠️ Only factual statements - no legal arguments or opinions
                                            </Form.Text>
                                        </Form.Group>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">6</Badge>
                                            Place & Date of Swearing
                                        </h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Place of Swearing
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="placeOfSwearing"
                                                        value={formData.placeOfSwearing}
                                                        onChange={handleInputChange}
                                                        placeholder="City name"
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">
                                                        Date of Swearing
                                                        <span className="text-danger"> *</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="dateOfSwearing"
                                                        value={formData.dateOfSwearing}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Legal Note Fields */}
                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">2</Badge>
                                            Legal Issue / Topic
                                        </h5>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">
                                                Define the Legal Issue or Topic
                                                <span className="text-danger"> *</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="legalIssue"
                                                value={formData.legalIssue}
                                                onChange={handleInputChange}
                                                placeholder="Clearly state the legal question or issue to be analyzed..."
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">3</Badge>
                                            Purpose & Context
                                        </h5>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Purpose of Legal Note</Form.Label>
                                                    <Form.Select
                                                        name="notePurpose"
                                                        value={formData.notePurpose}
                                                        onChange={handleInputChange}
                                                        className="form-select"
                                                    >
                                                        <option value="Opinion">Legal Opinion</option>
                                                        <option value="Advisory">Advisory</option>
                                                        <option value="Analysis">Legal Analysis</option>
                                                        <option value="Risk Assessment">Risk Assessment</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Jurisdiction (if applicable)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="noteJurisdiction"
                                                        value={formData.noteJurisdiction}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., India / Gujarat / Supreme Court"
                                                        className="form-control"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">4</Badge>
                                            Facts or Scenario
                                        </h5>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">
                                                Factual Scenario (Accurate & Complete)
                                                <span className="text-danger"> *</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                name="factualScenario"
                                                value={formData.factualScenario}
                                                onChange={handleInputChange}
                                                placeholder="Provide the complete factual background for legal analysis..."
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">
                                            <Badge bg="secondary" className="me-2">5</Badge>
                                            Analysis Depth
                                        </h5>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">Depth Level Required</Form.Label>
                                            <Form.Select
                                                name="depthLevel"
                                                value={formData.depthLevel}
                                                onChange={handleInputChange}
                                                className="form-select"
                                            >
                                                <option value="Basic">Basic Overview</option>
                                                <option value="Detailed">Detailed Analysis</option>
                                                <option value="Court-Preparatory">Court-Preparatory (Comprehensive)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </>
                            )}

                            <div className="text-center mt-4">
                                <Button
                                    className="features-button px-5 py-3"
                                    onClick={() => setStep('verify')}
                                    size="lg"
                                >
                                    <FaCheckCircle className="me-2" />
                                    Proceed to Verification
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AffidavitLegalNote;
