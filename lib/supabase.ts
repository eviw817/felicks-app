import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Supabase setup
const supabaseUrl = 'https://vgbuoxdfrbzqbqltcelz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnVveGRmcmJ6cWJxbHRjZWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTgyMzQsImV4cCI6MjA1NjU5NDIzNH0.JJdiJGHZS1yhVP_hnFAdve-VGfNBK5LmiBSMICSdkbk';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Optional: auth listener for session management
let refreshInterval: NodeJS.Timeout | null = null;

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const expiresIn = session?.expires_in ?? 3600;
    const refreshTime = (expiresIn - 60) * 1000;
    refreshInterval = setInterval(() => {
      supabase.auth.refreshSession().catch(console.error);
    }, refreshTime);
  }

  if (event === 'SIGNED_OUT' && refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
});

export { supabase };
