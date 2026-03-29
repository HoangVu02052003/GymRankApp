import { Card, Badge, Button } from 'react-bootstrap';

export default function ScheduleCard({ schedule, onView, onToggle, onDelete }) {
  return (
    <Card className="mb-3 card-hover">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="mb-2">{schedule.tenlich}</h5>
            <Badge bg="secondary" className="me-2">
              {schedule.loailich}
            </Badge>
            {schedule.createdby === 'ai' && (
              <Badge bg="info">AI</Badge>
            )}
          </div>
          <Badge bg={schedule.active ? 'success' : 'secondary'}>
            {schedule.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <p className="text-muted mb-3 small">
          Exercises: {schedule.idChiTiet?.length || 0}
        </p>

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => onView(schedule._id)}
          >
            View
          </Button>
          <Button 
            variant={schedule.active ? 'warning' : 'success'}
            size="sm"
            onClick={() => onToggle(schedule._id, !schedule.active)}
          >
            {schedule.active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(schedule._id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
