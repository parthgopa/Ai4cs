import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaGavel, FaFileAlt, FaFileSignature } from 'react-icons/fa';
import EngineA from './EngineA';
import EngineB from './EngineB';
import '../styles/CourtDrafting.css';

const CourtDrafting = () => {
    const [selectedEngine, setSelectedEngine] = useState(null);

    const handleBack = () => {
        setSelectedEngine(null);
    };

    if (selectedEngine === 'A') {
        return <EngineA onBack={handleBack} />;
    }

    if (selectedEngine === 'B') {
        return <EngineB onBack={handleBack} />;
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="page-header text-center mb-5">
                        <FaGavel style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }} />
                        <h1 className="page-title mb-2">Court Drafting System</h1>
                        <p className="page-description text-muted">
                            Professional Legal Drafting Assistant for Indian Jurisdiction
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={10}>
                    <h3 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>
                        Select Drafting Engine
                    </h3>
                    <Row className="g-4">
                        {/* Engine A - Litigation Documents */}
                        <Col md={6}>
                            <Card 
                                className="engine-card h-100"
                                onClick={() => setSelectedEngine('A')}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Body className="text-center p-4">
                                    <div className="engine-icon mb-3">
                                        <FaFileAlt style={{ fontSize: '3.5rem', color: 'var(--primary-color)' }} />
                                    </div>
                                    <h3 style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
                                        Engine A
                                    </h3>
                                    <h5 className="mb-3" style={{ color: 'var(--text-color)' }}>
                                        Litigation Documents
                                    </h5>
                                    <p className="text-muted mb-3">
                                        For court pleadings and legal submissions
                                    </p>
                                    <div className="text-start">
                                        <strong style={{ color: 'var(--primary-color)' }}>Includes:</strong>
                                        <ul className="mt-2" style={{ color: 'var(--text-color)' }}>
                                            <li>Petition (Writ/Civil/Criminal)</li>
                                            <li>Appeal (All Types)</li>
                                            <li>Written Submission</li>
                                        </ul>
                                    </div>
                                    <Button 
                                        className="features-button w-100 mt-3"
                                        onClick={() => setSelectedEngine('A')}
                                    >
                                        Select Engine A
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Engine B - Affidavit & Legal Note */}
                        <Col md={6}>
                            <Card 
                                className="engine-card h-100"
                                onClick={() => setSelectedEngine('B')}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Body className="text-center p-4">
                                    <div className="engine-icon mb-3">
                                        <FaFileSignature style={{ fontSize: '3.5rem', color: 'var(--secondary-color)' }} />
                                    </div>
                                    <h3 style={{ color: 'var(--secondary-color)', fontWeight: '700' }}>
                                        Engine B
                                    </h3>
                                    <h5 className="mb-3" style={{ color: 'var(--text-color)' }}>
                                        Declaration & Advisory
                                    </h5>
                                    <p className="text-muted mb-3">
                                        For sworn statements and legal opinions
                                    </p>
                                    <div className="text-start">
                                        <strong style={{ color: 'var(--secondary-color)' }}>Includes:</strong>
                                        <ul className="mt-2" style={{ color: 'var(--text-color)' }}>
                                            <li>Affidavit (Sworn Declaration)</li>
                                            <li>Legal Note (Advisory/Analysis)</li>
                                        </ul>
                                    </div>
                                    <Button 
                                        className="features-button w-100 mt-3"
                                        onClick={() => setSelectedEngine('B')}
                                    >
                                        Select Engine B
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default CourtDrafting;
