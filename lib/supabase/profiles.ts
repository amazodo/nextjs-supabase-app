import { createClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = Tables<'profiles'>;
type ProfileInsert = TablesInsert<'profiles'>;
type ProfileUpdate = TablesUpdate<'profiles'>;

/**
 * 사용자 프로필 조회
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }

  return data as Profile;
};

/**
 * 사용자 프로필 생성
 */
export const createProfile = async (profile: ProfileInsert) => {
  const { data, error } = await supabase.from('profiles').insert([profile]).select().single();

  if (error) {
    console.error('프로필 생성 오류:', error);
    throw error;
  }

  return data as Profile;
};

/**
 * 사용자 프로필 업데이트
 */
export const updateProfile = async (userId: string, updates: ProfileUpdate) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }

  return data as Profile;
};

/**
 * 사용자 프로필 삭제
 */
export const deleteProfile = async (userId: string) => {
  const { error } = await supabase.from('profiles').delete().eq('user_id', userId);

  if (error) {
    console.error('프로필 삭제 오류:', error);
    throw error;
  }
};

/**
 * 현재 로그인된 사용자의 프로필 조회
 */
export const getCurrentUserProfile = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('사용자 조회 오류:', authError);
    return null;
  }

  return getProfile(user.id);
};

/**
 * 현재 로그인된 사용자의 프로필 업데이트
 */
export const updateCurrentUserProfile = async (updates: ProfileUpdate) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('인증 오류: 사용자를 찾을 수 없습니다.');
  }

  return updateProfile(user.id, updates);
};
