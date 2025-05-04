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
      .select('*'); // You can specify the columns you need, but '*' works fine for now
  
    if (error) {
      throw new Error(error.message); // If there's an error, throw it with a message
    }
  
    return data;
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