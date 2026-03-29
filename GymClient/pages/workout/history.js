import { useEffect, useState } from 'react';
import { Card, Alert, Badge, Pagination } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { workoutAPI } from '@/lib/api';

export default function WorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const fetchHistory = async (page) => {
    try {
      setLoading(true);
      const response = await workoutAPI.getHistory({ page, limit: 10 });
      
      if (response.data.success) {
        setHistory(response.data.data.data);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải lịch sử');
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const items = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {items}
        <Pagination.Next 
          disabled={currentPage === pagination.totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Pagination>
    );
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
        <h2 className="mb-4">Workout History</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {history.length > 0 ? (
          <>
            {history.map((schedule) => (
              <Card key={schedule._id} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{schedule.tenlich}</h5>
                  </div>
                  <div>
                    <Badge bg="secondary">{schedule.loailich}</Badge>
                    {schedule.createdby === 'ai' && (
                      <Badge bg="info" className="ms-2">AI</Badge>
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted mb-2 small">
                    Created: {new Date(schedule.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="mb-0">
                    Total exercises: {schedule.idChiTiet?.length || 0}
                  </p>
                </Card.Body>
              </Card>
            ))}
            {renderPagination()}
          </>
        ) : (
          <Card>
            <Card.Body className="text-center py-5">
              <h5 className="text-muted">Chưa có lịch sử workout</h5>
            </Card.Body>
          </Card>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
