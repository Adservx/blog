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

/**
 * Initializes the mobile navigation
 */
function setupMobileNav() {
    const navContainer = document.querySelector('nav'); 
    if (!navContainer) return;

    // Check if we already added the button
    if (document.getElementById('mobile-menu-btn')) return;

    const authNav = document.getElementById('auth-nav');
    if (authNav) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.id = 'mobile-menu-btn';
        hamburgerBtn.className = 'btn btn-ghost btn-square text-slate-900 lg:hidden ml-2';
        hamburgerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;
        authNav.appendChild(hamburgerBtn);
    }

    // Create Mobile Menu Overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu-overlay';
    mobileMenu.className = 'fixed inset-0 bg-slate-900/95 z-[100] transform transition-transform duration-300 translate-x-full lg:hidden flex flex-col pt-20 px-6';
    mobileMenu.innerHTML = `
        <button id="close-mobile-menu" class="absolute top-6 right-6 btn btn-ghost btn-square text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l18 18"></path>
            </svg>
        </button>
        <div id="mobile-menu-links" class="flex flex-col gap-6 text-white text-xl font-bold uppercase tracking-widest text-center mt-10">
            <!-- Links will be injected here -->
        </div>
        <div id="mobile-auth-section" class="mt-auto mb-20 flex flex-col gap-4">
            <!-- Auth buttons will be injected here -->
        </div>
    `;
    document.body.appendChild(mobileMenu);

    const btn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-mobile-menu');
    const menuLinks = document.getElementById('mobile-menu-links');
    const menuAuth = document.getElementById('mobile-auth-section');
    const originalNav = document.getElementById('nav-links');
    const originalAuth = document.getElementById('auth-nav');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('translate-x-0');
        if (isOpen) {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        } else {
            if (originalNav) {
                menuLinks.innerHTML = originalNav.innerHTML;
                Array.from(menuLinks.children).forEach(child => {
                    child.className = 'text-white hover:text-blue-400 py-2 border-b border-slate-800 transition-colors';
                });
            }
            if (originalAuth) {
                const authClone = originalAuth.cloneNode(true);
                const burger = authClone.querySelector('#mobile-menu-btn');
                if (burger) burger.remove();
                
                // Handle the wrapper div that hides buttons on mobile (Login/Signup wrapper)
                const hiddenWrapper = authClone.querySelector('.hidden.lg\\:flex');
                if (hiddenWrapper) {
                    while (hiddenWrapper.firstChild) {
                        authClone.insertBefore(hiddenWrapper.firstChild, hiddenWrapper);
                    }
                    hiddenWrapper.remove();
                }
                
                // Process dropdowns for mobile (Profile dropdown)
                const dropdowns = authClone.querySelectorAll('.dropdown');
                dropdowns.forEach(dd => {
                     dd.classList.remove('dropdown', 'dropdown-end');
                     dd.className = 'flex flex-col items-center gap-6 w-full py-6 border-t border-slate-800 mt-4';
                     
                     // Hide the circular avatar button in mobile menu, replace with info
                     const avatarBtn = dd.querySelector('[role="button"]');
                     const avatarImg = avatarBtn ? avatarBtn.querySelector('img') : null;
                     
                     const content = dd.querySelector('.dropdown-content');
                     if (content) {
                         content.classList.remove('dropdown-content', 'shadow-2xl', 'menu-sm', 'bg-white', 'text-slate-700', 'border', 'absolute');
                         content.classList.add('w-full', 'bg-transparent', 'text-white', 'text-center', 'flex', 'flex-col', 'gap-4');
                         
                         // Add avatar image to the top of the mobile profile section
                         if (avatarImg) {
                             const largeAvatar = avatarImg.cloneNode(true);
                             largeAvatar.className = "w-20 h-20 rounded-full border-4 border-blue-600 mx-auto mb-2";
                             content.prepend(largeAvatar);
                         }

                         // Fix links inside
                         const links = content.querySelectorAll('a');
                         links.forEach(l => {
                             l.className = 'text-white text-xl font-bold uppercase tracking-widest hover:text-blue-400 py-2 transition-colors';
                         });
                         
                         const btns = content.querySelectorAll('button');
                         btns.forEach(b => {
                             b.className = 'text-red-500 text-xl font-black uppercase tracking-[0.2em] mt-4 hover:text-red-400 py-2 transition-colors';
                         });

                         // Remove titles/dividers that don't look good in mobile menu
                         const extras = content.querySelectorAll('.menu-title, .divider');
                         extras.forEach(e => e.remove());
                     }
                     
                     if (avatarBtn) avatarBtn.remove();
                });
                
                // Process normal links (Sign In / Join)
                const links = authClone.querySelectorAll('a');
                links.forEach(l => {
                    if (!l.closest('.flex-col')) { // Only process buttons not already handled in dropdowns
                        l.classList.remove('hidden', 'lg:flex', 'lg:block', 'md:flex', 'md:block', 'sm:flex', 'sm:block');
                        l.className = 'text-white text-xl font-bold uppercase tracking-widest btn btn-outline border-white hover:bg-white hover:text-slate-900 w-full h-16 rounded-none mb-4';
                        if (l.getAttribute('href') === 'signup.html') {
                            l.className = 'text-white text-xl font-bold uppercase tracking-widest btn btn-primary w-full h-16 rounded-none mb-4';
                        }
                    }
                });

                menuAuth.innerHTML = authClone.innerHTML;
                 
                const signOutBtn = menuAuth.querySelector('#sign-out-btn');
                if (signOutBtn) {
                    signOutBtn.onclick = async () => {
                         const { signOut } = await import('./auth.js');
                         await signOut();
                    };
                }
            }

            mobileMenu.classList.add('translate-x-0');
            mobileMenu.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden');
        }
    }

    if (btn) btn.onclick = toggleMenu;
    closeBtn.onclick = toggleMenu;
}

window.blogUtils = { slugify, formatDate, initCommonNav, getPostImageId, setupMobileNav };
export { slugify, formatDate, initCommonNav, getPostImageId, setupMobileNav };
