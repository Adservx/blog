import { supabase } from './supabase-client.js';

export async function getResources() {
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
    return data;
}

export async function createResource(resourceData) {
    const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select();

    if (error) throw error;
    return data[0];
}

export async function updateResource(id, resourceData) {
    const { data, error } = await supabase
        .from('resources')
        .update(resourceData)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data[0];
}

export async function deleteResource(id) {
    const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}
