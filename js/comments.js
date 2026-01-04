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

async function getAllComments() {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles!user_id (full_name, avatar_url),
            posts!post_id (title, slug)
        `)
        .order('created_at', { ascending: false });
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

async function deleteComment(commentId) {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
    return { error };
}

window.blogComments = { getComments, getAllComments, addComment, deleteComment };
export { getComments, getAllComments, addComment, deleteComment };
