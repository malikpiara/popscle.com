'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpaceNotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000); // 3 seconds delay before redirecting

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <p>Space not found, redirecting to Home...</p>
    </div>
  );
}
