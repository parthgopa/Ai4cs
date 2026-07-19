import React from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";

const ModelSettings = ({
  settings,
  setSettings,
  availableModels,
  handleModelSelect,
  handleSaveSettings,
  handleResetPricing,
}) => {
  return (
    <div>
      <h3 className="font-weight-bold mb-4">Gemini Model Configuration</h3>
      <Card className="border-0 shadow-sm p-4" style={{ backgroundColor: "var(--card-bg)", borderRadius: "12px", maxWidth: "600px" }}>
        <Form onSubmit={handleSaveSettings}>
          <Form.Group className="mb-3">
            <Form.Label className="font-weight-bold">Select Active Model</Form.Label>
            <Form.Select
              value={settings.model_version}
              onChange={handleModelSelect}
              className="form-control"
            >
              <option value="">-- Choose a Model --</option>
              {availableModels.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.displayName}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Selecting a model will auto-populate its pricing rate from Gemini documentation. You can still modify the values below.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="font-weight-bold">Model Version Name Override</Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              placeholder="e.g. gemini-3-flash-preview, gemini-2.5-flash"
              value={settings.model_version}
              onChange={(e) => setSettings({ ...settings, model_version: e.target.value })}
              required
            />
            <Form.Text className="text-muted">
              This model version name will be invoked across all AI modules.
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="font-weight-bold">Input Cost (INR per 1M Tokens)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.0001"
                  className="form-control"
                  value={settings.pricing_input_inr_per_1m}
                  onChange={(e) => setSettings({ ...settings, pricing_input_inr_per_1m: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="font-weight-bold">Output Cost (INR per 1M Tokens)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.0001"
                  className="form-control"
                  value={settings.pricing_output_inr_per_1m}
                  onChange={(e) => setSettings({ ...settings, pricing_output_inr_per_1m: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex align-items-center mt-3">
            <Button type="submit" className="btn-primary">
              Save Settings
            </Button>
            <Button variant="outline-secondary" className="ms-3" onClick={handleResetPricing}>
              Reset to Defaults
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ModelSettings;
