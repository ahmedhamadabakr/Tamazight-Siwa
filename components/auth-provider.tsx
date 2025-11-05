'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

function SessionRefresher() {
  const { update } = useSession();

  useEffect(() => {
    let timeout: any;
    const safeUpdate = () => {
      clearTimeout(timeout);
      // Debounce a little to avoid bursts on rapid events
      timeout = setTimeout(() => {
        update().catch(() => {});
      }, 100);
    };

    const onFocus = () => safeUpdate();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') safeUpdate();
    };
    const onOnline = () => safeUpdate();

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', onOnline);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
      clearTimeout(timeout);
    };
  }, [update]);

  return null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <SessionRefresher />
      {children}
    </SessionProvider>
  );
}
