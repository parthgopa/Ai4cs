import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { backend_URL } from "./HomePage";

const AuthModal = ({ show, onHide, initialStage = "login" }) => {
  const [stage, setStage] = useState(initialStage); // "login" | "signup" | "otp" | "key"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [apiKey, setApiKey] = useState("");

  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setStage(initialStage);
      setError("");
      setMessage("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setShowApiKey(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [show, initialStage]);

  useEffect(() => {
    if (stage === "key") {
      setApiKey(localStorage.getItem("geminiApiKey") || "");
    }
  }, [stage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${backend_URL}/api/auth/login`, { email, password });
      setMessage("Login successful!");
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("authToken", "verified_session");
      localStorage.setItem("hasGeminiKey", res.data.has_key ? "true" : "false");
      localStorage.setItem("byokEnabled", res.data.byok_enabled ? "true" : "false");
      localStorage.setItem("geminiApiKey", res.data.api_key || "");

      // Dispatch custom event to notify Header and Tools
      window.dispatchEvent(new Event("auth-change"));

      if (res.data.byok_enabled && !res.data.has_key) {
        // Switch to Gemini Key stage
        setStage("key");
        setError("");
        setMessage("Please register your Gemini API key to proceed.");
      } else {
        setTimeout(() => {
          onHide();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${backend_URL}/api/auth/signup`, { email, password });
      setMessage(res.data.message || "OTP code sent to your email.");
      setStage("otp");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${backend_URL}/api/auth/verify-otp`, { email, otp });
      setMessage("Account verified and created successfully!");
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("authToken", "verified_session");
      localStorage.setItem("hasGeminiKey", "false");
      localStorage.setItem("byokEnabled", res.data.byok_enabled ? "true" : "false");

      window.dispatchEvent(new Event("auth-change"));

      if (res.data.byok_enabled) {
        setStage("key");
        setError("");
        setMessage("Please register your Gemini API key to proceed.");
      } else {
        setTimeout(() => {
          onHide();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setError("Please enter a Gemini API Key.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${backend_URL}/api/auth/save-key`,
        { api_key: apiKey },
        { headers: { "X-User-Email": email || localStorage.getItem("userEmail") } }
      );
      setMessage(res.data.message || "API key registered successfully!");
      localStorage.setItem("hasGeminiKey", "true");
      localStorage.setItem("geminiApiKey", apiKey);

      window.dispatchEvent(new Event("auth-change"));

      setTimeout(() => {
        onHide();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save API key. Please verify the format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center font-weight-bold" style={{ color: "var(--primary-color)" }}>
          {stage === "login" && "Login"}
          {stage === "signup" && "Sign Up"}
          {stage === "otp" && "Verify Email"}
          {stage === "key" && "Register Gemini API Key"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        {stage === "login" && (
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-2 btn-primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Login"}
            </Button>
            <div className="text-center mt-3 small">
              Don't have an account?{" "}
              <span
                className="text-primary cursor-pointer"
                style={{ cursor: "pointer", fontWeight: "600" }}
                onClick={() => { setStage("signup"); setError(""); setMessage(""); }}
              >
                Sign Up
              </span>
            </div>
          </Form>
        )}

        {stage === "signup" && (
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-2 btn-primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Send Verification OTP"}
            </Button>
            <div className="text-center mt-3 small">
              Already have an account?{" "}
              <span
                className="text-primary cursor-pointer"
                style={{ cursor: "pointer", fontWeight: "600" }}
                onClick={() => { setStage("login"); setError(""); setMessage(""); }}
              >
                Login
              </span>
            </div>
          </Form>
        )}

        {stage === "otp" && (
          <Form onSubmit={handleVerifyOtp}>
            <p className="text-muted text-center small mb-4">
              We have sent a verification code to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Enter 6-Digit OTP</Form.Label>
              <Form.Control
                type="text"
                maxLength="6"
                placeholder="123456"
                className="text-center font-weight-bold"
                style={{ letterSpacing: "5px", fontSize: "20px" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-2 btn-primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Verify & Activate Account"}
            </Button>
            <div className="text-center mt-3 small">
              Need to change email?{" "}
              <span
                className="text-primary cursor-pointer"
                style={{ cursor: "pointer", fontWeight: "600" }}
                onClick={() => { setStage("signup"); setError(""); setMessage(""); }}
              >
                Go Back
              </span>
            </div>
          </Form>
        )}

        {stage === "key" && (
          <Form onSubmit={handleSaveKey}>
            <div className="mb-3 small text-muted">
              <p>To use AI features, you need to provide your Gemini API key (Bring Your Own Key).</p>
              <h6 className="font-weight-bold mb-1" style={{ color: "var(--primary-color)" }}>Where to find your key?</h6>
              <ol className="ps-3 mb-2">
                <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "var(--primary-blue)" }}>Google AI Studio</a>.</li>
                <li>Click <strong>Get API key</strong> and click <strong>Create API key</strong>.</li>
                <li>Ensure billing is connected to your Google Cloud project if required.</li>
                <li>Copy the key and paste it below.</li>
              </ol>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Gemini API Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Gemini API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowApiKey(!showApiKey)}
                  type="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {showApiKey ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-2 btn-primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Save API Key"}
            </Button>
            <Button variant="outline-secondary" onClick={onHide} className="w-100 mt-2" disabled={loading}>
              Skip for now
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
