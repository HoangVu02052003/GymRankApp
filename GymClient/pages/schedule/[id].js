import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Alert, Badge, ProgressBar, Button } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ExerciseItem from '@/components/ExerciseItem';
import { scheduleAPI, workoutAPI } from '@/lib/api';

export default function ScheduleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [schedule, setSchedule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchScheduleDetail();
    }
  }, [id]);

  const fetchScheduleDetail = async () => {
    try {
      setLoading(true);
      const [scheduleRes, progressRes] = await Promise.all([
        scheduleAPI.getScheduleDetail(id),
        scheduleAPI.getScheduleProgress(id)
      ]);

      if (scheduleRes.data) {
        setSchedule(scheduleRes.data);
      }

      if (progressRes.data.success) {
        setProgress(progressRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết lịch tập');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExercise = async (idChiTiet) => {
    try {
      setError('');
      setSuccess('');
      
      const response = await workoutAPI.completeExercise({ idChiTiet });
      
      if (response.data.success) {
        setSuccess(`${response.data.message}. ${response.data.expResult.message}`);
        await fetchScheduleDetail();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể hoàn thành bài tập');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Button 
          variant="link" 
          className="mb-3 ps-0"
          onClick={() => router.back()}
        >
          Back
        </Button>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {schedule ? (
          <>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{schedule.tenlich}</h4>
                </div>
                <div>
                  <Badge bg="secondary" className="me-2">{schedule.loailich}</Badge>
                  {schedule.createdby === 'ai' && <Badge bg="info">AI</Badge>}
                  <Badge bg={schedule.active ? 'success' : 'secondary'} className="ms-2">
                    {schedule.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <h6 className="mb-3">Progress</h6>
                <div className="mb-2">
                  <span>Completed: {progress?.stats.completed}/{progress?.stats.total}</span>
                  <span className="float-end">{progress?.stats.completionRate}%</span>
                </div>
                <ProgressBar 
                  now={progress?.stats.completionRate || 0} 
                  variant="success"
                />
              </Card.Body>
            </Card>

            <h5 className="mb-3">Exercises</h5>
            {schedule.idChiTiet?.length > 0 ? (
              schedule.idChiTiet.map((exercise) => (
                <ExerciseItem
                  key={exercise._id}
                  exercise={exercise}
                  onComplete={handleCompleteExercise}
                  showComplete={true}
                />
              ))
            ) : (
              <Card>
                <Card.Body className="text-center py-4">
                  <p className="text-muted mb-0">Chưa có bài tập nào</p>
                </Card.Body>
              </Card>
            )}
          </>
        ) : (
          <Alert variant="warning">Không tìm thấy lịch tập</Alert>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
