import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Card, Alert, Button, ProgressBar, Badge } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import RankBadge from '@/components/RankBadge';
import { rankAPI } from '@/lib/api';

export default function RankPage() {
  const router = useRouter();
  const [allRanks, setAllRanks] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [rankUpInfo, setRankUpInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRankData();
  }, []);

  const fetchRankData = async () => {
    try {
      setLoading(true);
      const [ranksRes, currentRes, checkRes] = await Promise.all([
        rankAPI.getAllRanks({ limit: 50 }),
        rankAPI.getCurrentRank(),
        rankAPI.checkRankUp()
      ]);

      if (ranksRes.data.success) {
        setAllRanks(ranksRes.data.data.data);
      }

      if (currentRes.data.success) {
        setCurrentRank(currentRes.data.data);
      }

      if (checkRes.data.success) {
        setRankUpInfo(checkRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải thông tin rank');
    } finally {
      setLoading(false);
    }
  };

  const handleRankUp = async () => {
    try {
      setError('');
      setSuccess('');
      
      const response = await rankAPI.rankUp();
      
      if (response.data.success) {
        setSuccess(response.data.message);
        await fetchRankData();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lên rank');
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
        <h2 className="mb-4">Rank System</h2>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Current Rank</h5>
              </Card.Header>
              <Card.Body className="text-center py-4">
                {currentRank && (
                  <>
                    <RankBadge rank={currentRank} size="lg" />
                    <p className="text-muted mt-3 mb-0">Level {currentRank.level}</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Rank Up Progress</h5>
              </Card.Header>
              <Card.Body>
                {rankUpInfo?.canRankUp ? (
                  <>
                    <Alert variant="success">
                      Bạn đủ điều kiện lên rank {rankUpInfo.nextRank?.tenrank}!
                    </Alert>
                    <Button 
                      variant="success" 
                      className="w-100"
                      onClick={handleRankUp}
                    >
                      Lên rank ngay
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="mb-2">{rankUpInfo?.message}</p>
                    {rankUpInfo?.expNeeded !== undefined && (
                      <>
                        <p className="text-muted small mb-2">
                          Cần thêm {rankUpInfo.expNeeded} EXP
                        </p>
                        <ProgressBar 
                          now={100 - (rankUpInfo.expNeeded / rankUpInfo.nextRank?.exprequired * 100)} 
                          variant="primary"
                        />
                      </>
                    )}
                    {rankUpInfo?.requireTest && (
                      <Button 
                        variant="warning" 
                        className="w-100 mt-3"
                        onClick={() => router.push('/rank/test')}
                      >
                        Làm bài kiểm tra
                      </Button>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="mb-3">All Ranks</h4>
        <Row>
          {allRanks.map((rank) => (
            <Col md={4} key={rank._id} className="mb-3">
              <Card className={currentRank?._id === rank._id ? 'border-primary' : ''}>
                <Card.Body>
                  <div className="text-center">
                    <RankBadge rank={rank} />
                    <p className="text-muted mt-2 mb-1 small">Level {rank.level}</p>
                    <p className="mb-2">{rank.exprequired} EXP</p>
                    {rank.requiretest && <Badge bg="warning" className="me-1">Test</Badge>}
                    {rank.requirevideo && <Badge bg="info">Video</Badge>}
                  </div>
                  {rank.mota && (
                    <p className="text-muted small mt-2 mb-0">{rank.mota}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Layout>
    </ProtectedRoute>
  );
}
