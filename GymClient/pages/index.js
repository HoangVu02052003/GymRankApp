import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <Container className="full-height d-flex align-items-center">
      <Row className="w-100">
        <Col md={6} className="mx-auto text-center">
          <h1 className="display-3 fw-bold mb-4">Gym App</h1>
          <p className="lead mb-4">
            Level up your fitness journey with our gamified workout tracking system
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => router.push('/register')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
