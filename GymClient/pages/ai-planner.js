import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { aiAPI } from '@/lib/api';

export default function AIPlanner() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    days: 3,
    level: 'beginner',
    goal: 'general',
    duration: 60
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await aiAPI.generatePlan(formData);
      
      if (response.data.success) {
        setResult(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo lịch tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <h2 className="mb-4">AI Workout Planner</h2>

        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Preferences</h5>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số ngày tập / tuần</Form.Label>
                    <Form.Control
                      type="number"
                      name="days"
                      value={formData.days}
                      onChange={handleChange}
                      min={1}
                      max={7}
                      required
                    />
                    <Form.Text>1-7 ngày</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Trình độ</Form.Label>
                    <Form.Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mục tiêu</Form.Label>
                    <Form.Select
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                    >
                      <option value="general">General Fitness</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="strength">Strength</option>
                      <option value="endurance">Endurance</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Thời gian / buổi (phút)</Form.Label>
                    <Form.Control
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min={30}
                      max={180}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Đang tạo...' : 'Generate Plan'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            {result && (
              <Card>
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Plan Generated</h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="success">
                    {result.message}
                  </Alert>

                  <h6 className="mb-2">Plan Details:</h6>
                  <ul className="mb-3">
                    <li>Type: {result.plan?.type}</li>
                    <li>Days: {result.plan?.days}</li>
                    <li>Schedules created: {result.plan?.schedules?.length}</li>
                  </ul>

                  {result.recommendations && result.recommendations.length > 0 && (
                    <>
                      <h6 className="mb-2">AI Recommendations:</h6>
                      <ul className="small text-muted">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <Button 
                    variant="primary" 
                    className="w-100 mt-3"
                    onClick={() => router.push('/schedule')}
                  >
                    View My Schedules
                  </Button>
                </Card.Body>
              </Card>
            )}

            {!result && (
              <Card>
                <Card.Body className="text-center py-5">
                  <p className="text-muted">
                    Điền form bên trái để AI tạo lịch tập cho bạn
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Layout>
    </ProtectedRoute>
  );
}
