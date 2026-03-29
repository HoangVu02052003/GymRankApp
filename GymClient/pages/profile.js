import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { profileAPI } from '@/lib/api';
import { useProfileStore } from '@/lib/store';

export default function Profile() {
  const { profile, exp, streak, rank } = useProfileStore();
  const [formData, setFormData] = useState({
    ten: '',
    tuoi: '',
    gioitinh: 'Nam',
    chieucao: '',
    cannang: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.data.success) {
        const data = response.data.data;
        const thongtin = data.thongtin;
        
        setFormData({
          ten: thongtin?.ten || '',
          tuoi: thongtin?.tuoi || '',
          gioitinh: thongtin?.gioitinh || 'Nam',
          chieucao: thongtin?.chieucao || '',
          cannang: thongtin?.cannang || ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ten: formData.ten,
        tuoi: formData.tuoi ? parseInt(formData.tuoi) : undefined,
        gioitinh: formData.gioitinh,
        chieucao: formData.chieucao ? parseFloat(formData.chieucao) : undefined,
        cannang: formData.cannang ? parseFloat(formData.cannang) : undefined
      };

      const response = await profileAPI.updateProfile(updateData);
      
      if (response.data.success) {
        setSuccess('Cập nhật thông tin thành công');
        setEditing(false);
        await fetchProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <h2 className="mb-4">Profile</h2>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Thông tin cá nhân</h5>
                  {!editing && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="ten"
                      value={formData.ten}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tuổi</Form.Label>
                        <Form.Control
                          type="number"
                          name="tuoi"
                          value={formData.tuoi}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                          name="gioitinh"
                          value={formData.gioitinh}
                          onChange={handleChange}
                          disabled={!editing}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Chiều cao (cm)</Form.Label>
                        <Form.Control
                          type="number"
                          name="chieucao"
                          value={formData.chieucao}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cân nặng (kg)</Form.Label>
                        <Form.Control
                          type="number"
                          name="cannang"
                          value={formData.cannang}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {editing && (
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => {
                          setEditing(false);
                          fetchProfile();
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <h6 className="text-muted mb-2">Total EXP</h6>
                <h3 className="text-primary">{exp?.total || 0}</h3>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <h6 className="text-muted mb-2">Current Streak</h6>
                <h3 className="text-warning">{streak?.current || 0} ngày</h3>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h6 className="text-muted mb-2">Rank</h6>
                <h4 className="text-success">{rank?.current?.tenrank || 'N/A'}</h4>
                {rank?.current?.xacthuc && (
                  <span className="badge bg-info">Đã xác thực</span>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Layout>
    </ProtectedRoute>
  );
}
