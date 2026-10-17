import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://cnmikcyvyamplbldiivp.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNubWlrY3l2eWFtcGxibGRpaXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzY0MDEsImV4cCI6MjEwNTgxMjQwMX0.h4nOvb0GWz92A_GuH-RPX90wUIRvza4RvsD9TA-XiM0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const STORAGE_KEYS = {
  REPORTS: 'parishkar_reports_v2',
  FOLLOWED_CASES: 'parishkar_followed_cases',
  OFFLINE_QUEUE: 'parishkar_offline_queue',
  DAYLIGHT: 'parishkar_daylight',
  LANG: 'parishkar_lang',
  PARTNER_ORDERS: 'parishkar_partner_orders'
};
