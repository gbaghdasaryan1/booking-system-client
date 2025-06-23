import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { ComponentType, JSX } from 'react';
import { useStore } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore';

export function withAuth<T extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    const router = useRouter();
        const { token } = useStore(useAuthStore, (state) => state);
    

    useEffect(() => {
      if (!token) {
        router.replace('/login');
      }
    }, [token]);

    return <WrappedComponent {...props} />;
  };
}
