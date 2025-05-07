const supabase = require('../supabase/supabaseClient')

class userService {
  static async updateProfile(id, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: id,
        ...profileData,
        updated_at: new Date()
      })
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getEmail(id) {
    const { data, error } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', id)
  
    if (error) throw new Error(error.message);
    return data?.email;
  }
  
  static async getProfile(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = userService;