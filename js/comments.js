import { supabase } from './supabase-client.js';

async function getComments(postId) {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles!user_id (full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
    return { data, error };
}

async function addComment(postId, userId, content) {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_id: userId, content }])
        .select(`
            *,
            profiles!user_id (full_name, avatar_url)
        `)
        .single();
    return { data, error };
}

window.blogComments = { getComments, addComment };
export { getComments, addComment };
