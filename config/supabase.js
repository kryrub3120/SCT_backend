const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Błąd: SUPABASE_URL lub SUPABASE_ANON_KEY nie zostały ustawione w .env!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;