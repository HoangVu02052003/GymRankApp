import { Card, Button, Badge } from 'react-bootstrap';

export default function ExerciseItem({ exercise, onComplete, showComplete = true }) {
  const isCompleted = exercise.trangthai;

  return (
    <Card className={`mb-2 ${isCompleted ? 'border-success' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            <h6 className={`mb-1 ${isCompleted ? 'completed' : ''}`}>
              {exercise.idbaitap?.tenbaitap || 'Exercise'}
            </h6>
            <p className="text-muted mb-0 small">
              {exercise.sets} sets x {exercise.reps} reps
              {exercise.idbaitap?.nhomco && (
                <Badge bg="light" text="dark" className="ms-2">
                  {exercise.idbaitap.nhomco}
                </Badge>
              )}
            </p>
            {exercise.ghichu && (
              <p className="text-muted mb-0 small mt-1">
                {exercise.ghichu}
              </p>
            )}
          </div>
          
          {showComplete && !isCompleted && (
            <Button 
              variant="success" 
              size="sm"
              onClick={() => onComplete(exercise._id)}
            >
              Complete
            </Button>
          )}
          
          {isCompleted && (
            <Badge bg="success" className="ms-2">
              Completed
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
