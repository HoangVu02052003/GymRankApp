import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { scheduleAPI } from '@/lib/api';

export default function CreateSchedule() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tenlich: '',
    loailich: 'custom'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await scheduleAPI.createSchedule(formData);
      
      if (response.data.success) {
        router.push(`/schedule/${response.data.lichTrinh._id}`);
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
        <h2 className="mb-4">Create Schedule</h2>

        <Card style={{ maxWidth: '600px' }}>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên lịch tập</Form.Label>
                <Form.Control
                  type="text"
                  name="tenlich"
                  value={formData.tenlich}
                  onChange={handleChange}
                  placeholder="VD: Push Day, Leg Day..."
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Loại lịch</Form.Label>
                <Form.Select
                  name="loailich"
                  value={formData.loailich}
                  onChange={handleChange}
                >
                  <option value="push">Push</option>
                  <option value="pull">Pull</option>
                  <option value="leg">Leg</option>
                  <option value="fullbody">Full Body</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo lịch'}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Hủy
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Layout>
    </ProtectedRoute>
  );
}
