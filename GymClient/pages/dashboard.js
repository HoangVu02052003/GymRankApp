import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { profileAPI, workoutAPI, streakAPI } from '@/lib/api';
import { useProfileStore } from '@/lib/store';

export default function Dashboard() {
  const router = useRouter();
  const { profile, exp, streak, rank, setProfile, setExp, setStreak, setRank } = useProfileStore();
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [profileRes, todayRes, streakRes] = await Promise.all([
        profileAPI.getProfile(),
        workoutAPI.getTodayWorkout(),
        streakAPI.getStats()
      ]);

      if (profileRes.data.success) {
        const data = profileRes.data.data;
        setProfile(data.user);
        setExp(data.exp);
        setStreak(data.streak);
        setRank(data.rank);
      }

      if (todayRes.data.success) {
        setTodayWorkout(todayRes.data.data);
      }

      if (streakRes.data.success) {
        setStreak(streakRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
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
        <h2 className="mb-4">Dashboard</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-3">EXP</h5>
                <h2 className="text-primary">{exp?.total || 0}</h2>
                <p className="text-muted mb-2">Hôm nay: {exp?.daily || 0}/100</p>
                <ProgressBar 
                  now={(exp?.daily || 0)} 
                  max={100}
                  variant="primary"
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-3">Streak</h5>
                <h2 className="text-warning">{streak?.current || 0} ngày</h2>
                <p className="text-muted">Dài nhất: {streak?.longest || 0} ngày</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h5 className="mb-3">Rank</h5>
                <h3 className="text-success">{rank?.current?.tenrank || 'N/A'}</h3>
                {rank?.canRankUp && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => router.push('/rank')}
                  >
                    Lên rank ngay!
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Workout hôm nay</h5>
              </Card.Header>
              <Card.Body>
                {todayWorkout?.workouts?.length > 0 ? (
                  <>
                    <p className="mb-3">
                      Hoàn thành: {todayWorkout.stats.completed}/{todayWorkout.stats.total} bài tập
                    </p>
                    <ProgressBar 
                      now={todayWorkout.stats.completionRate} 
                      label={`${todayWorkout.stats.completionRate}%`}
                      variant="success"
                      className="mb-3"
                    />
                    <Button 
                      variant="primary"
                      onClick={() => router.push('/workout/today')}
                    >
                      Xem chi tiết
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">Chưa có lịch tập hôm nay</p>
                    <Button 
                      variant="outline-primary"
                      onClick={() => router.push('/schedule/create')}
                    >
                      Tạo lịch tập
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary"
                    onClick={() => router.push('/workout/today')}
                  >
                    Today Workout
                  </Button>
                  <Button 
                    variant="outline-success"
                    onClick={() => router.push('/ai-planner')}
                  >
                    AI Planner
                  </Button>
                  <Button 
                    variant="outline-info"
                    onClick={() => router.push('/schedule')}
                  >
                    My Schedules
                  </Button>
                  <Button 
                    variant="outline-warning"
                    onClick={() => router.push('/rank')}
                  >
                    View Ranks
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Layout>
    </ProtectedRoute>
  );
}
