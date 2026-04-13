import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch, FaGavel } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';
import { BASE_LEGAL_PROMPT } from '../constants/legalConstants';

const CourtDrafting = () => {
    const [formData, setFormData] = useState({
        draftType: 'Petition',
        courtJurisdiction: 'Supreme Court',
        areaOfLaw: 'Constitutional',
        briefFacts: '',
        legalIssues: '',
        reliefsSought: '',
        existingOrders: '',
        includeCaseLaws: 'Yes'
    });

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse('');

        const prompt = `${BASE_LEGAL_PROMPT}

You are an AI Legal Drafting Assistant operating under strict court-compliance standards for Indian legal drafting (Petition, Appeal, Written Submission, Affidavit, or Legal Note).

CORE OPERATING PROTOCOL:
- Zero assumption policy
- Anti-hallucination legal mode
- Court-ready professional drafting standards
- Verification-first legal research approach

ABSOLUTE ETHICAL & LEGAL SAFEGUARDS (NON-NEGOTIABLE):
1. Never fabricate, invent, अनुमानित, or assume any case law, citation, judgment, bench, paragraph number, or statute reference.
2. Do NOT generate fake SCC, AIR, SCR, or any legal citations under any circumstances.
3. Only provide case laws if they are widely known and highly verifiable.
4. If citation certainty is below 100%, respond:
   "Citation requires independent verification from official legal databases."
5. If authentic precedents are unclear, provide principle-based legal reasoning instead of risky citations.
6. Maintain duty of candour expected in court drafting.
7. Accuracy > Persuasiveness > Length.
8. Do not generate fictional legal precedents under any circumstance.

CITATION DISCIPLINE:
- Prefer landmark Supreme Court of India judgments only.
- Avoid obscure, doubtful, or niche precedents.
- Do not provide paragraph numbers unless fully certain.
- Clearly label:
  (A) Verified Legal Authority
  (B) General Legal Principle (No citation)
  (C) Requires Manual Verification

PROHIBITED ACTIONS:
- Hallucinated judgments
- Fictional case names
- Guess-based legal citations
- Overconfident unverified legal references
- Filling gaps with assumed facts

DRAFTING RULES:
- Use formal court language
- Maintain structured legal format
- No fictional authorities
- Use doctrinal reasoning where citations are uncertain
- Clearly distinguish facts, grounds, and prayers
- Follow Indian court drafting conventions

OUTPUT STRUCTURE (COURT STANDARD):
1. Title & Jurisdiction Heading
2. Synopsis / Brief Facts
3. Questions of Law (if applicable)
4. Grounds / Legal Arguments
5. Verified Legal Principles (with safe citation protocol)
6. Prayer / Relief Clause
7. Verification Note (Mandatory)

MANDATORY FINAL DISCLAIMER (ALWAYS INCLUDE):
“This document is AI-assisted and prepared under strict anti-hallucination protocol. 
All case laws, citations, and legal authorities (if any) must be independently verified 
from official legal databases such as SCC Online, Manupatra, Indian Kanoon, or 
official court records before filing in any court of law.”

Please generate a professional court draft using the following provided case details:

1. Type of Draft Required: ${formData.draftType}
2. Court & Jurisdiction: ${formData.courtJurisdiction}
3. Area of Law: ${formData.areaOfLaw}
4. Brief Facts of the Case: 
${formData.briefFacts}
5. Legal Issues Involved: 
${formData.legalIssues}
6. Reliefs Sought: 
${formData.reliefsSought}
7. Existing Orders / Judgments: 
${formData.existingOrders || 'None'}
8. Preference for Case Laws: ${formData.includeCaseLaws}`;

        try {
            await APIService({
                question: prompt,
                onResponse: (data) => {
                    setLoading(false);
                    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
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

    const RedStrong = ({ children }) => {
        return <strong style={{ textDecoration: 'underline' }}>{children}</strong>;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="page-header d-flex align-items-center mb-4">
                        <FaGavel className="me-3" style={{ fontSize: '2rem', color: '#0d6efd' }} />
                        <div>
                            <h1 className="page-title mb-0">Court Drafting</h1>
                            <p className="page-description text-muted mb-0">
                                Professional Legal Drafting Assistant for Indian Jurisdiction
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="input-card">
                        <h2 className="card-title">Case Details</h2>
                        <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Type of Draft</Form.Label>
                                        <Form.Select
                                            name="draftType"
                                            value={formData.draftType}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="Petition">Petition</option>
                                            <option value="Appeal">Appeal</option>
                                            <option value="Written Submission">Written Submission</option>
                                            <option value="Affidavit">Affidavit</option>
                                            <option value="SLP">Special Leave Petition (SLP)</option>
                                            <option value="Reply">Reply / Counter Statement</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Court & Jurisdiction</Form.Label>
                                        <Form.Select
                                            name="courtJurisdiction"
                                            value={formData.courtJurisdiction}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="Supreme Court">Supreme Court of India</option>
                                            <option value="High Court">High Court</option>
                                            <option value="Tribunal">Tribunal (NCLT/NCLAT/ITAT, etc.)</option>
                                            <option value="District Court">District / Subordinate Court</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Area of Law</Form.Label>
                                        <Form.Select
                                            name="areaOfLaw"
                                            value={formData.areaOfLaw}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="Constitutional">Constitutional Law</option>
                                            <option value="Civil">Civil Law</option>
                                            <option value="Criminal">Criminal Law</option>
                                            <option value="Commercial">Commercial / Corporate Law</option>
                                            <option value="Tax">Taxation</option>
                                            <option value="Service">Service / Labour Law</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Preference for Case Laws</Form.Label>
                                        <Form.Select
                                            name="includeCaseLaws"
                                            value={formData.includeCaseLaws}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="Yes">Yes, include verified case laws</option>
                                            <option value="No">No, focus on statutory provisions</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="form-group">
                                <Form.Label className="form-label">Brief Facts of the Case</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="briefFacts"
                                    value={formData.briefFacts}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Provide factual background only — no assumptions..."
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="form-group">
                                <Form.Label className="form-label">Legal Issues Involved</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="legalIssues"
                                    value={formData.legalIssues}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Frame or confirm the legal issues..."
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="form-group">
                                <Form.Label className="form-label">Reliefs Sought</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="reliefsSought"
                                    value={formData.reliefsSought}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Exact prayers to be included in draft..."
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="form-group">
                                <Form.Label className="form-label">Existing Orders / Judgments (If any)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="existingOrders"
                                    value={formData.existingOrders}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Summarize any lower court orders or related prior judgments..."
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="features-button w-100 mt-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="spinner me-2" />
                                        Drafting Document...
                                    </>
                                ) : (
                                    <>
                                        <FaSearch className="me-2" />
                                        Generate Court Draft (Ctrl + Enter)
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {response && (
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Card className="output-card">
                            <div className="d-flex justify-content-end mb-3">
                                <Button
                                    variant="outline-primary"
                                    className="me-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(response);
                                        alert('Copied to clipboard!');
                                    }}
                                >
                                    <FaCopy className="me-1" />
                                    <span className="d-none d-sm-inline">Copy</span>
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="me-2"
                                    onClick={() => {
                                        const { generatePDF } = PDFGenerator({
                                            content: response,
                                            fileName: `court-draft-${new Date().toISOString().split('T')[0]}.pdf`,
                                            title: `Court Draft - ${formData.draftType}`
                                        });
                                        generatePDF();
                                    }}
                                >
                                    <FaFilePdf className="me-1" />
                                    <span className="d-none d-sm-inline">PDF</span>
                                </Button>
                                <Button
                                    variant="outline-success"
                                    onClick={() => {
                                        const { generateWord } = WordGenerator({
                                            content: response,
                                            fileName: `court-draft-${new Date().toISOString().split('T')[0]}.docx`,
                                            title: `Court Draft - ${formData.draftType}`
                                        });
                                        generateWord();
                                    }}
                                >
                                    <FaFileWord className="me-1" />
                                    <span className="d-none d-sm-inline">Word</span>
                                </Button>
                            </div>
                            <div className="markdown-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        strong: RedStrong,
                                    }}
                                >{response}</ReactMarkdown>
                            </div>
                            <AIDisclaimer variant="light" />
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default CourtDrafting;
