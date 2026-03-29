import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import { logout } from '@/lib/auth';

export default function Layout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/" className="fw-bold">
            Gym App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            {isAuthenticated ? (
              <>
                <Nav className="me-auto">
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link href="/workout/today">Workout</Nav.Link>
                  <Nav.Link href="/schedule">Schedule</Nav.Link>
                  <Nav.Link href="/rank">Rank</Nav.Link>
                  <Nav.Link href="/ai-planner">AI Planner</Nav.Link>
                </Nav>
                <Nav>
                  <NavDropdown title={user?.tk || 'User'} align="end">
                    <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mb-5">
        {children}
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <Container>
          <p className="mb-0">Gym App 2026 - Level Up Your Fitness</p>
        </Container>
      </footer>
    </>
  );
}
