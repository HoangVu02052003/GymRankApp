import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/auth';
import { Spinner } from 'react-bootstrap';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return children;
}
