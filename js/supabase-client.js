import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://gutyqqbevkpbkiiivdtm.supabase.co';
const supabaseKey = 'sb_publishable_n2esemEaQiHtnLorgTKyiA_Zurxbplq';

export const supabase = createClient(supabaseUrl, supabaseKey);
window.supabaseClient = supabase; // Maintaining global access for non-module scripts if any
