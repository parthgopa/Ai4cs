import React, { useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaFileInvoice, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ComingSoonModal from './ComingSoonModal';
import '../styles/CardStyles.css';

const ValuationReport = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  const reports = [
    { id: 1, name: 'Preferential Issue of Shares / Securities', section: 'Companies Act, 2013 – Sec 62(1)(c)', route: '/valuation-report/preferential-issue', status: 'available' },
    { id: 2, name: 'Issue of Sweat Equity Shares', section: 'Sec 54 of Companies Act, 2013', status: 'coming-soon' },
    { id: 3, name: 'Non-Cash Consideration', section: 'Sec 192(2) of Companies Act', status: 'coming-soon' },
    { id: 4, name: 'Mergers, Amalgamations, Demergers', section: 'Secs 230–232 of Companies Act', status: 'coming-soon' },
    { id: 5, name: 'Acquisition of Minority Shareholding', section: 'Sec 236 of Companies Act', status: 'coming-soon' },
    { id: 6, name: 'Winding Up / Liquidation', section: 'Sec 281 of Companies Act, IBC', status: 'coming-soon' },
    { id: 7, name: 'General Valuation of Securities', section: 'Sec 247 of Companies Act, 2013', status: 'coming-soon' },
    { id: 8, name: 'Conversion of Loan / Debentures', section: 'Sec 62(3) of Companies Act', status: 'coming-soon' },
    { id: 9, name: 'Compromise, Arrangement or Settlement', section: 'Sec 230 of Companies Act', status: 'coming-soon' },
    { id: 10, name: 'FEMA & SEBI Regulations', section: 'FEMA & SEBI Regulations', status: 'coming-soon' },
    { id: 11, name: 'Reduction of Share Capital', section: 'Sec 66 of Companies Act', status: 'coming-soon' }
  ];

  const handleReportClick = (report) => {
    if (report.status === 'available') {
      navigate(report.route);
    } else {
      setSelectedFeature(report.name);
      setShowModal(true);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Valuation Report Generator</h2>
            <div className="text-center mb-4">
              <p className="lead text-muted">
                Select a valuation report type below to generate professional and legally compliant valuation reports.
              </p>
            </div>

            <Row>
              {reports.map((report) => (
                <Col md={6} lg={4} key={report.id} className="mb-4">
                  <Card 
                    className={`h-100 policy-card-custom ${report.status === 'coming-soon' ? 'opacity-75' : ''}`}
                    onClick={() => handleReportClick(report)}
                  >
                    {report.status === 'available' && <div className="card-corner-decoration" />}
                    <Card.Body className="d-flex flex-column card-body-custom">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className={`policy-icon-box ${report.status === 'coming-soon' ? 'bg-secondary' : ''}`}>
                          <FaFileInvoice 
                            size={24} 
                            className="text-white"
                          />
                        </div>
                        {report.status === 'coming-soon' && (
                          <span className="badge-coming-soon">
                            Coming Soon
                          </span>
                        )}
                        {report.status === 'available' && (
                          <span className="badge-available">
                            ✓ Available
                          </span>
                        )}
                      </div>
                      <h6 className="policy-card-title" style={{ 
                        color: report.status === 'coming-soon' ? 'var(--muted-color)' : 'var(--text-color)'
                      }}>
                        {report.name}
                      </h6>
                      <small className="report-section-text">
                        {report.section}
                      </small>
                      <div className="policy-card-footer">
                        <small className="policy-action-text" style={{
                          color: report.status === 'coming-soon' ? 'var(--muted-color)' : 'var(--primary-color)'
                        }}>
                          {report.status === 'available' ? 'Click to generate →' : 'Under development'}
                        </small>
                        <FaChevronRight 
                          className={report.status === 'available' ? 'policy-chevron' : 'text-muted'} 
                        />
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
                    📊 Valuation Report Features
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="feature-list-item">
                      <span className="feature-bullet"></span>
                      <strong>Comprehensive:</strong> Covers all sections required under Companies Act 2013
                    </li>
                    <li className="feature-list-item">
                      <span className="feature-bullet"></span>
                      <strong>Regulatory Compliant:</strong> Follows Rule 13 and other applicable regulations
                    </li>
                    <li className="feature-list-item">
                      <span className="feature-bullet"></span>
                      <strong>Professional Format:</strong> Structured format with 10 sections
                    </li>
                    <li className="feature-list-item mb-0">
                      <span className="feature-bullet"></span>
                      <strong>Export Options:</strong> Download as PDF or Word document
                    </li>
                  </ul>
                </Col>
                <Col md={4} className="text-center d-none d-md-block">
                  <div className="features-icon-container">
                    <FaFileInvoice className="features-icon" size={50} />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <ComingSoonModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        featureTitle={selectedFeature} 
      />
    </Container>
  );
};

export default ValuationReport;
