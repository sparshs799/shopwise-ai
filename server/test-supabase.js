const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://wvriootpijtiazlojzcx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cmlvb3RwaWp0aWF6bG9qemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjI0ODQsImV4cCI6MjA3NjAzODQ4NH0.TpwPn-s5bmnmpNO_qgyf1o8El-gBOM67l8KxUGqvqMI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...\n');
  
  const { data, error } = await supabase.from("products").select("*");
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log(`📦 Found ${data.length} products in database:\n`);
    data.forEach((product, i) => {
      console.log(`${i + 1}. ${product.title}`);
      console.log(`   Brand: ${product.brand}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   GPU: ${product.gpu}`);
      console.log(`   CPU: ${product.cpu}`);
      console.log(`   Store: ${product.store}`);
      console.log(`   Link: ${product.link}`);
      console.log('');
    });
  }
}

testConnection();
