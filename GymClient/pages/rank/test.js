import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Alert, Button, Form } from 'react-bootstrap';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { rankAPI } from '@/lib/api';

export default function RankTest() {
  const router = useRouter();
  const { idrank } = router.query;
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (idrank) {
      fetchTest();
    }
  }, [idrank]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await rankAPI.createTest({ idrank, numQuestions: 10 });
      
      if (response.data.success) {
        setTest(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo bài test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < test.questions.length) {
      setError('Vui lòng trả lời tất cả câu hỏi');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formattedAnswers = Object.entries(answers).map(([idquestion, useranswer]) => ({
        idquestion,
        useranswer
      }));

      const response = await rankAPI.submitTest({
        idrank: test.idrank,
        answers: formattedAnswers
      });

      if (response.data.success) {
        setResult(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể nộp bài');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !test) {
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

  if (result) {
    return (
      <ProtectedRoute>
        <Layout>
          <Card>
            <Card.Body className="text-center py-5">
              <h2 className={result.passed ? 'text-success' : 'text-danger'}>
                {result.passed ? 'Đậu!' : 'Trượt'}
              </h2>
              <p className="display-4 my-4">{result.score}%</p>
              <p className="text-muted mb-4">
                Đúng {result.correctanswers}/{result.totalquestions} câu
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" onClick={() => router.push('/rank')}>
                  Về trang Rank
                </Button>
                {!result.passed && (
                  <Button variant="warning" onClick={() => window.location.reload()}>
                    Thử lại
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h2 className="mb-4">Rank Test - {test?.rank}</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {test?.questions && (
          <Form onSubmit={handleSubmit}>
            {test.questions.map((question, idx) => (
              <Card key={question.id} className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">
                    Câu {idx + 1}: {question.questtion}
                  </h6>
                  {question.options.map((option, optIdx) => (
                    <Form.Check
                      key={optIdx}
                      type="radio"
                      name={`question-${question.id}`}
                      label={option.option}
                      value={option.option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mb-2"
                    />
                  ))}
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading ? 'Đang nộp bài...' : 'Nộp bài'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => router.back()}
                size="lg"
              >
                Hủy
              </Button>
            </div>
          </Form>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
