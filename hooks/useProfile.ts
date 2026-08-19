import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getProfile, updateProfile } from '@/lib/supabase/profiles';
import type { Tables, TablesUpdate } from '@/types/database.types';

type Profile = Tables<'profiles'>;

interface UseProfileState {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 현재 로그인된 사용자의 프로필을 조회하고 관리하는 Hook
 */
export const useProfile = () => {
  const { user } = useAuth();
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    loading: true,
    error: null,
  });

  // 프로필 조회
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setState({ profile: null, loading: false, error: null });
        return;
      }

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const profile = await getProfile(user.id);
        setState({ profile, loading: false, error: null });
      } catch (error) {
        setState({
          profile: null,
          loading: false,
          error: error instanceof Error ? error : new Error('프로필 조회 실패'),
        });
      }
    };

    fetchProfile();
  }, [user]);

  // 프로필 업데이트
  const updateUserProfile = async (updates: TablesUpdate<'profiles'>) => {
    if (!user) {
      throw new Error('인증 오류: 사용자를 찾을 수 없습니다.');
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const updated = await updateProfile(user.id, updates);
      setState({ profile: updated, loading: false, error: null });
      return updated;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('프로필 업데이트 실패');
      setState({ profile: state.profile, loading: false, error: err });
      throw err;
    }
  };

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    updateProfile: updateUserProfile,
  };
};
