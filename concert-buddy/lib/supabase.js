import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://razmfsyzqgbrjhlaqqqw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhem1mc3l6cWdicmpobGFxcXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzg4NjAsImV4cCI6MjA2MTk1NDg2MH0.DdY73GCmdHOYA6uP9jaFbModKGZX8MAFeohjcZ_kF9g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
