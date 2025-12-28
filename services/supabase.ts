
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://prchtveetutgosedeimc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2h0dmVldHV0Z29zZWRlaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MTM2NDUsImV4cCI6MjA4MjM4OTY0NX0.MqMHVwVYTWTm2bkGKgEPZNLbucrgDP0vDnNNJbe5Ncs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
