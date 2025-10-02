import { FaCalendarAlt, FaBalanceScale, FaGavel, FaChartLine, FaClipboardList, FaBook, FaFileAlt, FaSearch, FaEnvelope, FaFileInvoice } from 'react-icons/fa';
import { MdUpdate, MdAssessment, MdOutlineAppRegistration } from 'react-icons/md';

export const toolsData = [
  {
    id: 'compliance-calendar',
    title: 'Compliance Calendar',
    category: 'Compliance',
    icon: FaCalendarAlt,
    route: '/compliance-calendar'
  },
  {
    id: 'regulatory-updation',
    title: 'Regulatory Compass',
    category: 'Compliance',
    icon: MdUpdate,
    route: '/regulatory-compass'
  },
  {
    id: 'procedure-practice',
    title: 'Procedure and Practice',
    category: 'Compliance',
    icon: FaClipboardList,
    route: '/procedure-practice'
  },
  {
    id: 'forms',
    title: 'Forms',
    category: 'Compliance',
    icon: FaFileAlt,
    route: '/forms'
  },
  {
    id: 'secretarial-audit-toolkit',
    title: 'Secretarial Audit Toolkit',
    category: 'Audit',
    icon: FaBalanceScale,
    route: '/secretarial-audit-toolkit'
  },
  {
    id: 'statutory-registers',
    title: 'Statutory Register and Records',
    category: 'Records',
    icon: FaBook,
    route: '/statutory-registers'
  },
  {
    id: 'legal-opinion',
    title: 'Legal Opinion',
    category: 'Legal',
    icon: FaGavel,
    route: '/legal-opinion'
  },
  {
    id: 'legal-research',
    title: 'Legal Research',
    category: 'Legal',
    icon: FaBalanceScale,
    route: '/legal-research'
  },
  {
    id: 'research-assistant',
    title: 'Research Assistant',
    category: 'Legal',
    icon: FaSearch,
    route: '/research-assistant'
  },
  {
    id: 'scenario-solver',
    title: 'Scenario Solver',
    category: 'Legal',
    icon: FaChartLine,
    route: '/scenario-solver'
  },
  {
    id: 'case-digest',
    title: 'Case Digest',
    category: 'Legal',
    icon: FaGavel,
    route: '/case-digest'
  },
  {
    id: 'judgment-simulator',
    title: 'Judgment Simulator',
    category: 'Legal',
    icon: FaGavel,
    route: '/judgment-simulator'
  },
  {
    id: 'policy-drafting',
    title: 'Policy Drafting',
    category: 'Policy',
    icon: FaClipboardList,
    route: '/policy-drafting',
    subFeatures: [
      { id: 'meeting-policy', title: 'Meeting and Minutes Policy', route: '/policy-drafting/meeting-and-minutes-policy' },
      { id: 'statutory-registers-policy', title: 'Statutory Registers Policy', route: '/policy-drafting/statutory-registers-policy' },
      { id: 'rpt-policy', title: 'Related Party Transactions Policy', route: '/policy-drafting/related-party-transaction-policy' },
      { id: 'insider-trading-policy', title: 'Insider Trading Policy', route: '/policy-drafting/insider-trading-policy' },
      { id: 'document-management-policy', title: 'Document Management Policy', route: '/policy-drafting/document-management-policy' },
      { id: 'csr-policy', title: 'CSR Policy', route: '/policy-drafting/csr-policy' }
    ]
  },
  {
    id: 'agreement-drafting',
    title: 'Agreement Drafting',
    category: 'Agreement',
    icon: MdAssessment,
    route: '/agreement-drafting'
  },
  {
    id: 'capital-raising-advisory-agreement',
    title: 'Capital Raising Advisory Agreement',
    category: 'Agreement',
    icon: MdAssessment,
    route: '/capital-raising-advisory-agreement'
  },
  {
    id: 'reply-to-notice-rd',
    title: 'Reply to Notice - RD',
    category: 'Notices',
    icon: MdOutlineAppRegistration,
    route: '/reply-to-notice-rd'
  },
  {
    id: 'reply-to-notice-nclt',
    title: 'Reply to Notice - NCLT',
    category: 'Notices',
    icon: MdOutlineAppRegistration,
    route: '/reply-to-notice-nclt'
  },
  {
    id: 'reply-to-notice-roc',
    title: 'Reply to Notice - ROC',
    category: 'Notices',
    icon: MdOutlineAppRegistration,
    route: '/reply-to-notice-roc'
  },
  {
    id: 'petetion-preparator',
    title: 'Petition Preparator',
    category: 'Petition',
    icon: MdOutlineAppRegistration,
    route: '/petition-preparator'
  },
  {
    id: 'board-meeting-assistant',
    title: 'Board Meeting Assistant',
    category: 'Meetings',
    icon: FaClipboardList,
    route: '/board-meeting-assistant'
  },
  {
    id: 'general-meeting-assistant',
    title: 'General Meeting Assistant',
    category: 'Meetings',
    icon: FaCalendarAlt,
    route: '/general-meeting-assistant'
  },
  {
    id: 'email-drafter',
    title: 'Email Drafter',
    category: 'Utility',
    icon: FaEnvelope,
    route: '/email-drafter'
  },
  {
    id: 'resolution-assistant',
    title: 'Resolution Assistant',
    category: 'Utility',
    icon: FaGavel,
    route: '/resolution-assistant'
  },
  {
    id: 'mini-law-library',
    title: 'Mini-Law Library',
    category: 'Utility',
    icon: FaBook,
    route: '/mini-law-library'
  },
  {
    id: 'valuation-report',
    title: 'Valuation Report',
    category: 'Reports',
    icon: FaFileInvoice,
    route: '/valuation-report',
    subFeatures: [
      { id: 'preferential-issue', title: 'Preferential Issue of Shares', route: '/valuation-report/preferential-issue' }
    ]
  },
];

export const enabledToolIds = new Set([
  'compliance-calendar',
  'secretarial-audit-toolkit',
  'regulatory-updation',
  'statutory-registers',
  'legal-opinion',
  'legal-research',
  'procedure-practice',
  'policy-drafting',
  'scenario-solver',
  'agreement-drafting',
  'reply-to-notice-rd',
  'reply-to-notice-nclt',
  'reply-to-notice-roc',
  'board-meeting-assistant',
  'general-meeting-assistant',
  'petetion-preparator',
  'forms',
  'capital-raising-advisory-agreement',
  'mini-law-library',
  'case-digest',
  'judgment-simulator',
  'research-assistant',
  'resolution-assistant',
  'email-drafter',
  'valuation-report'
]);

export const getToolsByCategory = () => {
  const categories = {};
  toolsData.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  return categories;
};
