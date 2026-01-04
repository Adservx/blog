// Production Supabase Client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://gutyqqbevkpbkiiivdtm.supabase.co'
const supabaseKey = 'sb_publishable_n2esemEaQiHtnLorgTKyiA_Zurxbplq'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Log for debugging (can be removed later)
console.log('Production Supabase client initialized');