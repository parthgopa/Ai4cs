import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas, Accordion } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { ThemeContext } from './ThemeContext';
import { IoHomeOutline, IoInformationCircleOutline, IoCallOutline, IoSettings, IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import Chatbot from '../components/Chatbot';
import { getToolsByCategoryFromTools, enabledToolIdsFromTools } from '../components/Tools';
import AuthModal from '../components/AuthModal';
import axios from 'axios';
import { backend_URL } from '../components/HomePage';


const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  // Authentication State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStage, setAuthStage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userEmail"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [byokEnabled, setByokEnabled] = useState(localStorage.getItem("byokEnabled") === "true");
  const [hasGeminiKey, setHasGeminiKey] = useState(localStorage.getItem("hasGeminiKey") === "true");

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userEmail"));
      setUserEmail(localStorage.getItem("userEmail") || "");
      setByokEnabled(localStorage.getItem("byokEnabled") === "true");
      setHasGeminiKey(localStorage.getItem("hasGeminiKey") === "true");
    };
    window.addEventListener("auth-change", handleAuthChange);

    const handleTriggerLogin = (e) => {
      setAuthStage(e.detail?.stage || "login");
      setShowAuthModal(true);
    };
    window.addEventListener("trigger-login", handleTriggerLogin);

    // Call status API to synchronize localStorage on load/refresh
    const syncAuthStatus = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          const res = await axios.post(`${backend_URL}/api/auth/status`, {}, {
            headers: { "X-User-Email": email }
          });
          if (res.data.is_logged_in) {
            localStorage.setItem("byokEnabled", res.data.byok_enabled ? "true" : "false");
            localStorage.setItem("hasGeminiKey", res.data.has_key ? "true" : "false");
            localStorage.setItem("geminiApiKey", res.data.api_key || "");
            handleAuthChange();
          } else {
            // Clear invalid session
            localStorage.removeItem("userEmail");
            localStorage.removeItem("authToken");
            localStorage.removeItem("hasGeminiKey");
            localStorage.removeItem("byokEnabled");
            localStorage.removeItem("geminiApiKey");
            handleAuthChange();
          }
        } catch (err) {
          console.error("Auth status sync failed:", err);
        }
      }
    };
    syncAuthStatus();

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("trigger-login", handleTriggerLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    localStorage.removeItem("hasGeminiKey");
    localStorage.removeItem("byokEnabled");
    localStorage.removeItem("geminiApiKey");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  
  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);
  const toolsByCategory = getToolsByCategoryFromTools();
  // console.log(toolsByCategory)
  
  const handleToolClick = (route) => {
    const loggedIn = !!localStorage.getItem("userEmail");
    if (!loggedIn) {
      setAuthStage("login");
      setShowAuthModal(true);
      return;
    }

    const byok = localStorage.getItem("byokEnabled") === "true";
    const hasKey = localStorage.getItem("hasGeminiKey") === "true";
    if (byok && !hasKey) {
      setAuthStage("key");
      setShowAuthModal(true);
      return;
    }

    navigate(route);
    setShowToolsMenu(false);
    setShowMenu(false);
  };

  return (
    <Navbar expand="lg" sticky="top" variant={theme === 'dark' ? 'dark' : 'light'} className="header-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          {/*Add a image logo*/}
          <div className="logo-container">
            <img src="/logo.jpg" alt="Logo" className="logo" />
          </div>
        </Navbar.Brand>

        
        {/* Chatbot Toggle Button - Center */}
        <div className="chatbot-header-toggle d-flex justify-content-center flex-grow-1">
          <Button 
            className="chatbot-toggle-header d-none d-lg-flex"
            onClick={toggleChatbot}
            aria-label="Toggle AI Assistant"
            variant="outline-primary"
          >
            <img src="/images/chatbot.jpg" alt="AI Assistant" className="chatbot-image" />
            <div className="ms-2" style={{ fontWeight: 'bold',fontSize: '18px',alignItems: 'center',display: 'flex' }}>AI Assistant</div>
          </Button>
          
          {/* Mobile Chatbot Image Toggle */}
          <Button 
            className="chatbot-toggle-image d-lg-none"
            onClick={toggleChatbot}
            aria-label="Toggle AI Assistant"
          >
            <img 
              src="/images/chatbot.jpg" 
              alt="AI Assistant"
              className="chatbot-image-mobile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </Button>
        </div>
        
        <div className="d-flex align-items-right">
          <Button 
            onClick={toggleTheme} 
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
            size="sm" 
            className="theme-toggle-btn d-none d-lg-flex align-items-center me-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <BsFillSunFill size={16} className="me-1" /> 
                <span className="theme-text">Light</span>
              </>
            ) : (
              <>
                <BsFillMoonFill size={16} className="me-1" /> 
                <span className="theme-text">Dark</span>
              </>
            )}
          </Button>
          <Navbar.Toggle 
            aria-controls="main-offcanvas" 
            onClick={() => setShowMenu(true)}
            className="custom-toggler d-lg-none"
          >
            <div className="toggle-icon">
              <span className="toggle-bar"></span>
              <span className="toggle-bar"></span>
              <span className="toggle-bar"></span>
            </div>
          </Navbar.Toggle>
        </div>
        <Navbar.Offcanvas
          id="main-offcanvas"
          aria-labelledby="main-offcanvas-label"
          placement="end"
          className="header-offcanvas"
          show={showMenu}
          onHide={() => setShowMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="main-offcanvas-label" className="offcanvas-title">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="align-items-lg-center ms-lg-auto">
              {/* Mobile Auth Section at the top of menu */}
              <div className="d-lg-none border-bottom pb-3 mb-3 w-100">
                {!isLoggedIn ? (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      className="w-50" 
                      onClick={() => { setAuthStage("login"); setShowAuthModal(true); setShowMenu(false); }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="primary" 
                      className="w-50" 
                      onClick={() => { setAuthStage("signup"); setShowAuthModal(true); setShowMenu(false); }}
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="text-muted small mb-2 text-truncate">👤 Logged in as: <strong>{userEmail}</strong></div>
                    <div className="d-flex gap-2">
                      {byokEnabled && (
                        <Button
                          variant={hasGeminiKey ? "outline-success" : "outline-warning"}
                          className="w-50 py-1"
                          onClick={() => { setAuthStage("key"); setShowAuthModal(true); setShowMenu(false); }}
                          style={{ fontSize: "13px" }}
                        >
                          {hasGeminiKey ? "Gemini Key ✓" : "Set Gemini Key ⚠️"}
                        </Button>
                      )}
                      <Button 
                        variant="outline-danger" 
                        className={byokEnabled ? "w-50 py-1" : "w-100 py-1"} 
                        onClick={() => { handleLogout(); setShowMenu(false); }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Nav.Link as={Link} to="/" className="nav-link" onClick={() => setShowMenu(false)}> 
                <IoHomeOutline size={20} className='navbar-buttons'/> Home
              </Nav.Link>

              
              {/* Desktop: Hover Dropdown */}
              <div 
                className="tools-dropdown-container d-none d-lg-block"
                onMouseEnter={() => setShowToolsMenu(true)}
                onMouseLeave={() => setShowToolsMenu(false)}
              >
                <Nav.Link as={Link} to="/tools" className="nav-link tools-nav-link">
                  <IoSettings size={20} className='navbar-buttons'/> Tools <IoChevronDown size={16} className="ms-1" />
                </Nav.Link>
                
                {showToolsMenu && (
                  <div className="tools-mega-dropdown">
                    <div className="tools-mega-content">
                      {Object.entries(toolsByCategory).map(([category, tools]) => (
                        <div key={category} className="tools-category-section">
                          <h6 className="tools-category-title">{category}</h6>
                          <ul className="tools-list">
                            {tools.map(tool => {
                              const IconComponent = tool.icon;
                              const isEnabled = enabledToolIdsFromTools.has(tool.id);
                              return (
                                <li key={tool.id} className={!isEnabled ? 'disabled' : ''}>
                                  <button onClick={() => handleToolClick(tool.route)} className="tool-item">
                                    <IconComponent className="tool-icon-small" />
                                    <span>{tool.title}</span>
                                    {tool.subFeatures && <IoChevronForward size={14} className="ms-auto" />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile: Accordion */}
              <div className="d-lg-none">
                <Accordion flush>
                  <Accordion.Item eventKey="0" className="tools-accordion-mobile">
                    <Accordion.Header>
                      <IoSettings size={20} className='navbar-buttons me-2'/> Tools
                    </Accordion.Header>
                    <Accordion.Body>
                      {Object.entries(toolsByCategory).map(([category, tools]) => (
                        <div key={category} className="mobile-category-section">
                          <h6 className="mobile-category-title">{category}</h6>
                          {tools.map(tool => {
                            const IconComponent = tool.icon;
                            const isEnabled = enabledToolIdsFromTools.has(tool.id);
                            return (
                              <div key={tool.id} className="mobile-tool-group">
                                <button 
                                  onClick={() => handleToolClick(tool.route)} 
                                  className={`mobile-tool-item ${!isEnabled ? 'disabled' : ''}`}
                                  disabled={!isEnabled}
                                >
                                  <IconComponent size={16} className="me-2" />
                                  <span>{tool.title}</span>
                                </button>
                                {tool.subFeatures && isEnabled && (
                                  <div className="mobile-subfeatures">
                                    {tool.subFeatures.map(sub => (
                                      <button
                                        key={sub.id}
                                        onClick={() => handleToolClick(sub.route)}
                                        className="mobile-subfeature-item"
                                      >
                                        <IoChevronForward size={12} className="me-2" />
                                        {sub.title}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>

              <Nav.Link as={Link} to="/about" className="nav-link" onClick={() => setShowMenu(false)}> 
                <IoInformationCircleOutline size={20} className='navbar-buttons'/> About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link" onClick={() => setShowMenu(false)}> 
                <IoCallOutline size={20} className='navbar-buttons'/> Contact Us
              </Nav.Link>

              {/* Desktop Right-side Auth Section */}
              <div className="d-none d-lg-flex align-items-center ms-lg-3 header-auth-section">
                {!isLoggedIn ? (
                  <>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2" 
                      onClick={() => { setAuthStage("login"); setShowAuthModal(true); }}
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => { setAuthStage("signup"); setShowAuthModal(true); }}
                      style={{ borderRadius: "8px", fontWeight: "600", backgroundColor: "var(--primary-color)" }}
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <div className="profile-dropdown-container">
                    <div className="profile-circle" title={userEmail}>
                      {userEmail ? userEmail[0].toUpperCase() : "U"}
                    </div>
                    <div className="profile-dropdown-menu">
                      <div className="dropdown-user-email">👤 {userEmail}</div>
                      <hr className="dropdown-divider" />
                      {byokEnabled && (
                        <button
                          className={`dropdown-item-btn gemini-btn ${hasGeminiKey ? 'key-configured' : 'key-missing'}`}
                          onClick={() => { setAuthStage("key"); setShowAuthModal(true); }}
                        >
                          {hasGeminiKey ? "Gemini Key ✓" : "Set Gemini Key ⚠️"}
                        </button>
                      )}
                      <button 
                        className="dropdown-item-btn logout-btn" 
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="outline-secondary"
                className="theme-toggle ms-lg-3 my-2 d-lg-none d-flex align-items-center"
                onClick={() => {
                  toggleTheme();
                  setShowMenu(false);
                }}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
              >
                {theme === 'dark' ? <><BsFillSunFill size={18} className='theme-buttons'/>  Light</> : <><BsFillMoonFill size={18} className='theme-buttons'/>  Dark</>}
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      
      {/* Chatbot Component */}
      <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />

      {/* Authentication and Gemini Key Modal */}
      <AuthModal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)} 
        initialStage={authStage} 
      />
    </Navbar>
  );
};

export default Header;