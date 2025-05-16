import 'react-native-url-polyfill/auto'


import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';


const {
  supabaseUrl,
  supabaseAnonKey,
} = Constants.expoConfig!.extra as {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
