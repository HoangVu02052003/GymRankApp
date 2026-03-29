import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Alert, Spinner } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScheduleCard from '@/components/ScheduleCard';
import { scheduleAPI } from '@/lib/api';

export default function ScheduleList() {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleAPI.getSchedules();
      
      if (response.data.success) {
        setSchedules(response.data.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách lịch tập');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    router.push(`/schedule/${id}`);
  };

  const handleToggle = async (id, active) => {
    try {
      const response = await scheduleAPI.toggleActive(id, { active });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        await fetchSchedules();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa lịch tập này?')) return;

    try {
      const response = await scheduleAPI.deleteSchedule(id);
      
      if (response.data.success) {
        setSuccess(response.data.message);
        await fetchSchedules();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa lịch tập');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">My Schedules</h2>
          <Button 
            variant="primary"
            onClick={() => router.push('/schedule/create')}
          >
            Create Schedule
          </Button>
        </div>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <ScheduleCard
              key={schedule._id}
              schedule={schedule}
              onView={handleView}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Card>
            <Card.Body className="text-center py-5">
              <h5 className="text-muted mb-3">Chưa có lịch tập</h5>
              <Button variant="primary" onClick={() => router.push('/schedule/create')}>
                Tạo lịch tập đầu tiên
              </Button>
            </Card.Body>
          </Card>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
