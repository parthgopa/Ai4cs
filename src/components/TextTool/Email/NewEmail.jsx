import React, { useState } from 'react';
import { FaEnvelope, FaArrowRight, FaArrowLeft, FaCheck, FaHistory } from 'react-icons/fa';

const NewEmail = ({ onGenerate }) => {
    // Sample previous data for demonstration
    const previousData = {
        signatory: "John Doe, Company Secretary",
        subject: "Board Meeting Notice",
        connotation: "Dear Sir",
        inputDetails: "Notice for the upcoming board meeting to discuss quarterly results",
        otherPoints: "Please bring all necessary documents",
        tone: "Professional",
        length: "Medium",
        closingConnotation: "Best regards",
        language: "English",
        references: "No",
    };

    const [formData, setFormData] = useState({
        signatory: "",
        subject: "",
        connotation: "",
        inputDetails: "",
        otherPoints: "",
        tone: "",
        length: "",
        closingConnotation: "",
        language: "",
        references: "No",
    });

    const formFields = [
        {
            field: "signatory",
            label: "To: (Sender's name + position)",
            type: "text",
            placeholder: "e.g., John Doe, Company Secretary",
        },

        {
            field: "subject",
            label: "Subject of the email",
            type: "text",
            placeholder: "Enter the subject line for your email",
        },

        {
            field: "connotation",
            label: "Connotation",
            type: "select",
            options: [
                { value: "", label: "Select connotation..." },
                { value: "Sir", label: "Sir" },
                { value: "Dear Sir", label: "Dear Sir" },
                { value: "Madam", label: "Madam" },
                { value: "Dear Madam", label: "Dear Madam" },
                { value: "Dear Sir/Madam", label: "Dear Sir/Madam" },
                { value: "Respected Sir", label: "Respected Sir" },
                { value: "Respected Madam", label: "Respected Madam" },
                { value: "Dear Mr.", label: "Dear Mr." },
                { value: "Dear Ms.", label: "Dear Ms." },
            ],
        },

        {
            field: "inputDetails",
            label: "Main matter (brief context / purpose)",
            type: "textarea",
            placeholder: "Provide brief context or purpose of the email",
        },

        {
            field: "otherPoints",
            label: "Additional Matter",
            type: "textarea",
            placeholder: "Any additional points you want to include (optional)",
            optional: true,
        },

        {
            field: "tone",
            label: "Tone",
            type: "select",
            options: [
                { value: "", label: "Select tone..." },
                { value: "Simple", label: "Simple" },
                { value: "Professional", label: "Professional" },
                { value: "Legal", label: "Legal" },
                { value: "Requesting", label: "Requesting" },
            ],
        },

        {
            field: "length",
            label: "Length",
            type: "select",
            options: [
                { value: "", label: "Select length..." },
                { value: "Summary", label: "Summary" },
                { value: "Medium", label: "Medium" },
                { value: "Detailed", label: "Detailed" },
            ],
        },

        {
            field: "closingConnotation",
            label: "Closing connotation",
            type: "select",
            options: [
                { value: "", label: "Select closing..." },
                { value: "With regards", label: "With regards" },
                { value: "Yours faithfully", label: "Yours faithfully" },
                { value: "Yours sincerely", label: "Yours sincerely" },
                { value: "Best regards", label: "Best regards" },
                { value: "Warm regards", label: "Warm regards" },
                { value: "Respectfully yours", label: "Respectfully yours" },
                { value: "Thank you", label: "Thank you" },
            ],
        },

        {
            field: "language",
            label: "Language",
            type: "select",
            options: [
                { value: "", label: "Select language..." },
                { value: "English", label: "English" },
                { value: "Hindi", label: "Hindi" },
                { value: "Gujarati", label: "Gujarati" },
            ],
        },
        {
            field: "references",
            label: "Include References/Case Law",
            type: "select",
            options: [
                { value: "No", label: "No" },
                { value: "Yes", label: "Yes" },
            ],
        },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGenerate = () => {
        const requiredFields = formFields.filter(field => !field.optional);
        const missingFields = requiredFields.filter(field => !formData[field.field]);

        if (missingFields.length > 0) {
            alert("Please fill in all required fields before proceeding.");
            return;
        }
        onGenerate('new-email', formData);
    };

    const loadPreviousData = () => {
        setFormData(previousData);
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <h3 className="form-section-title">New Email</h3>
                <button 
                    className="btn-load-previous" 
                    onClick={loadPreviousData}
                    title="Load previous data"
                >
                    <FaHistory />
                </button>
            </div>

            <div className="form-grid">
                {formFields.map((field, index) => (
                    <div key={field.field} className="form-group">
                        <label className="form-label">
                            {field.label}
                            {field.optional && <span className="text-muted"> (Optional)</span>}
                        </label>

                        {field.type === "text" ? (
                            <input
                                type="text"
                                name={field.field}
                                value={formData[field.field]}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                className="form-control"
                                autoFocus={index === 0}
                            />
                        ) : field.type === "textarea" ? (
                            <textarea
                                rows={3}
                                name={field.field}
                                value={formData[field.field]}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                className="form-control form-textarea"
                            />
                        ) : (
                            <select
                                name={field.field}
                                value={formData[field.field]}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <button className="btn-generate" onClick={handleGenerate}>
                    <FaEnvelope className="me-1" />
                    Generate Email
                </button>
                <button className="btn-reset" onClick={() => setFormData({
                    signatory: "",
                    subject: "",
                    connotation: "",
                    inputDetails: "",
                    otherPoints: "",
                    tone: "",
                    length: "",
                    closingConnotation: "",
                    language: "",
                    references: "No",
                })}>
                    Reset Form
                </button>
            </div>
        </div>
    );
};

export default NewEmail;
