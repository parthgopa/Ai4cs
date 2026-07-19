import React from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { FaUsers, FaHistory, FaCoins, FaDatabase } from "react-icons/fa";

const TokenStats = ({ stats }) => {
  return (
    <div>
      <h3 className="font-weight-bold mb-4">Token Consumption & Costing</h3>

      {/* Global Metrics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 text-center border-0 shadow-sm mb-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
            <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: "8px" }}>
              <FaUsers style={{ color: "var(--primary-color)", fontSize: "1.2rem" }} />
              <span className="text-muted small">Total Users</span>
            </div>
            <h2 className="font-weight-bold mt-1" style={{ color: "var(--primary-color)" }}>
              {stats.totals?.total_users || 0}
            </h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center border-0 shadow-sm mb-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
            <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: "8px" }}>
              <FaHistory style={{ color: "var(--primary-color)", fontSize: "1.2rem" }} />
              <span className="text-muted small">Total Interactions</span>
            </div>
            <h2 className="font-weight-bold mt-1" style={{ color: "var(--primary-color)" }}>
              {stats.totals?.total_activities || 0}
            </h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center border-0 shadow-sm mb-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
            <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: "8px" }}>
              <FaDatabase style={{ color: "var(--primary-color)", fontSize: "1.2rem" }} />
              <span className="text-muted small">Total Tokens Used</span>
            </div>
            <h2 className="font-weight-bold mt-1" style={{ color: "var(--primary-color)" }}>
              {stats.totals?.total_tokens || 0}
            </h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center border-0 shadow-sm mb-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
            <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: "8px" }}>
              <FaCoins style={{ color: "var(--success-color, #198754)", fontSize: "1.2rem" }} />
              <span className="text-muted small">Total Cost (INR)</span>
            </div>
            <h2 className="font-weight-bold mt-1" style={{ color: "var(--success-color, #198754)" }}>
              ₹{stats.totals?.total_cost_inr || 0}
            </h2>
          </Card>
        </Col>
      </Row>

      {/* Users List with Cost Breakdown */}
      <Card className="border-0 shadow-sm p-3" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px" }}>
        <h5 className="font-weight-bold mb-3">User Breakdown</h5>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Interactions</th>
              <th>Input Tokens</th>
              <th>Output Tokens</th>
              <th>Total Tokens</th>
              <th>Estimated Cost (INR)</th>
            </tr>
          </thead>
          <tbody>
            {stats.user_stats?.map((stat, idx) => (
              <tr key={idx}>
                <td>{stat.email}</td>
                <td>{stat.activity_count}</td>
                <td>{stat.input_tokens}</td>
                <td>{stat.output_tokens}</td>
                <td>{stat.total_tokens}</td>
                <td className="font-weight-bold" style={{ color: "var(--success-color, #198754)" }}>
                  ₹{stat.cost_inr}
                </td>
              </tr>
            ))}
            {(!stats.user_stats || stats.user_stats.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No token logs available yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default TokenStats;
