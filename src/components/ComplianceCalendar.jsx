import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';


const ComplianceCalendar = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'Private Limited Company',
    quarterlyOptions: [],
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

    // Calculate current financial year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const currentYear = currentDate.getFullYear();
    
    let financialYear;
    if (currentMonth >= 4) {
      // April or later: current year to next year
      financialYear = `FY ${currentYear}-${currentYear + 1}`;
    } else {
      // Before April: previous year to current year
      financialYear = `FY ${currentYear - 1}-${currentYear}`;
    }

    const prompt = `Context: Statutory Compliance Calendar Generation.
     Company: ${formData.companyName} (${formData.companyType}) 
     Financial Year: ${financialYear}
     Quarter: ${formData.quarterlyOptions.join(', ')} 
     
[Directives]
- Acts: Companies Act 2013. Include SEBI (LODR) ONLY if "Listed Public Limited".
- Scope: Detailed compliance items for selected quarters.
- Output: Strict structured format. No intro/outro/disclaimers.In dot point format.

[Schema per Item]
Quarter: [Q# Name]
  Month: [Month Name]
    [Act Name]
      1. [Date] - [Compliance Item]
         - Form: [Name]
         - Penalty: [Specific fine]
         - Remarks: [Note]

[Task]
Generate the calendar sequentially by Month then by Act. Group all items under their respective Acts. 
Use bullet points as defined in the schema. Convert directly to calendar layout.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
            // console.log(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate a compliance calendar. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the compliance calendar. Please try again later.");
      console.error("Error:", error);
    }
  };

  let date=new Date();
  let year=date.getFullYear();
  let nextYear=year+1;


  const quarterlyOptions = [
    { value: 'Q1 (April to June) -'+year, label: 'Q1 (April to June) -'+year },
    { value: 'Q2 (July to September) -'+year, label: 'Q2 (July to September) -'+year },
    { value: 'Q3 (October to December) -'+year, label: 'Q3 (October to December) -'+year },
    { value: 'Q4 (January to March) -'+nextYear, label: 'Q4 (January to March) -'+nextYear },
  ];

  const handleQuarterlyCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        quarterlyOptions: [...formData.quarterlyOptions, value],
      });
    } else {
      setFormData({
        ...formData,
        quarterlyOptions: formData.quarterlyOptions.filter(item => item !== value)
      });
    }
  };

  const RedStrong = ({ children }) => {
    // Apply Tailwind CSS class 'text-red-500' to make the text red
    return <strong style={{ textDecoration: 'underline' }}>{children}</strong>;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Compliance Calendar Generator</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Type</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Unlisted public Limited">Unlisted public Limited</option>
                  <option value="listed public Limited">listed public Limited</option>
                </Form.Select>
              </Form.Group>

              {/* Quarterly compliance calendar selection */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Select Quarters </Form.Label>
                {/* red Label having text : select at most two quarters, color red and apply that logic to selection */}
                <Form.Label className="text-muted" style={{ color: 'red' }}>
                  (Due to limitation of AI tokenization, select any two quarters only at a time)  
                </Form.Label>

                <div>
                  {quarterlyOptions.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      id={`quarterly-compliance-calendar-${option.value}`}
                      label={option.label}
                      value={option.value}
                      checked={formData.quarterlyOptions.includes(option.value)}
                      onChange={handleQuarterlyCheckboxChange}
                      className="form-check"
                      disabled={formData.quarterlyOptions.length >= 2 && !formData.quarterlyOptions.includes(option.value)}
                    />
                  ))}
                </div>
              
              </Form.Group>




              <button type="submit" className="features-button" disabled={loading || formData.quarterlyOptions.length === 0}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Compliance Calendar...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Compliance Calendar
                  </>
                )}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: '6px' }}> {formData.companyName} -</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Compliance Calendar</h2>
            <Card className="output-card">
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    alert('Copied to clipboard!');
                  }}
                >
                  <FaCopy className="me-1" />
                  <span className="d-none d-sm-inline">Copy to Clipboard</span>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `${formData.companyName}-compliance-calendar.pdf`,
                      title: `Compliance Calendar`
                    });
                    generatePDF();
                  }}
                  className="me-2"
                >
                  <FaFilePdf className="me-1" />
                  <span className="d-none d-sm-inline">Download PDF</span>
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `${formData.companyName}-compliance-calendar.docx`,
                      title: `Compliance Calendar`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Override the default 'strong' component with our custom 'RedStrong' component
                    strong: RedStrong,
                    // Custom table components for better styling
                  //   table: ({ children }) => (
                  //     <Table striped bordered hover responsive className="mt-3 mb-3">
                  //       {children}
                  //     </Table>
                  //   ),
                  //   thead: ({ children }) => (
                  //     <thead className="table-dark">
                  //       {children}
                  //     </thead>
                  //   ),
                  //   tbody: ({ children }) => (
                  //     <tbody>
                  //       {children}
                  //     </tbody>
                  //   ),
                  //   tr: ({ children }) => (
                  //     <tr>
                  //       {children}
                  //     </tr>
                  //   ),
                  //   th: ({ children }) => (
                  //     <th className="text-center">
                  //       {children}
                  //     </th>
                  //   ),
                  //   td: ({ children }) => (
                  //     <td>
                  //       {children}
                  //     </td>
                  //   ),
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

export default ComplianceCalendar;
