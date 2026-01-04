import { supabase } from './supabase-client.js';

async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    // If there is no error and a session is created (email confirmation disabled), redirect
    if (!error && data.session) {
        setTimeout(() => {
            window.location.href = 'profile.html?firstLogin=true';
        }, 2000);
    }
    // If there is no error but NO session (email confirmation enabled), the caller should handle showing a "check email" message

    return { data, error };
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    window.location.href = 'login.html';
    return { error };
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

async function getUserRole(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
    return data?.role || 'author';
}

async function requireAuth() {
    const session = await checkSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return session.user;
}

window.blogAuth = { signUp, signIn, signOut, getCurrentUser, requireAuth, checkSession, getUserRole };
export { signUp, signIn, signOut, getCurrentUser, requireAuth, checkSession, getUserRole };