import React from "react";
import { Nav, Button } from "react-bootstrap";
import { FaUsers, FaHistory, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab, adminEmail, handleAdminLogout }) => {
  const menuItems = [
    { id: "users", label: "Users List", icon: <FaUsers /> },
    { id: "activities", label: "Activity Logs", icon: <FaHistory /> },
    { id: "stats", label: "Token Usage & Cost", icon: <FaChartBar /> },
    { id: "settings", label: "Model Settings", icon: <FaCog /> },
  ];

  return (
    <div
      style={{
        width: "280px",
        backgroundColor: "var(--card-bg)",
        borderRight: "1px solid var(--border-color)",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.02)",
      }}
    >
      <div>
        <div className="mb-4 text-center">
          <h4
            className="font-weight-bold"
            style={{
              color: "var(--primary-color)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: "1.3rem",
            }}
          >
            AI4CS Admin
          </h4>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #6c757d)" }}>
            Management Portal
          </span>
        </div>
        <Nav className="flex-column" style={{ gap: "8px" }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Nav.Link
                key={item.id}
                active={isActive}
                onClick={() => setActiveTab(item.id)}
                style={{
                  borderRadius: "8px",
                  color: isActive ? "#ffffff" : "var(--text-color)",
                  backgroundColor: isActive ? "var(--primary-color)" : "transparent",
                  fontWeight: "600",
                  padding: "0.8rem 1.2rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.25s ease",
                  boxShadow: isActive ? "0 4px 12px rgba(11, 94, 215, 0.25)" : "none",
                }}
                className="admin-sidebar-link"
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
        <div
          className="small mb-3 text-truncate"
          style={{ color: "var(--text-color)", opacity: 0.7 }}
          title={adminEmail}
        >
          Active Admin: <br />
          <strong>{adminEmail}</strong>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          className="w-100 d-flex align-items-center justify-content-center"
          style={{
            borderRadius: "8px",
            gap: "8px",
            padding: "0.5rem",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onClick={handleAdminLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
