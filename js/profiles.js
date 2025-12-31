import { supabase } from './supabase-client.js';

async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
}

async function updateProfile(profileData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            ...profileData,
            updated_at: new Date().toISOString(),
        })
        .select();
    
    return { data, error };
}

window.blogProfiles = { getProfile, updateProfile };
export { getProfile, updateProfile };
