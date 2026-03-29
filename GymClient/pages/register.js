import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { authAPI } from '@/lib/api';
import { setToken, isAuthenticated } from '@/lib/auth';
import { useAuthStore } from '@/lib/store';

export default function Register() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    tk: '',
    matkhau: '',
    confirmPassword: '',
    ten: '',
    tuoi: '',
    gioitinh: 'Nam',
    chieucao: '',
    cannang: ''
  });
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

    if (formData.matkhau !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const thongtinData = {
        ten: registerData.ten,
        tuoi: registerData.tuoi ? parseInt(registerData.tuoi) : undefined,
        gioitinh: registerData.gioitinh,
        chieucao: registerData.chieucao ? parseFloat(registerData.chieucao) : undefined,
        cannang: registerData.cannang ? parseFloat(registerData.cannang) : undefined
      };

      const response = await authAPI.register({
        tk: registerData.tk,
        matkhau: registerData.matkhau,
        thongtinData
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-content">
      <Card style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Đăng ký</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tài khoản</Form.Label>
              <Form.Control
                type="text"
                name="tk"
                value={formData.tk}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="matkhau"
                    value={formData.matkhau}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tuổi</Form.Label>
                  <Form.Control
                    type="number"
                    name="tuoi"
                    value={formData.tuoi}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Chiều cao (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="chieucao"
                    value={formData.chieucao}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cân nặng (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cannang"
                    value={formData.cannang}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="gioitinh"
                value={formData.gioitinh}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Form.Select>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              Đã có tài khoản?{' '}
              <a href="/login" className="text-primary">Đăng nhập</a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
