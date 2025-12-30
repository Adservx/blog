// Helper functions

/**
 * Converts a string to a URL-friendly slug
 * @param {string} text 
 * @returns {string}
 */
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

/**
 * Formats a date string
 * @param {string} dateString 
 * @returns {string}
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Common navigation initialization
 * @param {object} session - Supabase session object
 * @param {object} authFunctions - Object containing signOut function
 */
function initCommonNav(session, authFunctions) {
    const nav = document.getElementById('nav-links');
    if (!nav) return;

    // Clear existing links except for the dashboard which is usually always present
    // but we can also just rebuild it for consistency.
    let navHtml = '<a href="index.html">DASHBOARD</a>';

    if (session) {
        navHtml += `
            <a href="create-post.html">CREATE</a>
            <a href="profile.html">PROFILE</a>
            <a href="#" id="logout-btn">LOGOUT</a>
        `;
        nav.innerHTML = navHtml;
        document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await authFunctions.signOut();
        });
    } else {
        navHtml += `
            <a href="login.html">LOGIN</a>
            <a href="signup.html">SIGN_UP</a>
        `;
        nav.innerHTML = navHtml;
    }
}

function getPostImageId(catId) {
    const id = parseInt(catId);
    const imgs = { 
        1: '1473341304170-971dccb5ac1e', // Power Systems
        2: '1517420812313-8fc54b172db1', // Electronics
        3: '1518770660439-4636190af475', // Control Systems
        4: '1508514171922-509d9c827df1', // Renewable Energy
        5: '1581092160562-40aa08e78837', // Signal Processing
        12: '1612282130134-75afc0b02c23' // Electrical Safety
    };
    return imgs[id] || '1581092160562-40aa08e78837';
}

window.blogUtils = { slugify, formatDate, initCommonNav, getPostImageId };
export { slugify, formatDate, initCommonNav, getPostImageId };
