import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Template field structure
const getTemplateFields = () => {
  return {
    'Section 1: Company Details': [
      { label: 'Company Name', required: true, type: 'text' },
      { label: 'CIN (Corporate Identification Number)', required: true, type: 'text' },
      { label: 'Registered Office Address', required: true, type: 'textarea' },
      { label: 'Date of Incorporation', required: true, type: 'date' },
      { label: 'Industry Classification', required: true, type: 'text' },
      { label: 'Nature of Business', required: true, type: 'textarea' },
      { label: 'Shareholding Pattern (Pre-issue)', required: true, type: 'textarea', placeholder: 'e.g., Promoters: 60%, Public: 40%' }
    ],
    'Section 2: Financial Information': [
      { label: 'Audited Financial Statements (Last 3 years)', required: true, type: 'textarea' },
      { label: 'Latest Unaudited Financials', required: false, type: 'textarea' },
      { label: 'Assets and Liabilities Details', required: true, type: 'textarea' },
      { label: 'Profit and Loss Trends', required: true, type: 'textarea' },
      { label: 'Cash Flow Statements', required: true, type: 'textarea' },
      { label: 'Key Financial Ratios', required: true, type: 'textarea', placeholder: 'P/E ratio, ROE, ROA, Debt-to-Equity, etc.' }
    ],
    'Section 3: Share Capital Structure': [
      { label: 'Authorized Capital', required: true, type: 'text', placeholder: 'Rs. 10,00,00,000' },
      { label: 'Issued Capital', required: true, type: 'text', placeholder: 'Rs. 8,00,00,000' },
      { label: 'Subscribed Capital', required: true, type: 'text', placeholder: 'Rs. 7,50,00,000' },
      { label: 'Paid-up Capital', required: true, type: 'text', placeholder: 'Rs. 7,50,00,000' },
      { label: 'Existing Classes of Shares', required: true, type: 'textarea' },
      { label: 'Terms of Existing Instruments', required: false, type: 'textarea' }
    ],
    'Section 4: Proposed Preferential Issue': [
      { label: 'Number of Shares', required: true, type: 'text', placeholder: '1,00,000 equity shares' },
      { label: 'Share Class', required: true, type: 'text', placeholder: 'Equity shares / Preference shares' },
      { label: 'Face Value', required: true, type: 'text', placeholder: 'Rs. 10' },
      { label: 'Issue Price', required: true, type: 'text', placeholder: 'Rs. 100' },
      { label: 'Consideration Type', required: true, type: 'select', options: ['Cash', 'Non-Cash', 'Mixed'] },
      { label: 'Allottee Details', required: true, type: 'textarea', placeholder: 'Name, category, and relationship' },
      { label: 'Purpose/Objective of Issue', required: true, type: 'textarea' },
      { label: 'Board Resolution Details', required: true, type: 'textarea' }
    ],
    'Section 5: Valuation Inputs': [
      { label: 'Valuation Date', required: true, type: 'date' },
      { label: 'Valuation Methodology', required: true, type: 'select', options: ['DCF', 'NAV', 'Comparable Companies', 'Market Multiples', 'Book Value'] },
      { label: 'Valuation Assumptions', required: true, type: 'textarea' },
      { label: 'Discount Rate (%)', required: true, type: 'text', placeholder: '12%' },
      { label: 'Growth Rate (%)', required: true, type: 'text', placeholder: '8%' },
      { label: 'Multiples (if applicable)', required: false, type: 'textarea', placeholder: 'P/E: 15x, EV/EBITDA: 8x' },
      { label: 'Market Data & Benchmarks', required: true, type: 'textarea' }
    ],
    'Section 6: Regulatory Compliance': [
      { label: 'Rule 13 Compliance Checklist', required: true, type: 'textarea' },
      { label: 'Board Resolution Appointing Valuer', required: true, type: 'textarea' },
      { label: 'Valuer Declaration', required: true, type: 'textarea' },
      { label: 'SEBI/RBI Guidelines Compliance', required: false, type: 'textarea' }
    ]
  };
};

// PDF Template Generator
export const generatePDFTemplate = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Title Page
  doc.setFillColor(13, 110, 253);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('VALUATION REPORT', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Preferential Issue of Shares', pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Information Collection Template', pageWidth / 2, 45, { align: 'center' });
  doc.text('Companies Act, 2013 - Section 62(1)(c)', pageWidth / 2, 52, { align: 'center' });

  // Instructions Box
  yPosition = 75;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Instructions:', margin, yPosition);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPosition += 6;
  doc.text('1. Please fill in all fields marked with (*) as they are mandatory.', margin + 5, yPosition);
  yPosition += 5;
  doc.text('2. Provide detailed and accurate information for proper valuation.', margin + 5, yPosition);
  yPosition += 5;
  doc.text('3. Attach supporting documents where applicable.', margin + 5, yPosition);
  yPosition += 5;
  doc.text('4. Once completed, submit to your Company Secretary.', margin + 5, yPosition);
  
  yPosition += 15;

  const fields = getTemplateFields();
  let pageNumber = 1;

  // Helper function to add new page
  const addNewPage = () => {
    doc.addPage();
    yPosition = margin;
    pageNumber++;
    
    // Add page number at bottom
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  };

  // Generate form fields
  Object.entries(fields).forEach(([sectionTitle, sectionFields], sectionIndex) => {
    // Check if section header fits
    if (yPosition > pageHeight - 40) {
      addNewPage();
    }

    // Section Header
    doc.setFillColor(13, 110, 253);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(sectionTitle, margin + 3, yPosition + 5.5);
    doc.setTextColor(0, 0, 0);
    yPosition += 12;

    // Section Fields
    sectionFields.forEach((field, index) => {
      const fieldHeight = field.type === 'textarea' ? 25 : 15;
      
      // Check if field fits on current page
      if (yPosition + fieldHeight > pageHeight - 20) {
        addNewPage();
      }

      // Field Label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const labelText = field.label + (field.required ? ' *' : '');
      doc.text(labelText, margin, yPosition);
      yPosition += 5;

      // Input Box
      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, fieldHeight - 7, 'FD');
      
      // Placeholder text
      if (field.placeholder) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(field.placeholder, margin + 2, yPosition + 4);
        doc.setTextColor(0, 0, 0);
      }

      yPosition += fieldHeight - 2;
    });

    yPosition += 3;
  });

  // Add page numbers to first page
  doc.setPage(1);
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Page 1', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save PDF
  doc.save('Preferential_Issue_Valuation_Template.pdf');
};

// Word Template Generator
export const generateWordTemplate = async () => {
  const fields = getTemplateFields();
  
  const sections = [];

  // Title Section
  sections.push(
    new Paragraph({
      text: 'VALUATION REPORT',
      heading: 'Heading1',
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'Preferential Issue of Shares',
      heading: 'Heading2',
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: 'Information Collection Template',
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: 'Companies Act, 2013 - Section 62(1)(c)',
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      text: 'Instructions:',
      bold: true,
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: '1. Please fill in all fields marked with (*) as they are mandatory.',
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: '2. Provide detailed and accurate information for proper valuation.',
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: '3. Attach supporting documents where applicable.',
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: '4. Once completed, submit to your Company Secretary.',
      spacing: { after: 400 }
    })
  );

  // Generate form sections
  Object.entries(fields).forEach(([sectionTitle, sectionFields]) => {
    // Section Title
    sections.push(
      new Paragraph({
        text: sectionTitle,
        heading: 'Heading2',
        spacing: { before: 300, after: 200 },
        shading: { fill: '0D6EFD' },
        style: 'Heading2'
      })
    );

    // Section Fields as Table
    const tableRows = [];
    
    sectionFields.forEach((field) => {
      const labelText = field.label + (field.required ? ' *' : '');
      const placeholderText = field.placeholder || '';
      
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: labelText, bold: true, size: 22 })]
                })
              ],
              width: { size: 35, type: WidthType.PERCENTAGE },
              shading: { fill: 'F0F0F0' }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: placeholderText, 
                      size: 20,
                      italics: true,
                      color: '888888'
                    })
                  ]
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' })
              ],
              width: { size: 65, type: WidthType.PERCENTAGE }
            })
          ]
        })
      );
    });

    sections.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100
        }
      })
    );
  });

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections
    }],
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 48,
            bold: true,
            color: '0D6EFD'
          },
          paragraph: {
            spacing: { after: 200 }
          }
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 32,
            bold: true,
            color: 'FFFFFF'
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
            shading: { fill: '0D6EFD' }
          }
        }
      ]
    }
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Preferential_Issue_Valuation_Template.docx');
};
