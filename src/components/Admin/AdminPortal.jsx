import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { FaUserShield, FaKey, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { backend_URL } from "../HomePage";

import Sidebar from "./Sidebar";
import UsersList from "./UsersList";
import ActivityLogs from "./ActivityLogs";
import TokenStats from "./TokenStats";
import ModelSettings from "./ModelSettings";

const AdminPortal = () => {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem("adminEmail"));
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem("adminEmail") || "");
  const [authStage, setAuthStage] = useState("login"); // "login" | "signup" | "otp"
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState("users"); // "users" | "activities" | "stats" | "settings"

  // Data State
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ totals: {}, user_stats: [] });
  const [settings, setSettings] = useState({ model_version: "", pricing_input_inr_per_1m: 0, pricing_output_inr_per_1m: 0 });
  const [availableModels, setAvailableModels] = useState([]);
  const [lastModelVersion, setLastModelVersion] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");

  // Loading States
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Verify Admin Session on Load
  useEffect(() => {
    const checkAdminStatus = async () => {
      const email = localStorage.getItem("adminEmail");
      if (email) {
        try {
          const res = await axios.post(
            `${backend_URL}/api/admin/auth/status`,
            {},
            { headers: { "X-Admin-Email": email } }
          );
          if (res.data.is_logged_in) {
            setIsAdminLoggedIn(true);
            setAdminEmail(email);
          } else {
            handleAdminLogout();
          }
        } catch (err) {
          console.error("Admin status check failed:", err);
          handleAdminLogout();
        }
      }
    };
    checkAdminStatus();
  }, []);

  // Fetch Dashboard Data when logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchData();
    }
  }, [isAdminLoggedIn, activeTab]);

  // Synchronize model version changes to auto-populate pricing inputs
  useEffect(() => {
    if (settings.model_version && settings.model_version !== lastModelVersion) {
      setLastModelVersion(settings.model_version);
      const selectedModel = availableModels.find((m) => m.name === settings.model_version);
      if (selectedModel) {
        setSettings((prev) => ({
          ...prev,
          pricing_input_inr_per_1m: selectedModel.input_price_inr,
          pricing_output_inr_per_1m: selectedModel.output_price_inr,
        }));
      }
    }
  }, [settings.model_version, availableModels, lastModelVersion]);

  const fetchData = async () => {
    setDataLoading(true);
    setError("");
    try {
      const headers = { "X-Admin-Email": adminEmail };
      if (activeTab === "users") {
        const res = await axios.get(`${backend_URL}/api/admin/users`, { headers });
        setUsers(res.data.users || []);
      } else if (activeTab === "activities") {
        const res = await axios.get(`${backend_URL}/api/admin/activities`, { headers });
        setActivities(res.data.activities || []);
      } else if (activeTab === "stats") {
        const res = await axios.get(`${backend_URL}/api/admin/stats`, { headers });
        setStats(res.data || { totals: {}, user_stats: [] });
      } else if (activeTab === "settings") {
        const res = await axios.get(`${backend_URL}/api/admin/settings`, { headers });
        setSettings(res.data || { model_version: "", pricing_input_inr_per_1m: 0, pricing_output_inr_per_1m: 0 });

        try {
          const modelsRes = await axios.get(`${backend_URL}/api/admin/models`, { headers });
          setAvailableModels(modelsRes.data.models || []);
        } catch (modelErr) {
          console.error("Failed to load models list:", modelErr);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load admin data.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || !secretKeyInput) {
      setAuthError("Please fill in all fields.");
      return;
    }
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const res = await axios.post(`${backend_URL}/api/admin/auth/signup`, {
        email: emailInput,
        password: passwordInput,
        secret_key: secretKeyInput,
      });
      setAuthMessage(res.data.message || "OTP code sent to email.");
      setAuthStage("otp");
    } catch (err) {
      setAuthError(err.response?.data?.error || "Signup failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput) {
      setAuthError("Please enter the OTP.");
      return;
    }
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      await axios.post(`${backend_URL}/api/admin/auth/verify-otp`, {
        email: emailInput,
        otp: otpInput,
      });
      setAuthMessage("Account verified! You can now log in.");
      setAuthStage("login");
      setPasswordInput("");
      setOtpInput("");
    } catch (err) {
      setAuthError(err.response?.data?.error || "OTP verification failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setAuthError("Please fill in all fields.");
      return;
    }
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const res = await axios.post(`${backend_URL}/api/admin/auth/login`, {
        email: emailInput,
        password: passwordInput,
      });
      localStorage.setItem("adminEmail", res.data.email);
      setAdminEmail(res.data.email);
      setIsAdminLoggedIn(true);
    } catch (err) {
      setAuthError(err.response?.data?.error || "Invalid credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminEmail");
    setIsAdminLoggedIn(false);
    setAdminEmail("");
    setAuthStage("login");
    setEmailInput("");
    setPasswordInput("");
    setSecretKeyInput("");
    setOtpInput("");
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const headers = { "X-Admin-Email": adminEmail };
      await axios.post(`${backend_URL}/api/admin/settings`, settings, { headers });
      setMessage("Settings updated successfully!");

      // Refresh availableModels with the newly saved custom pricing
      const modelsRes = await axios.get(`${backend_URL}/api/admin/models`, { headers });
      const updatedModels = modelsRes.data.models || [];
      setAvailableModels(updatedModels);

      // Sync lastModelVersion to force refresh
      setLastModelVersion(settings.model_version);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save settings.");
    }
  };

  const handleModelSelect = (e) => {
    const selectedName = e.target.value;
    if (!selectedName) return;

    setSettings({
      ...settings,
      model_version: selectedName,
    });
  };

  const handleResetPricing = () => {
    const selectedModel = availableModels.find((m) => m.name === settings.model_version);
    if (selectedModel) {
      setSettings({
        ...settings,
        pricing_input_inr_per_1m: selectedModel.input_price_inr,
        pricing_output_inr_per_1m: selectedModel.output_price_inr,
      });
      setMessage("Pricing reset to model defaults.");
      setError("");
    } else {
      setError("No standard pricing template found for the current model.");
    }
  };

  // AUTHENTICATION LAYOUT
  if (!isAdminLoggedIn) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
        <Card className="p-4 shadow-lg border-0" style={{ width: "100%", maxWidth: "450px", backgroundColor: "var(--card-bg)", borderRadius: "16px" }}>
          <div className="text-center mb-4">
            <FaUserShield style={{ fontSize: "3rem", color: "var(--primary-color)" }} />
            <h3 className="font-weight-bold mt-2" style={{ color: "var(--primary-color)" }}>
              Admin Access Portal
            </h3>
          </div>
          {authError && <Alert variant="danger">{authError}</Alert>}
          {authMessage && <Alert variant="success">{authMessage}</Alert>}

          {authStage === "login" && (
            <Form onSubmit={handleAdminLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Admin Email</Form.Label>
                <div className="position-relative">
                  <FaEnvelope className="position-absolute" style={{ top: "12px", left: "12px", color: "var(--text-muted, #6c757d)", opacity: 0.7 }} />
                  <Form.Control
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: "36px" }}
                    placeholder="admin@ai4cs.in"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <FaKey className="position-absolute" style={{ top: "12px", left: "12px", color: "var(--text-muted, #6c757d)", opacity: 0.7 }} />
                  <Form.Control
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: "36px" }}
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Button type="submit" className="w-100 btn-primary mt-2" disabled={authLoading}>
                {authLoading ? <Spinner size="sm" animation="border" /> : "Log In"}
              </Button>
              <div className="text-center mt-3 small text-muted">
                Need admin access?{" "}
                <span
                  style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => {
                    setAuthStage("signup");
                    setAuthError("");
                    setAuthMessage("");
                  }}
                >
                  Sign Up
                </span>
              </div>
            </Form>
          )}

          {authStage === "signup" && (
            <Form onSubmit={handleAdminSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="position-relative">
                  <FaEnvelope className="position-absolute" style={{ top: "12px", left: "12px", color: "var(--text-muted, #6c757d)", opacity: 0.7 }} />
                  <Form.Control
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: "36px" }}
                    placeholder="Enter email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <FaKey className="position-absolute" style={{ top: "12px", left: "12px", color: "var(--text-muted, #6c757d)", opacity: 0.7 }} />
                  <Form.Control
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: "36px" }}
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Admin Secret Key</Form.Label>
                <div className="position-relative">
                  <FaKey className="position-absolute" style={{ top: "12px", left: "12px", color: "var(--text-muted, #6c757d)", opacity: 0.7 }} />
                  <Form.Control
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: "36px" }}
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Button type="submit" className="w-100 btn-primary mt-2" disabled={authLoading}>
                {authLoading ? <Spinner size="sm" animation="border" /> : "Request Access"}
              </Button>
              <div className="text-center mt-3 small text-muted">
                Already registered?{" "}
                <span
                  style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => {
                    setAuthStage("login");
                    setAuthError("");
                    setAuthMessage("");
                  }}
                >
                  Log In
                </span>
              </div>
            </Form>
          )}

          {authStage === "otp" && (
            <Form onSubmit={handleAdminVerifyOtp}>
              <Form.Group className="mb-3">
                <Form.Label>Verification OTP</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control text-center"
                  style={{ letterSpacing: "8px", fontSize: "1.2rem", fontWeight: "bold" }}
                  placeholder="000000"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100 btn-primary mt-2" disabled={authLoading}>
                {authLoading ? <Spinner size="sm" animation="border" /> : "Verify and Register"}
              </Button>
            </Form>
          )}
        </Card>
      </Container>
    );
  }

  // ADMIN DASHBOARD LAYOUT
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminEmail={adminEmail}
        handleAdminLogout={handleAdminLogout}
      />

      {/* Main Dashboard Panel */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        {dataLoading ? (
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {activeTab === "users" && (
              <UsersList users={users} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            )}

            {activeTab === "activities" && (
              <ActivityLogs activities={activities} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            )}

            {activeTab === "stats" && (
              <TokenStats stats={stats} />
            )}

            {activeTab === "settings" && (
              <ModelSettings
                settings={settings}
                setSettings={setSettings}
                availableModels={availableModels}
                handleModelSelect={handleModelSelect}
                handleSaveSettings={handleSaveSettings}
                handleResetPricing={handleResetPricing}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
