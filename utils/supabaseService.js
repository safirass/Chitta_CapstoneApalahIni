import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-public-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const supabaseService = {
  async getOrCreateUser(userUid, username, email = null) {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_uid', userUid)
        .single();

      if (existingUser) {
        console.log('✅ User found:', existingUser.id);
        return existingUser;
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            user_uid: userUid,
            username: username,
            email: email
          }
        ])
        .select()
        .single();

      if (createError) throw createError;

      console.log('✅ User created:', newUser.id);
      return newUser;
    } catch (error) {
      console.error('❌ Error with user:', error.message);
      throw error;
    }
  }
};