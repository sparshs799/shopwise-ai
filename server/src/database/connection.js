/**
 * Database Connection Configuration
 * Connected to real Supabase database
 * 
 * @author Sparsh Srivastava
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with real credentials
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log(' Connected to Supabase database');

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.error(' Database connection failed:', error.message);
      return false;
    }
    console.log(' Database connection successful');
    return true;
  } catch (error) {
    console.error(' Database connection error:', error);
    return false;
  }
}

/**
 * Get Supabase client instance
 */
function getSupabase() {
  return supabase;
}

module.exports = {
  supabase,
  testConnection,
  getSupabase
};
