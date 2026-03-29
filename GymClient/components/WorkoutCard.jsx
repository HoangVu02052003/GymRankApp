import { Card, Badge } from 'react-bootstrap';

export default function WorkoutCard({ workout, onClick }) {
  return (
    <Card 
      className="mb-3 card-hover" 
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-2">{workout.tenlich}</h5>
            <Badge bg="secondary" className="me-2">
              {workout.loailich}
            </Badge>
            {workout.createdby === 'ai' && (
              <Badge bg="info">AI Generated</Badge>
            )}
          </div>
          <div className="text-end">
            {workout.active ? (
              <Badge bg="success">Active</Badge>
            ) : (
              <Badge bg="secondary">Inactive</Badge>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
