import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function WorkoutIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push('/workout/today');
  }, [router]);

  return null;
}
