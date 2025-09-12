import { supabase } from '../lib/supabase';

class AuthService {
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          error: { 
            message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
          } 
        };
      }
      return { 
        error: { 
          message: 'Something went wrong during sign in. Please try again.' 
        } 
      };
    }
  }

  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          error: { 
            message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
          } 
        };
      }
      return { 
        error: { 
          message: 'Something went wrong during sign up. Please try again.' 
        } 
      };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      return { error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          error: { 
            message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
          } 
        };
      }
      return { 
        error: { 
          message: 'Something went wrong during sign out. Please try again.' 
        } 
      };
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error };
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { 
        data: null, 
        error: { message: 'Failed to load user profile' } 
      };
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { 
        data: null, 
        error: { message: 'Failed to update user profile' } 
      };
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          error: { 
            message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
          } 
        };
      }
      return { 
        error: { 
          message: 'Something went wrong. Please try again.' 
        } 
      };
    }
  }
}

export const authService = new AuthService();