import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaEdit, FaExclamationTriangle } from 'react-icons/fa';

const VerificationModal = ({ facts, onConfirm, onEdit, loading }) => {
    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="input-card">
                        <div className="text-center mb-4">
                            <FaExclamationTriangle 
                                style={{ fontSize: '3rem', color: '#ffc107', marginBottom: '1rem' }} 
                            />
                            <h3 style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
                                CRITICAL FACT VERIFICATION CHECKPOINT
                            </h3>
                            <p className="text-muted">
                                Please confirm all details are 100% accurate before proceeding
                            </p>
                        </div>

                        <Alert variant="warning" className="mb-4">
                            <Alert.Heading>⚠️ Mandatory Verification Required</Alert.Heading>
                            <p className="mb-0">
                                Before we proceed with drafting, please verify that all facts, names, dates, 
                                case details, and procedural history are <strong>100% accurate</strong> as per 
                                official court records.
                            </p>
                        </Alert>

                        <div className="verification-summary mb-4">
                            <h5 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                Summary of Information Provided:
                            </h5>
                            <Table bordered hover responsive>
                                <tbody>
                                    {Object.entries(facts).map(([key, value]) => (
                                        <tr key={key}>
                                            <td style={{ 
                                                width: '35%', 
                                                fontWeight: '600',
                                                color: 'var(--text-color)',
                                                backgroundColor: 'var(--accent-color)'
                                            }}>
                                                {key}
                                            </td>
                                            <td style={{ color: 'var(--text-color)' }}>
                                                {value || 'Not provided'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <Alert variant="info" className="mb-4">
                            <h6>📋 Verification Checklist:</h6>
                            <ul className="mb-0">
                                <li>All party names are spelled correctly (100% accuracy required)</li>
                                <li>All dates are accurate as per official records</li>
                                <li>Case numbers and court details are correct</li>
                                <li>Facts are presented as they occurred (no assumptions)</li>
                                <li>All procedural history is verified from court orders</li>
                            </ul>
                        </Alert>

                        <div className="text-center mb-3">
                            <h6 style={{ color: 'var(--primary-color)' }}>
                                Confirm that all information above is 100% accurate before proceeding
                            </h6>
                        </div>

                        <Row className="g-3">
                            <Col md={6}>
                                <Button
                                    variant="outline-secondary"
                                    className="w-100 py-3"
                                    onClick={onEdit}
                                    disabled={loading}
                                >
                                    <FaEdit className="me-2" />
                                    No, I Need to Edit
                                </Button>
                            </Col>
                            <Col md={6}>
                                <Button
                                    className="features-button w-100 py-3"
                                    onClick={onConfirm}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Generating Draft...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="me-2" />
                                            Yes, Proceed with Drafting
                                        </>
                                    )}
                                </Button>
                            </Col>
                        </Row>

                        <Alert variant="danger" className="mt-4 mb-0">
                            <small>
                                <strong>Disclaimer:</strong> By confirming, you certify that all information 
                                provided is accurate and verified. The AI will draft based strictly on this 
                                verified information. Any inaccuracies in the input will reflect in the output.
                            </small>
                        </Alert>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default VerificationModal;
