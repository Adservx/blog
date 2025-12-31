import { supabase } from './supabase-client.js';

async function getPaginatedPosts(page = 1, pageSize = 5, options = {}) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles!user_id (name, full_name, avatar_url, bio, expertise),
            categories (id, name, slug)
        `, { count: 'exact' });

    // Search filter
    if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
    }

    // Category filter
    if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
    }

    // Sorting
    if (options.sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);

    return { data, error, count };
}

async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select(`*, posts(count)`);
    return { data, error };
}

async function getPostBySlug(slug) {
    if (!slug) return { data: null, error: new Error('Slug is required') };
    
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!user_id (id, name, full_name, bio, avatar_url, expertise, linkedin),
            categories (name, slug)
        `)
        .eq('slug', slug)
        .maybeSingle(); 
    return { data, error };
}

async function incrementViewCount(postId) {
    const { data, error } = await supabase.rpc('increment_post_views', { post_id: postId });
    if (error) {
        // Fallback if RPC doesn't exist
        const { data: currentPost } = await supabase.from('posts').select('view_count').eq('id', postId).single();
        await supabase.from('posts').update({ view_count: (currentPost?.view_count || 0) + 1 }).eq('id', postId);
    }
}

async function getUserPosts(userId) {
    if (!userId) return { data: [], error: new Error('User ID is required') };

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data, error };
}

async function createPost(postData) {
    const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select();
    return { data, error };
}

async function updatePost(postId, postData) {
    const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)
        .select();
    return { data, error };
}

async function deletePost(postId) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
    return { error };
}

window.blogPosts = { getPaginatedPosts, getCategories, getPostBySlug, incrementViewCount, createPost, getUserPosts, updatePost, deletePost };
export { getPaginatedPosts, getCategories, getPostBySlug, incrementViewCount, createPost, getUserPosts, updatePost, deletePost };