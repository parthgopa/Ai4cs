import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBlog, FaGraduationCap, FaBriefcase, FaListOl, FaCode, FaLightbulb, FaBullhorn, FaBox, FaSpinner } from "react-icons/fa";
import APIService from "../../../Common/API";
import EducationalBlog from "./EducationalBlog";
import BusinessBlog from "./BusinessBlog";
import TechBlog from "./TechBlog";
import OpinionBlog from "./OpinionBlog";
import MarketingBlog from "./MarketingBlog";
import ProductBlog from "./ProductBlog";
import ResponseDisplay from "../ResponseDisplay";
import "./BlogTool.css";

const BlogTool = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("Educational");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentFormData, setCurrentFormData] = useState(null);

  const modes = [
    { key: "Educational", label: "Educational/Explainer", icon: <FaGraduationCap /> },
    { key: "Business", label: "Business/Corporate", icon: <FaBriefcase /> },
    { key: "Tech", label: "Tech/Developer", icon: <FaCode /> },
    { key: "Opinion", label: "Opinion/Thought Leadership", icon: <FaLightbulb /> },
    { key: "Marketing", label: "Marketing/SEO", icon: <FaBullhorn /> },
    { key: "Product", label: "Product/Feature", icon: <FaBox /> },
  ];

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    setResponse("");
    setLoading(false);
  };

  const resetForm = () => {
    setResponse("");
    setLoading(false);
    setCurrentFormData(null);
  };

  // Generation functions
  const generateBlog = async (type, data) => {
    setLoading(true);
    setResponse("");
    setCurrentFormData(data);

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let prompt = "";

    if (type === "educational-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Educational/Explainer blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- Complexity Level: ${data.complexityLevel}
- Include Examples: ${data.includeExamples}

Instructions:
1. Format as a professional educational blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Concept Explanation
   - Examples (if enabled)
   - Benefits / Importance
   - Conclusion
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. Complexity level: ${data.complexityLevel.toLowerCase()}
8. ${data.includeExamples === "Yes" ? "Include relevant examples to illustrate concepts" : "Do not include examples"}
9. Ensure proper educational flow and clarity
10. Make content engaging and informative

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    } 
    
    else if (type === "business-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Business/Corporate blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- Business Focus Area: ${data.businessFocusArea}
- Add Call-to-Action: ${data.addCallToAction}

Instructions:
1. Format as a professional business blog with proper structure
2. Follow the exact output structure:
   - Title
   - Business Context
   - Problem Statement
   - AI / Technology Solution
   - Business Benefits
   - Conclusion${data.addCallToAction === "Yes" ? " (+ CTA)" : ""}
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. Focus on ${data.businessFocusArea.toLowerCase()} aspects
8. ${data.addCallToAction === "Yes" ? "Include a compelling call-to-action at the end" : "Do not include call-to-action"}
9. Ensure business relevance and strategic value
10. Make content professional and insightful

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "howto-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive How-To/Step-by-Step blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- Skill Level: ${data.skillLevel}
- Steps Detail Level: ${data.stepsDetailLevel}

Instructions:
1. Format as a professional how-to blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Prerequisites
   - Step-by-Step Guide
   - Tips & Best Practices
   - Conclusion
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. Skill level: ${data.skillLevel.toLowerCase()}
8. Steps detail: ${data.stepsDetailLevel.toLowerCase()}
9. Ensure clear, actionable steps
10. Make instructions practical and easy to follow

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "tech-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Tech/Developer blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- Tech Domain: ${data.techDomain}
- Include Code Snippets: ${data.includeCodeSnippets}

Instructions:
1. Format as a professional technical blog with proper structure
2. Follow the exact output structure:
   - Title
   - Technical Overview
   - Architecture / Approach
   - Implementation Explanation
   - Code Snippets (if enabled)
   - Conclusion
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. Tech domain: ${data.techDomain.toLowerCase()}
8. ${data.includeCodeSnippets === "Yes" ? "Include relevant code snippets with proper formatting" : "Do not include code snippets"}
9. Ensure technical accuracy and depth
10. Make content valuable for developers

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "opinion-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Opinion/Thought Leadership blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- Perspective: ${data.perspective}
- Data Support Level: ${data.dataSupportLevel}

Instructions:
1. Format as a professional opinion blog with proper structure
2. Follow the exact output structure:
   - Title
   - Introduction
   - Author's Perspective
   - Supporting Arguments
   - Counterpoints
   - Conclusion
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. Perspective: ${data.perspective.toLowerCase()}
8. Data support: ${data.dataSupportLevel.toLowerCase()}
9. Ensure balanced viewpoint with supporting arguments
10. Make content thought-provoking and insightful

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "marketing-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Marketing/SEO blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- SEO Intent: ${data.seoIntent}
- Include FAQs: ${data.includeFAQs}
- Primary Keyword: ${data.primaryKeyword}

Instructions:
1. Format as a professional marketing/SEO blog with proper structure
2. Follow the exact output structure:
   - SEO Optimized Title
   - Meta Description
   - Introduction
   - Keyword-Focused Sections
   - FAQs (if enabled)
   - Conclusion
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. SEO intent: ${data.seoIntent.toLowerCase()}
8. Primary keyword: ${data.primaryKeyword}
9. ${data.includeFAQs === "Yes" ? "Include relevant FAQs with answers" : "Do not include FAQs"}
10. Ensure SEO optimization and marketing value
11. Naturally incorporate the primary keyword throughout

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    else if (type === "product-blog") {
      prompt = `You are my Professional Blog Writing Assistant.

Your task is to draft a comprehensive Product/Feature blog based on the following inputs:

Blog Details:
- Topic/Title: ${data.blogTopic}
- Language: ${data.language}
- Tone: ${data.tone}
- Length: ${data.length}
- Target Audience: ${data.targetAudience}
- Product Type: ${data.productType}
- Announcement Type: ${data.announcementType}

Instructions:
1. Format as a professional product blog with proper structure
2. Follow the exact output structure:
   - Title
   - Product Overview
   - Problem It Solves
   - Key Features
   - Benefits
   - Conclusion
3. Use ${data.tone.toLowerCase()} tone throughout
4. Write in ${data.language}
5. Make it ${data.length.toLowerCase()} in length
6. Target audience: ${data.targetAudience}
7. Product type: ${data.productType.toLowerCase()}
8. Announcement type: ${data.announcementType.toLowerCase()}
9. Ensure product value proposition is clear
10. Make content engaging and informative

Format the blog professionally with proper structure and spacing. Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse(
              "Sorry, we couldn't generate the blog. Please try again."
            );
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse(
        "An error occurred while generating the blog. Please try again later."
      );
      console.error("Error:", error);
    }
  };

  // Render mode-specific content
  const renderModeContent = () => {
    if (loading) {
      return (
        <div className="form-card">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Processing...</p>
            <p>Please wait while we process your request.</p>
          </div>
        </div>
      );
    }

    switch (currentMode) {
      case "Educational":
        return <EducationalBlog onGenerate={generateBlog} />;
      case "Business":
        return <BusinessBlog onGenerate={generateBlog} />;
      case "Tech":
        return <TechBlog onGenerate={generateBlog} />;
      case "Opinion":
        return <OpinionBlog onGenerate={generateBlog} />;
      case "Marketing":
        return <MarketingBlog onGenerate={generateBlog} />;
      case "Product":
        return <ProductBlog onGenerate={generateBlog} />;
      default:
        return <EducationalBlog onGenerate={generateBlog} />;
    }
  };

  return (
    <div className="blog-tool-page">
      {/* Mode Selection */}
      <div className="mode-selector">
        <h3 className="mode-title">Choose Blog Type:</h3>
        <div className="mode-buttons">
          {modes.map((mode) => (
            <button
              key={mode.key}
              className={`mode-button ${currentMode === mode.key ? 'active' : ''}`}
              onClick={() => handleModeChange(mode.key)}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-label">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Section */}
      <div className="response-section">
        <ResponseDisplay
          response={response}
          currentTool="blog"
          currentMode={currentMode}
          formData={currentFormData}
          onReset={resetForm}
          title={`${currentMode} Blog:`}
          subject={currentFormData?.blogTopic}
        />
      </div>

      {/* Content Area */}
      {!response && (
        <div className="form-section">
          <div className="form-card">
            {renderModeContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTool;
