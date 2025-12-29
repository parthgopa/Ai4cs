import React, { useState } from 'react';
import { FaCogs, FaUser, FaBuilding, FaBullseye, FaTools, FaChartLine, FaHistory, FaDatabase } from 'react-icons/fa';

const TechnicalReport = ({ onGenerate }) => {
  // Sample dummy data for demonstration
  const dummyData = {
    reportTitle: "Performance Analysis of Machine Learning Models for Real-Time Image Classification",
    authorName: "Dr. Sarah Johnson",
    organization: "Tech Research Institute",
    purpose: "This technical report evaluates the performance of various machine learning models for real-time image classification tasks, focusing on accuracy, speed, and resource utilization in production environments.",
    technicalBackground: "Real-time image classification has become increasingly important in various applications including autonomous vehicles, medical imaging, and security systems. Recent advances in deep learning, particularly Convolutional Neural Networks (CNNs), have significantly improved classification accuracy. However, the challenge lies in balancing accuracy with computational efficiency for real-time processing requirements.",
    toolsTechnologies: "• Programming Languages: Python, TensorFlow, PyTorch\n• Frameworks: OpenCV, Keras, Scikit-learn\n• Tools: Docker, Jenkins, Git, Jupyter Notebook\n• Hardware: NVIDIA Tesla V100 GPUs, Intel Xeon Processors\n• Datasets: ImageNet, COCO, Custom Dataset\n• Monitoring: Prometheus, Grafana",
    methodology: "We employed a systematic methodology to evaluate five different CNN architectures: ResNet-50, MobileNet-V2, EfficientNet-B0, YOLOv5, and a custom lightweight model. Each model was trained on the ImageNet dataset and fine-tuned on our custom dataset. We measured inference time, memory usage, and accuracy across different hardware configurations. Statistical analysis was performed using ANOVA to determine significant differences between models.",
    implementationDetails: "The implementation consisted of three main modules: data preprocessing pipeline, model training framework, and performance evaluation system. The data preprocessing module handles image augmentation, normalization, and batch generation. The training framework supports distributed training across multiple GPUs with automatic mixed precision. The evaluation system collects metrics including inference latency, throughput, memory footprint, and power consumption. All components are containerized using Docker for reproducibility.",
    performanceEvaluation: "Results show that EfficientNet-B0 achieved the best balance with 92.3% accuracy and 15ms inference time on GPU. MobileNet-V2 showed excellent performance on edge devices with 85.7% accuracy and 8ms inference time. The custom lightweight model achieved 78.2% accuracy with only 3ms inference time, making it suitable for resource-constrained environments. GPU acceleration provided 10-15x speedup compared to CPU processing.",
    limitations: "The study is limited to image classification tasks and may not generalize to other computer vision tasks. Hardware-specific optimizations were not extensively explored. The evaluation was conducted on a single dataset, which may introduce bias. Long-term reliability and robustness testing were not performed.",
    conclusion: "The technical evaluation demonstrates that model selection should be based on specific application requirements. For high-accuracy applications, EfficientNet-B0 provides optimal performance. For edge devices, MobileNet-V2 offers the best compromise. The custom lightweight model is suitable for real-time applications with limited resources. Future work should explore model compression techniques and hardware-specific optimizations.",
  };

  const [reportData, setReportData] = useState({
    reportTitle: "",
    authorName: "",
    organization: "",
    purpose: "",
    technicalBackground: "",
    toolsTechnologies: "",
    methodology: "",
    implementationDetails: "",
    performanceEvaluation: "",
    limitations: "",
    conclusion: "",
  });

  const [savedData, setSavedData] = useState(() => {
    // Load saved data from localStorage on component mount
    const saved = localStorage.getItem('technicalReportSavedData');
    return saved ? JSON.parse(saved) : null;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleGenerateReport = () => {
    const requiredFields = ['reportTitle', 'authorName', 'organization', 'purpose', 'technicalBackground', 'toolsTechnologies', 'methodology', 'implementationDetails', 'performanceEvaluation', 'limitations', 'conclusion'];
    const missingFields = requiredFields.filter(field => !reportData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }
    
    // Automatically save the current data to localStorage when generating
    setSavedData({...reportData});
    localStorage.setItem('technicalReportSavedData', JSON.stringify(reportData));
    
    onGenerate('technical-report', reportData);
  };

  const loadDummyData = () => {
    setReportData(dummyData);
  };

  const loadSavedData = () => {
    // Try to get fresh data from localStorage first
    const freshSavedData = localStorage.getItem('technicalReportSavedData');
    if (freshSavedData) {
      const parsedData = JSON.parse(freshSavedData);
      setSavedData(parsedData);
      setReportData(parsedData);
    } else if (savedData) {
      setReportData(savedData);
    } else {
      alert("No saved data found. Generate a report first to save your data automatically.");
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h3 className="form-section-title">Technical Report</h3>
        <div className="form-header-buttons">
          <button 
            className="btn-load-saved" 
            onClick={loadSavedData}
            title="Load your saved data"
          >
            <FaDatabase />
          </button>
          <button 
            className="btn-load-previous" 
            onClick={loadDummyData}
            title="Load sample data"
          >
            <FaHistory />
          </button>
        </div>
      </div>
      <div className="form-grid">
        {/* 1. Report Title */}
        <div className="form-group">
          <label className="form-label">
            <FaCogs className="me-2" />
            Report Title
          </label>
          <input
            type="text"
            name="reportTitle"
            value={reportData.reportTitle}
            onChange={handleInputChange}
            placeholder="Enter the technical report title"
            className="form-control"
            autoFocus
          />
        </div>

        {/* 2. Author Name */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="me-2" />
            Author Name
          </label>
          <input
            type="text"
            name="authorName"
            value={reportData.authorName}
            onChange={handleInputChange}
            placeholder="Enter author name"
            className="form-control"
          />
        </div>

        {/* 3. Organization */}
        <div className="form-group">
          <label className="form-label">
            <FaBuilding className="me-2" />
            Organization / Institution
          </label>
          <input
            type="text"
            name="organization"
            value={reportData.organization}
            onChange={handleInputChange}
            placeholder="Enter organization or institution name"
            className="form-control"
          />
        </div>

        {/* 4. Purpose of the Report */}
        <div className="form-group">
          <label className="form-label">
            <FaBullseye className="me-2" />
            Purpose of the Report
          </label>
          <textarea
            rows={3}
            name="purpose"
            value={reportData.purpose}
            onChange={handleInputChange}
            placeholder="Clearly state the purpose and objectives of this technical report"
            className="form-control form-textarea"
          />
        </div>

        {/* 5. Technical Background */}
        <div className="form-group">
          <label className="form-label">Technical Background</label>
          <textarea
            rows={4}
            name="technicalBackground"
            value={reportData.technicalBackground}
            onChange={handleInputChange}
            placeholder="Provide relevant technical background, context, and literature review"
            className="form-control form-textarea"
          />
        </div>

        {/* 6. Tools/Technologies Used */}
        <div className="form-group">
          <label className="form-label">
            <FaTools className="me-2" />
            Tools / Technologies Used
          </label>
          <textarea
            rows={3}
            name="toolsTechnologies"
            value={reportData.toolsTechnologies}
            onChange={handleInputChange}
            placeholder="List all technical tools, software, and technologies used:
• Programming Languages: Python, JavaScript
• Frameworks: TensorFlow, React
• Tools: Docker, Git, Jupyter Notebook
• Hardware: GPU servers, IoT devices"
            className="form-control form-textarea"
          />
        </div>

        {/* 7. Methodology */}
        <div className="form-group">
          <label className="form-label">Methodology / Approach</label>
          <textarea
            rows={4}
            name="methodology"
            value={reportData.methodology}
            onChange={handleInputChange}
            placeholder="Describe the technical methodology, approach, and experimental design used"
            className="form-control form-textarea"
          />
        </div>

        {/* 8. Implementation Details */}
        <div className="form-group">
          <label className="form-label">Implementation Details</label>
          <textarea
            rows={5}
            name="implementationDetails"
            value={reportData.implementationDetails}
            onChange={handleInputChange}
            placeholder="Provide detailed technical implementation information, algorithms, and system design"
            className="form-control form-textarea"
          />
        </div>

        {/* 9. Performance/Evaluation */}
        <div className="form-group">
          <label className="form-label">
            <FaChartLine className="me-2" />
            Performance / Evaluation
          </label>
          <textarea
            rows={4}
            name="performanceEvaluation"
            value={reportData.performanceEvaluation}
            onChange={handleInputChange}
            placeholder="Describe performance metrics, evaluation results, and analysis of the technical solution"
            className="form-control form-textarea"
          />
        </div>

        {/* 10. Limitations */}
        <div className="form-group">
          <label className="form-label">Limitations</label>
          <textarea
            rows={3}
            name="limitations"
            value={reportData.limitations}
            onChange={handleInputChange}
            placeholder="Discuss the limitations, constraints, and boundaries of the technical solution"
            className="form-control form-textarea"
          />
        </div>

        {/* 11. Conclusion */}
        <div className="form-group">
          <label className="form-label">Conclusion</label>
          <textarea
            rows={3}
            name="conclusion"
            value={reportData.conclusion}
            onChange={handleInputChange}
            placeholder="Summarize the technical findings, contributions, and future work recommendations"
            className="form-control form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-generate"
            onClick={handleGenerateReport}
          >
            <FaCogs className="me-1" />
            Generate Report
          </button>
          <button 
            className="btn-reset"
            onClick={() => setReportData({
              reportTitle: "",
              authorName: "",
              organization: "",
              purpose: "",
              technicalBackground: "",
              toolsTechnologies: "",
              methodology: "",
              implementationDetails: "",
              performanceEvaluation: "",
              limitations: "",
              conclusion: "",
            })}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReport;
