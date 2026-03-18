import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowLeft, FaCopy, FaFilePdf, FaFileWord, FaSpinner, FaPlusCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PDFGenerator from '../PDFGenerator';
import WordGenerator from '../WordGenerator';
import AIDisclaimer from '../AIDisclaimer';

const OutputDisplay = ({ response, loading, documentType, onBack, onNewDraft }) => {
    const RedStrong = ({ children }) => {
        return <strong style={{ textDecoration: 'underline' }}>{children}</strong>;
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(response);
        alert('Document copied to clipboard!');
    };

    const handleGeneratePDF = () => {
        const { generatePDF } = PDFGenerator({
            content: response,
            fileName: `${documentType.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
            title: `${documentType} - Court Draft`
        });
        generatePDF();
    };

    const handleGenerateWord = () => {
        const { generateWord } = WordGenerator({
            content: response,
            fileName: `${documentType.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.docx`,
            title: `${documentType} - Court Draft`
        });
        generateWord();
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <Button 
                                variant="outline-secondary" 
                                onClick={onBack}
                                className="me-3"
                            >
                                <FaArrowLeft /> Edit Details
                            </Button>
                            <div>
                                <h3 className="mb-0" style={{ color: 'var(--primary-color)' }}>
                                    Generated {documentType}
                                </h3>
                                <p className="text-muted mb-0">
                                    AI-assisted court draft ready for review
                                </p>
                            </div>
                        </div>
                        {onNewDraft && (
                            <Button 
                                variant="outline-primary"
                                onClick={onNewDraft}
                            >
                                <FaPlusCircle className="me-2" />
                                New Draft
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {loading ? (
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Card className="output-card text-center py-5">
                            <FaSpinner className="spinner mb-3" style={{ fontSize: '3rem' }} />
                            <h4>Generating Your Court Draft...</h4>
                            <p className="text-muted">
                                Applying strict verification protocols and legal formatting standards
                            </p>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Card className="output-card">
                            {/* Action Buttons */}
                            <div className="d-flex justify-content-end mb-3 flex-wrap gap-2">
                                <Button
                                    variant="outline-primary"
                                    onClick={handleCopyToClipboard}
                                >
                                    <FaCopy className="me-1" />
                                    <span className="d-none d-sm-inline">Copy</span>
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={handleGeneratePDF}
                                >
                                    <FaFilePdf className="me-1" />
                                    <span className="d-none d-sm-inline">PDF</span>
                                </Button>
                                <Button
                                    variant="outline-success"
                                    onClick={handleGenerateWord}
                                >
                                    <FaFileWord className="me-1" />
                                    <span className="d-none d-sm-inline">Word</span>
                                </Button>
                            </div>

                            {/* Document Content */}
                            <div className="markdown-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        strong: RedStrong,
                                    }}
                                >
                                    {response}
                                </ReactMarkdown>
                            </div>

                            {/* AI Disclaimer */}
                            <AIDisclaimer variant="light" />

                            {/* Additional Legal Disclaimer */}
                            <Card className="mt-3" style={{ backgroundColor: '#fff3cd', borderColor: '#ffc107' }}>
                                <Card.Body>
                                    <h6 style={{ color: '#856404' }}>
                                        ⚠️ MANDATORY VERIFICATION REQUIRED
                                    </h6>
                                    <p className="mb-0" style={{ color: '#856404', fontSize: '0.9rem' }}>
                                        This document is AI-assisted and prepared under strict anti-hallucination protocol.
                                        <strong> All facts, case details, citations, and legal authorities (if any) must be 
                                        independently verified from official legal databases such as SCC Online, Manupatra, 
                                        Indian Kanoon, or official court records before filing in any court of law.</strong>
                                    </p>
                                </Card.Body>
                            </Card>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default OutputDisplay;
