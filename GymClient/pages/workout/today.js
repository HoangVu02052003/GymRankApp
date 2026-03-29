import { useEffect, useState } from 'react';
import { Card, Alert, ProgressBar, Button, Badge } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ExerciseItem from '@/components/ExerciseItem';
import { workoutAPI } from '@/lib/api';

export default function TodayWorkout() {
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const fetchTodayWorkout = async () => {
    try {
      setLoading(true);
      const response = await workoutAPI.getTodayWorkout();
      
      if (response.data.success) {
        setTodayWorkout(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải workout');
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
        await fetchTodayWorkout();
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
        <h2 className="mb-4">Today's Workout</h2>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {todayWorkout?.workouts?.length > 0 ? (
          <>
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Progress Overview</h5>
                <div className="mb-2">
                  <span>Completed: {todayWorkout.stats.completed}/{todayWorkout.stats.total}</span>
                  <span className="float-end">{todayWorkout.stats.completionRate}%</span>
                </div>
                <ProgressBar 
                  now={todayWorkout.stats.completionRate} 
                  variant="success"
                  className="mb-2"
                />
                <p className="text-muted mb-0 small">
                  EXP earned today: {todayWorkout.stats.expEarned}
                </p>
              </Card.Body>
            </Card>

            {todayWorkout.workouts.map((workout, idx) => (
              <Card key={idx} className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{workout.lichTrinh?.tenlich}</h5>
                  <Badge bg="primary">{workout.lichTrinh?.loailich}</Badge>
                </Card.Header>
                <Card.Body>
                  {workout.exercises?.map((exercise) => (
                    <ExerciseItem
                      key={exercise._id}
                      exercise={exercise}
                      onComplete={handleCompleteExercise}
                      showComplete={true}
                    />
                  ))}
                </Card.Body>
              </Card>
            ))}
          </>
        ) : (
          <Card>
            <Card.Body className="text-center py-5">
              <h5 className="text-muted mb-3">Chưa có workout hôm nay</h5>
              <Button variant="primary" href="/schedule/create">
                Tạo lịch tập
              </Button>
            </Card.Body>
          </Card>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
