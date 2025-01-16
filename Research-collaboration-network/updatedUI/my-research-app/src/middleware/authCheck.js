import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Simple authentication hook
export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);
}

// Simple HOC for authentication
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
      }
    }, []);

    return <Component {...props} />;
  };
}

module.exports = { useAuth, withAuth };

