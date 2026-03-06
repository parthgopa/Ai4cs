# Court Drafting System - Two-Engine Architecture

## Overview
Professional AI-powered legal drafting system for Indian jurisdiction with specialized engines for different document types.

## Architecture

### Main Components

```
CourtDrafting/
├── index.jsx                  # Main component - Engine selection
├── EngineA.jsx               # Litigation Documents (Petition/Appeal/Written Submission)
├── EngineB.jsx               # Declaration & Advisory (Affidavit/Legal Note)
├── VerificationModal.jsx     # Fact verification checkpoint
├── OutputDisplay.jsx         # Document output with export options
└── README.md                 # This file
```

## Engine A: Litigation Documents

### Supported Documents
1. **Petition** (Writ/Civil/Criminal)
2. **Appeal** (All types)
3. **Written Submission**

### Features
- **Step-by-step form** with 9 mandatory steps
- **Conditional fields** based on document type
- **Fact verification checkpoint** before drafting
- **Anti-hallucination protocols** for case laws
- **Court-ready formatting** (Indian standards)

### Input Fields

#### Universal Fields (All Documents)
1. Type of Court Pleading
2. Court & Jurisdiction
3. Party Details (Petitioner/Appellant & Respondent)
4. Area of Law
5. Factual Background (Chronological)
6. Existing Orders/Judgments
7. Legal Issues (Frame or Provide)
8. Reliefs/Prayers Sought
9. Case Law Preference

#### Petition-Specific Fields
- Type of Petition (Writ/Civil/Criminal/Other)
- Cause of Action (Date & Place)
- Interim Relief Required (Yes/No)
- Annexures Available (Yes/No)

#### Appeal-Specific Fields
- Impugned Judgment Details (Court, Case No., Date)
- Grounds of Challenge (Error of Law/Facts/Jurisdiction/Natural Justice)
- Limitation Status (Within/Delay with Reason)

#### Written Submission-Specific Fields
- Stage of Case (Trial/Final Argument/Appeal/Interim)
- Key Arguments to Emphasize
- Opponent's Main Arguments

## Engine B: Declaration & Advisory Documents

### Supported Documents
1. **Affidavit** (Sworn Declaration)
2. **Legal Note** (Advisory/Analytical)

### Affidavit Fields
1. Document Type Selection
2. Deponent Personal Details
   - Full Name (exact as record)
   - Age
   - Occupation
   - Residential Address
3. Capacity & Purpose
   - Capacity (Petitioner/Respondent/Witness/Applicant/Other)
   - Purpose of Affidavit
4. Related Case Details (if applicable)
   - Case Title
   - Case Number
   - Court
5. Sworn Facts (numbered, factual only)
6. Place & Date of Swearing

### Legal Note Fields
1. Document Type Selection
2. Legal Issue/Topic
3. Purpose & Context
   - Purpose (Opinion/Advisory/Analysis/Risk Assessment)
   - Jurisdiction
4. Factual Scenario
5. Analysis Depth (Basic/Detailed/Court-Preparatory)

## Verification Checkpoint

### Purpose
Mandatory fact verification before AI drafting to ensure:
- 100% accuracy of party names
- Correct dates and case numbers
- Verified factual background
- No assumptions or fabricated details

### Features
- **Fact summary table** for review
- **Verification checklist** display
- **Edit or Confirm** options
- **Legal disclaimer** acknowledgment

## Output Display

### Features
- **Clean formatted output** using ReactMarkdown
- **Export options**: Copy, PDF, Word
- **AI disclaimer** automatically included
- **Legal verification warning**
- **Navigation**: Edit details or create new draft

## User Flow

### Engine A Flow
1. Select "Engine A: Litigation Documents"
2. Fill 9-step form with all required details
3. Add document-specific fields (Petition/Appeal/Submission)
4. Click "Proceed to Verification"
5. Review fact summary
6. Confirm accuracy → AI generates draft
7. Review, export, or edit

### Engine B Flow
1. Select "Engine B: Declaration & Advisory"
2. Choose document type (Affidavit/Legal Note)
3. Fill type-specific form
4. Click "Proceed to Verification"
5. Review fact summary
6. Confirm accuracy → AI generates draft
7. Review, export, or edit

## Technical Implementation

### State Management
```javascript
// Engine A
const [step, setStep] = useState('form'); // 'form' | 'verify' | 'output'
const [formData, setFormData] = useState({...});
const [loading, setLoading] = useState(false);
const [response, setResponse] = useState('');
```

### API Integration
Uses `APIService` from `Common/API` with Gemini 2.5 Flash model.

### Prompt Engineering
Each engine has specialized prompts with:
- Role definition
- Core rules (anti-hallucination)
- Verified input data
- Output structure requirements
- Mandatory disclaimers

## Legal Safeguards

### Anti-Hallucination Protocol
1. ✅ Never fabricate case laws or citations
2. ✅ Never assume missing information
3. ✅ Only use verified Supreme Court principles
4. ✅ Mark uncertain citations for verification
5. ✅ Maintain duty of candour
6. ✅ No fictional legal precedents

### Mandatory Disclaimers
All outputs include:
- AI-assistance acknowledgment
- Verification requirement notice
- Legal database references (SCC Online, Manupatra, Indian Kanoon)
- Pre-filing verification warning

## Responsive Design

### Breakpoints
- **Desktop (>768px)**: Full layout with all features
- **Tablet (576-768px)**: 2-column grid for form fields
- **Mobile (<576px)**: Single column, condensed UI

### Mobile Optimizations
- Stacked form fields
- Responsive buttons
- Touch-friendly inputs
- Condensed verification table
- Action buttons with icons only

## Styling

### CSS Variables Used
```css
--primary-color
--secondary-color
--text-color
--card-bg
--border-color
--accent-color
--shadow-sm
--shadow-md
```

### Theme Support
- ✅ Light theme (default)
- ✅ Dark theme compatible
- ✅ Automatic theme switching

## Dependencies

### Required Components
- `PDFGenerator` - PDF export functionality
- `WordGenerator` - Word export functionality
- `AIDisclaimer` - Standard AI disclaimer component
- `APIService` - Backend API communication

### Required Libraries
```json
{
  "react": "^18.x",
  "react-bootstrap": "^2.x",
  "react-icons": "^4.x",
  "react-markdown": "^8.x",
  "remark-gfm": "^3.x"
}
```

## Usage Example

### In Router/App
```javascript
import CourtDrafting from './components/CourtDrafting';

// Route configuration
<Route path="/court-drafting" element={<CourtDrafting />} />
```

### Navigation
```javascript
// From HomePage or Nav
<Link to="/court-drafting">Court Drafting</Link>
```

## Best Practices

### For Developers
1. ✅ Always validate form inputs before submission
2. ✅ Maintain verification checkpoint integrity
3. ✅ Keep prompts updated with legal requirements
4. ✅ Test responsive layouts on all devices
5. ✅ Ensure export functions work correctly

### For Users
1. ✅ Provide accurate information only
2. ✅ Verify all facts before confirmation
3. ✅ Review generated drafts carefully
4. ✅ Verify case laws independently
5. ✅ Consult legal professionals before filing

## Future Enhancements

### Planned Features
- [ ] Save draft functionality
- [ ] Template library
- [ ] Collaborative editing
- [ ] Case law database integration
- [ ] Multi-language support
- [ ] Voice input for facts
- [ ] OCR for document scanning

### Potential Improvements
- [ ] Auto-save form data
- [ ] Draft history tracking
- [ ] Email draft functionality
- [ ] Custom template upload
- [ ] AI suggestions during form filling

## Support & Maintenance

### Known Issues
- None currently reported

### Testing Checklist
- [x] Engine selection works
- [x] Form validation functions
- [x] Conditional fields display correctly
- [x] Verification modal shows all facts
- [x] API integration successful
- [x] PDF export works
- [x] Word export works
- [x] Copy to clipboard works
- [x] Responsive on mobile
- [x] Dark theme compatible

## License & Disclaimer

This is an AI-assisted legal drafting tool. All outputs require independent verification by qualified legal professionals before use in any official capacity.

**Not a substitute for legal advice.**
