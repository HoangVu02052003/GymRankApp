import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { authAPI } from '@/lib/api';
import { setToken, isAuthenticated } from '@/lib/auth';
import { useAuthStore } from '@/lib/store';

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({ tk: '', matkhau: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-content">
      <Card style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Đăng nhập</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tài khoản</Form.Label>
              <Form.Control
                type="text"
                name="tk"
                value={formData.tk}
                onChange={handleChange}
                placeholder="Nhập tài khoản"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="matkhau"
                value={formData.matkhau}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              Chưa có tài khoản?{' '}
              <a href="/register" className="text-primary">Đăng ký ngay</a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
