import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaClipboardList, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/CardStyles.css';

const PolicyDrafting = () => {
  const navigate = useNavigate();

  // Policy options with routes
  const policyOptions = [
    { id: 'meeting', title: 'Meeting and Minutes policy', route: '/policy-drafting/meeting-and-minutes-policy', status: 'available' },
    { id: 'statutory-registers-policy', title: 'Statutory Registers Policy', route: '/policy-drafting/statutory-registers-policy', status: 'available' },
    { id: 'related-party-transaction-policy', title: 'Related Party Transactions Policy', route: '/policy-drafting/related-party-transaction-policy', status: 'available' },
    { id: 'insider-trading-policy', title: 'Insider Trading Policy', route: '/policy-drafting/insider-trading-policy', status: 'available' },
    { id: 'document-management-policy', title: 'Document Management Policy', route: '/policy-drafting/document-management-policy', status: 'available' },
    { id: 'csr-policy', title: 'CSR Policy', route: '/policy-drafting/csr-policy', status: 'available' },
  ];

  const handlePolicyClick = (policy) => {
    if (policy.status === 'available') {
      navigate(policy.route);
    } else {
      alert(`${policy.title} is coming soon!`);
    }
  };



  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Policy Drafting</h2>
              <div className="text-center mb-4">
                <p className="lead text-muted">
                  Select a policy type below to start drafting professional and legally compliant policies.
                </p>
              </div>

              <Row>
                {policyOptions.map((policy) => (
                  <Col md={6} lg={4} key={policy.id} className="mb-4">
                    <Card 
                      className="h-100 policy-card-custom"
                      onClick={() => handlePolicyClick(policy)}
                    >
                      <div className="card-corner-decoration" />
                      <Card.Body className="d-flex flex-column card-body-custom">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="policy-icon-box">
                            <FaClipboardList 
                              size={24} 
                              className="text-white"
                            />
                          </div>
                        </div>
                        <h6 className="policy-card-title">
                          {policy.title}
                        </h6>
                        <div className="policy-card-footer">
                          <small className="policy-action-text">
                            Click to start drafting →
                          </small>
                          <FaChevronRight className="policy-chevron" />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="features-info-panel">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h6 className="features-panel-title">
                      📋 Policy Drafting Features
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="feature-list-item">
                        <span className="feature-bullet"></span>
                        <strong>AI-Powered:</strong> Generate legally compliant policies using advanced AI
                      </li>
                      <li className="feature-list-item">
                        <span className="feature-bullet"></span>
                        <strong>Customizable:</strong> Input company-specific details for personalized policies
                      </li>
                      <li className="feature-list-item">
                        <span className="feature-bullet"></span>
                        <strong>Export Options:</strong> Download as PDF or Word document
                      </li>
                      <li className="feature-list-item mb-0">
                        <span className="feature-bullet"></span>
                        <strong>Compliance Ready:</strong> Ensures adherence to latest regulations
                      </li>
                    </ul>
                  </Col>
                  <Col md={4} className="text-center d-none d-md-block">
                    <div className="features-icon-container">
                      <FaClipboardList className="features-icon" size={50} />
                    </div>
                  </Col>
                </Row>
              </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PolicyDrafting;
