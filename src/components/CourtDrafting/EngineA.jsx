import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import VerificationModal from './VerificationModal';
import OutputDisplay from './OutputDisplay';
import APIService from '../../Common/API';

const EngineA = () => {
    const [step, setStep] = useState('form'); // 'form', 'verify', 'output'
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    
    const [formData, setFormData] = useState({
        // Step 1: Type of pleading
        pleadingType: 'Petition',
        
        // Step 2: Court & Jurisdiction
        court: '',
        jurisdiction: '',
        
        // Step 3: Party Details
        petitionerName: '',
        respondentName: '',
        
        // Step 4: Area of Law
        areaOfLaw: 'Civil',
        
        // Step 5: Factual Background
        factualBackground: '',
        
        // Step 6: Existing Orders
        hasExistingOrder: 'No',
        orderCourtName: '',
        orderCaseNumber: '',
        orderDate: '',
        orderSummary: '',
        
        // Step 7: Legal Issues
        issueFraming: 'Frame',
        legalIssues: '',
        
        // Step 8: Reliefs/Prayers
        reliefsSought: '',
        
        // Step 9: Case Laws
        includeCaseLaws: 'Yes',
        
        // Additional fields based on pleading type
        petitionType: '',
        causeOfActionDate: '',
        causeOfActionPlace: '',
        interimRelief: 'No',
        annexuresAvailable: 'No',
        
        // For Appeal
        impugnedJudgmentCourt: '',
        impugnedJudgmentCaseNo: '',
        impugnedJudgmentDate: '',
        groundsOfChallenge: [],
        limitationStatus: 'Within',
        delayReason: '',
        
        // For Written Submission
        caseStage: '',
        keyArguments: '',
        opponentArguments: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const currentValues = formData[name] || [];
            if (checked) {
                setFormData({ ...formData, [name]: [...currentValues, value] });
            } else {
                setFormData({ ...formData, [name]: currentValues.filter(v => v !== value) });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
                        setResponse("Sorry, we couldn't generate the court draft. Please try again.");
                    }
                }
            });
        } catch (error) {
            setLoading(false);
            setResponse("An error occurred while generating the court draft. Please try again later.");
            console.error("Error:", error);
        }
    };

    const generatePrompt = () => {
        let prompt = `
You are an AI Court Pleading Drafting Assistant operating under strict Indian court-compliance standards.

ABSOLUTE LEGAL SAFEGUARDS:
1. Never fabricate, invent, assume facts, case details, or legal citations.
2. Never generate fake SCC, AIR, SCR citations.
3. Only use widely known Supreme Court principles if required.
4. If citation certainty is below 100%, state: "Citation requires independent verification from official legal databases."
5. Do NOT guess missing case facts, dates, names, or procedural history.
6. Maintain duty of candour expected in Indian court pleadings.

DRAFTING RULES:
- Use formal court language only
- Maintain structured pleading format
- Clearly separate Facts, Grounds, and Prayers
- No fictional authorities or speculative reasoning
- Mark uncertain details as: "Requires factual verification"

DOCUMENT TYPE: ${formData.pleadingType}

VERIFIED CASE DETAILS:

1. Court & Jurisdiction: ${formData.court}, ${formData.jurisdiction}

2. Party Details:
   Petitioner/Appellant: ${formData.petitionerName}
   Respondent: ${formData.respondentName}

3. Area of Law: ${formData.areaOfLaw}

4. Factual Background (Chronological):
${formData.factualBackground}

5. Existing Orders/Judgments:
${formData.hasExistingOrder === 'Yes' ? `
   Court: ${formData.orderCourtName}
   Case Number: ${formData.orderCaseNumber}
   Date: ${formData.orderDate}
   Summary: ${formData.orderSummary}
` : 'None'}

6. Legal Issues:
${formData.issueFraming === 'Provide' ? formData.legalIssues : 'Frame issues based on facts provided'}

7. Reliefs/Prayers Sought:
${formData.reliefsSought}

8. Case Law Inclusion: ${formData.includeCaseLaws}
`;

        if (formData.pleadingType === 'Petition') {
            prompt += `
9. Petition-Specific Details:
   Type: ${formData.petitionType}
   Cause of Action: ${formData.causeOfActionDate}, ${formData.causeOfActionPlace}
   Interim Relief Required: ${formData.interimRelief}
   Annexures Available: ${formData.annexuresAvailable}
`;
        }

        if (formData.pleadingType === 'Appeal') {
            prompt += `
9. Appeal-Specific Details:
   Impugned Judgment Court: ${formData.impugnedJudgmentCourt}
   Case Number: ${formData.impugnedJudgmentCaseNo}
   Date: ${formData.impugnedJudgmentDate}
   Grounds of Challenge: ${formData.groundsOfChallenge.join(', ')}
   Limitation Status: ${formData.limitationStatus}
   ${formData.limitationStatus === 'Delay' ? `Reason for Delay: ${formData.delayReason}` : ''}
`;
        }

        if (formData.pleadingType === 'Written Submission') {
            prompt += `
9. Written Submission Details:
   Stage of Case: ${formData.caseStage}
   Key Arguments: ${formData.keyArguments}
   Opponent's Arguments: ${formData.opponentArguments}
`;
        }

        prompt += `
OUTPUT STRUCTURE (MANDATORY):
1. Title & Jurisdiction Heading
2. Cause Title (Parties)
3. Synopsis / Brief Facts (Verified Only)
4. Questions of Law (If Applicable)
5. Grounds / Legal Arguments (Fact-Based)
6. Verified Legal Principles (Safe Citation Protocol)
7. Prayer / Relief Clause
8. Verification Note

MANDATORY FINAL DISCLAIMER:
"This document is AI-assisted and prepared under strict anti-hallucination and verification protocol.
All facts, case details, citations, and legal authorities (if any) must be independently verified
from official legal databases such as SCC Online, Manupatra, Indian Kanoon, or official court records
before filing in any court of law."

Generate the court-ready ${formData.pleadingType} now.
`;
        return prompt;
    };

    const getFactSummary = () => {
        return {
            'Type of Pleading': formData.pleadingType,
            'Court': formData.court,
            'Jurisdiction': formData.jurisdiction,
            'Petitioner/Appellant': formData.petitionerName,
            'Respondent': formData.respondentName,
            'Area of Law': formData.areaOfLaw,
            'Factual Background': formData.factualBackground.substring(0, 200) + '...',
            'Reliefs Sought': formData.reliefsSought,
            ...(formData.hasExistingOrder === 'Yes' && {
                'Existing Order': `${formData.orderCaseNumber} dated ${formData.orderDate}`
            })
        };
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
                documentType={formData.pleadingType}
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
                        <h2 className="mb-0" style={{ color: 'var(--primary-color)' }}>
                            Court Drafting - Litigation Documents
                        </h2>
                        <p className="text-muted mb-0">
                            Professional Legal Drafting for {formData.pleadingType}
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="input-card">
                        <Form>
                            {/* Step 1: Type of Pleading */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">1</Badge>
                                    Type of Court Pleading
                                </h5>
                                <Form.Group className="form-group">
                                    <Form.Label className="form-label">Select Document Type</Form.Label>
                                    <Form.Select
                                        name="pleadingType"
                                        value={formData.pleadingType}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="Petition">Petition</option>
                                        <option value="Appeal">Appeal</option>
                                        <option value="Written Submission">Written Submission</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Step 2: Court & Jurisdiction */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">2</Badge>
                                    Court & Jurisdiction
                                </h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">Court Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="court"
                                                value={formData.court}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Supreme Court of India / High Court of Gujarat"
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">Jurisdiction</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="jurisdiction"
                                                value={formData.jurisdiction}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Civil Original Jurisdiction"
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Step 3: Party Details */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">3</Badge>
                                    Party Details (As Per Official Record)
                                </h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">
                                                {formData.pleadingType === 'Appeal' ? 'Appellant Name' : 'Petitioner Name'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="petitionerName"
                                                value={formData.petitionerName}
                                                onChange={handleInputChange}
                                                placeholder="Exact name as per records"
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">Respondent Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="respondentName"
                                                value={formData.respondentName}
                                                onChange={handleInputChange}
                                                placeholder="Exact name as per records"
                                                className="form-control"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Step 4: Area of Law */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">4</Badge>
                                    Area of Law
                                </h5>
                                <Form.Group className="form-group">
                                    <Form.Select
                                        name="areaOfLaw"
                                        value={formData.areaOfLaw}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="Civil">Civil</option>
                                        <option value="Criminal">Criminal</option>
                                        <option value="Constitutional">Constitutional</option>
                                        <option value="Service">Service</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Tax">Tax</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Step 5: Factual Background */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">5</Badge>
                                    Factual Background (Chronological Order)
                                </h5>
                                <Form.Group className="form-group">
                                    <Form.Label className="form-label">
                                        Provide complete factual background
                                        <span className="text-danger"> *</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        name="factualBackground"
                                        value={formData.factualBackground}
                                        onChange={handleInputChange}
                                        placeholder="Facts only — no legal arguments or assumptions. Present in chronological order."
                                        className="form-control"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        ⚠️ Strict instruction: Facts only — no legal arguments
                                    </Form.Text>
                                </Form.Group>
                            </div>

                            {/* Step 6: Existing Orders */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">6</Badge>
                                    Existing Orders / Impugned Judgment
                                </h5>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label className="form-label">Is there any existing order or judgment?</Form.Label>
                                    <Form.Select
                                        name="hasExistingOrder"
                                        value={formData.hasExistingOrder}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </Form.Select>
                                </Form.Group>

                                {formData.hasExistingOrder === 'Yes' && (
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Court Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="orderCourtName"
                                                    value={formData.orderCourtName}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Case Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="orderCaseNumber"
                                                    value={formData.orderCaseNumber}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Date of Order</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="orderDate"
                                                    value={formData.orderDate}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Brief Summary (exact as per order)</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="orderSummary"
                                                    value={formData.orderSummary}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}
                            </div>

                            {/* Step 7: Legal Issues */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">7</Badge>
                                    Legal Issues
                                </h5>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label className="form-label">Issue Framing Preference</Form.Label>
                                    <Form.Select
                                        name="issueFraming"
                                        value={formData.issueFraming}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="Frame">AI should frame issues from facts</option>
                                        <option value="Provide">I will provide legal issues</option>
                                    </Form.Select>
                                </Form.Group>

                                {formData.issueFraming === 'Provide' && (
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Legal Issues Involved</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="legalIssues"
                                            value={formData.legalIssues}
                                            onChange={handleInputChange}
                                            placeholder="List the legal issues to be addressed..."
                                            className="form-control"
                                        />
                                    </Form.Group>
                                )}
                            </div>

                            {/* Step 8: Reliefs/Prayers */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">8</Badge>
                                    Reliefs / Prayers Sought
                                </h5>
                                <Form.Group className="form-group">
                                    <Form.Label className="form-label">
                                        Specify exact reliefs/prayers
                                        <span className="text-danger"> *</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="reliefsSought"
                                        value={formData.reliefsSought}
                                        onChange={handleInputChange}
                                        placeholder="Example: Quashing, Stay, Bail, Compensation, Direction, etc."
                                        className="form-control"
                                        required
                                    />
                                </Form.Group>
                            </div>

                            {/* Step 9: Case Laws */}
                            <div className="form-section">
                                <h5 className="section-title">
                                    <Badge bg="primary" className="me-2">9</Badge>
                                    Case Law Preference
                                </h5>
                                <Form.Group className="form-group">
                                    <Form.Select
                                        name="includeCaseLaws"
                                        value={formData.includeCaseLaws}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="Yes">Yes - Include verified case laws</option>
                                        <option value="No">No - Focus on principles only</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        ⚠️ Note: Only highly verifiable legal authorities will be used. All citations must be independently verified.
                                    </Form.Text>
                                </Form.Group>
                            </div>

                            {/* Conditional Fields Based on Pleading Type */}
                            {formData.pleadingType === 'Petition' && (
                                <div className="form-section">
                                    <h5 className="section-title">
                                        <Badge bg="success" className="me-2">+</Badge>
                                        Petition-Specific Details
                                    </h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Type of Petition</Form.Label>
                                                <Form.Select
                                                    name="petitionType"
                                                    value={formData.petitionType}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Writ">Writ Petition</option>
                                                    <option value="Civil">Civil Petition</option>
                                                    <option value="Criminal">Criminal Petition</option>
                                                    <option value="Other">Other</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Cause of Action Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="causeOfActionDate"
                                                    value={formData.causeOfActionDate}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Cause of Action Place</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="causeOfActionPlace"
                                                    value={formData.causeOfActionPlace}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Interim Relief?</Form.Label>
                                                <Form.Select
                                                    name="interimRelief"
                                                    value={formData.interimRelief}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                >
                                                    <option value="No">No</option>
                                                    <option value="Yes">Yes</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Annexures?</Form.Label>
                                                <Form.Select
                                                    name="annexuresAvailable"
                                                    value={formData.annexuresAvailable}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                >
                                                    <option value="No">No</option>
                                                    <option value="Yes">Yes</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {formData.pleadingType === 'Appeal' && (
                                <div className="form-section">
                                    <h5 className="section-title">
                                        <Badge bg="success" className="me-2">+</Badge>
                                        Appeal-Specific Details
                                    </h5>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Impugned Judgment Court</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="impugnedJudgmentCourt"
                                                    value={formData.impugnedJudgmentCourt}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Case Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="impugnedJudgmentCaseNo"
                                                    value={formData.impugnedJudgmentCaseNo}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Judgment Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="impugnedJudgmentDate"
                                                    value={formData.impugnedJudgmentDate}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Grounds of Challenge</Form.Label>
                                                <div>
                                                    {['Error of Law', 'Error of Facts', 'Jurisdiction', 'Natural Justice', 'Other'].map(ground => (
                                                        <Form.Check
                                                            key={ground}
                                                            type="checkbox"
                                                            name="groundsOfChallenge"
                                                            value={ground}
                                                            label={ground}
                                                            onChange={handleInputChange}
                                                            checked={formData.groundsOfChallenge.includes(ground)}
                                                            className="mb-2"
                                                        />
                                                    ))}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="form-group">
                                                <Form.Label className="form-label">Limitation Status</Form.Label>
                                                <Form.Select
                                                    name="limitationStatus"
                                                    value={formData.limitationStatus}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                >
                                                    <option value="Within">Within Limitation</option>
                                                    <option value="Delay">Delay with Reason</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        {formData.limitationStatus === 'Delay' && (
                                            <Col md={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="form-label">Reason for Delay</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="delayReason"
                                                        value={formData.delayReason}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            )}

                            {formData.pleadingType === 'Written Submission' && (
                                <div className="form-section">
                                    <h5 className="section-title">
                                        <Badge bg="success" className="me-2">+</Badge>
                                        Written Submission Details
                                    </h5>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Stage of Case</Form.Label>
                                        <Form.Select
                                            name="caseStage"
                                            value={formData.caseStage}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Stage</option>
                                            <option value="Trial">Trial</option>
                                            <option value="Final Argument">Final Argument</option>
                                            <option value="Appeal Stage">Appeal Stage</option>
                                            <option value="Interim Hearing">Interim Hearing</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Key Arguments to Emphasize</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="keyArguments"
                                            value={formData.keyArguments}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Opponent's Main Arguments (Optional)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="opponentArguments"
                                            value={formData.opponentArguments}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </Form.Group>
                                </div>
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

export default EngineA;
