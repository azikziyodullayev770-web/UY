import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
}

// Client for general public access (anon)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for administrative tasks (service role) - bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
