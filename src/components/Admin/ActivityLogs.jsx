import React from "react";
import { Table, Card, Badge, Form } from "react-bootstrap";

const ActivityLogs = ({ activities, searchTerm, setSearchTerm }) => {
  const filteredActivities = activities.filter(
    (a) =>
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tool_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="font-weight-bold">Activity Logs</h3>
        <Form.Control
          type="text"
          placeholder="Search by user or tool..."
          style={{ maxWidth: "300px", borderRadius: "8px", border: "1px solid var(--border-color)" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card className="border-0 shadow-sm p-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>User</th>
              <th>Tool Used</th>
              <th>Input Tokens</th>
              <th>Output Tokens</th>
              <th>Total Tokens</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((act) => (
              <tr key={act._id}>
                <td className="text-truncate" style={{ maxWidth: "180px" }} title={act.email}>
                  {act.email}
                </td>
                <td>
                  <Badge bg="dark">{act.tool_id}</Badge>
                </td>
                <td>{act.input_tokens}</td>
                <td>{act.output_tokens}</td>
                <td>{act.total_tokens}</td>
                <td>{act.timestamp}</td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default ActivityLogs;
