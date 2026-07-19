import React, { useState } from "react";
import { Table, Card, Badge, Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ApiKeyViewer = ({ apiKey }) => {
  const [visible, setVisible] = useState(false);
  if (!apiKey) return <span className="text-muted small">Not Configured</span>;

  return (
    <div className="d-flex align-items-center" style={{ gap: "8px" }}>
      <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-color)" }}>
        {visible ? apiKey : "••••••••" + apiKey.slice(-4)}
      </span>
      <Button
        variant="link"
        size="sm"
        className="p-0 text-decoration-none"
        onClick={() => setVisible(!visible)}
        style={{ fontSize: "1rem", cursor: "pointer", color: "var(--primary-color)" }}
        title={visible ? "Hide API Key" : "Show API Key"}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </div>
  );
};

const UsersList = ({ users, searchTerm, setSearchTerm }) => {
  const filteredUsers = users.filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="font-weight-bold">Registered Users</h3>
        <Form.Control
          type="text"
          placeholder="Search by email..."
          style={{ maxWidth: "300px", borderRadius: "8px", border: "1px solid var(--border-color)" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card className="border-0 shadow-sm p-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Status</th>
              <th>BYOK Setup</th>
              <th>Gemini API Key</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.is_verified === 1 ? "success" : "warning"}>
                    {user.is_verified === 1 ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td>
                  <Badge bg={user.has_key ? "info" : "secondary"}>
                    {user.has_key ? "Key Configured" : "No Key"}
                  </Badge>
                </td>
                <td>
                  <ApiKeyViewer apiKey={user.api_key} />
                </td>
                <td>{user.created_at || "N/A"}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default UsersList;
