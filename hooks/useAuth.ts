'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UseAuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 현재 로그인된 사용자 정보를 조회하는 Hook
 */
export const useAuth = () => {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          setState({ user: null, loading: false, error });
        } else {
          setState({ user: data.user, loading: false, error: null });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: error instanceof Error ? error : new Error('인증 정보 조회 실패'),
        });
      }
    };

    getUser();
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
  };
};
