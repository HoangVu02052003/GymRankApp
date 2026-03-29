import { Card } from 'react-bootstrap';

export default function StreakCounter({ streak }) {
  if (!streak) return null;

  return (
    <Card>
      <Card.Body>
        <div className="text-center">
          <div className="display-4 mb-2">🔥</div>
          <h3 className="text-warning mb-1">{streak.currentstreak || 0}</h3>
          <p className="text-muted mb-0">ngày streak</p>
          <small className="text-muted">
            Dài nhất: {streak.longeststreak || 0} ngày
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}
