// Helper functions

/**
 * Converts a string to a URL-friendly slug
 * @param {string} text 
 * @returns {string}
 */
export function slugify(text) {
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
export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Common navigation initialization (legacy)
 * @param {object} session - Supabase session object
 * @param {object} authFunctions - Object containing signOut function
 */
export function initCommonNav(session, authFunctions) {
    const nav = document.getElementById('nav-links');
    if (!nav) return;

    let navHtml = '<a href="/">Home</a>';

    if (session) {
        navHtml += `
            <a href="create-post.html">New Post</a>
            <a href="profile.html">Profile</a>
            <a href="#" id="logout-btn">Logout</a>
        `;
        nav.innerHTML = navHtml;
        document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await authFunctions.signOut();
        });
    } else {
        navHtml += `
            <a href="login.html">Login</a>
            <a href="signup.html">Sign Up</a>
        `;
        nav.innerHTML = navHtml;
    }
}

export function getPostImageId(catId) {
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
export function setupMobileNav() {
    const navContainer = document.querySelector('nav');
    if (!navContainer) return;

    // Check if we already added the button
    const existingBtn = document.getElementById('mobile-menu-btn');
    const existingOverlay = document.getElementById('mobile-menu-overlay');

    const authNav = document.getElementById('auth-nav');
    if (authNav && !existingBtn) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.id = 'mobile-menu-btn';
        hamburgerBtn.className = 'btn btn-ghost btn-circle text-slate-900 lg:hidden ml-1';
        hamburgerBtn.innerHTML = `
            <i data-lucide="menu" class="w-6 h-6"></i>
        `;
        authNav.appendChild(hamburgerBtn);
        if (window.lucide) window.lucide.createIcons();
    }

    if (existingOverlay) {
        const btn = document.getElementById('mobile-menu-btn');
        if (btn) btn.onclick = () => toggleMenu();
        if (existingBtn && existingOverlay) return;
    }

    // Create Mobile Menu Overlay
    let mobileMenu = existingOverlay;
    if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu-overlay';
        mobileMenu.className = 'fixed inset-0 z-[100] lg:hidden invisible transition-all duration-300 pointer-events-none';
        mobileMenu.innerHTML = `
            <!-- Refined Backdrop -->
            <div id="mobile-menu-backdrop" class="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
            
            <!-- Professional Sidebar Panel -->
            <div id="mobile-menu-panel" class="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col pointer-events-auto border-l-2 border-slate-900 overflow-hidden">
                
                <!-- Elegant Header -->
                <div class="px-8 py-10 border-b border-slate-100 flex justify-between items-center relative z-10">
                    <div class="flex items-center gap-3">
                        <span class="bg-slate-900 text-white w-10 h-10 flex items-center justify-center font-black text-xl">V</span>
                        <div class="flex flex-col">
                            <span class="font-black text-slate-900 text-base uppercase tracking-tighter leading-none">Voltage</span>
                            <span class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Menu</span>
                        </div>
                    </div>
                </div>

                <!-- Navigation Sections -->
                <div class="flex-1 overflow-y-auto relative z-10 px-8 py-10">
                    <div class="space-y-12">
                        <!-- Main Menu -->
                        <section>
                            <h3 class="text-[10px] font-mono font-black text-blue-600 uppercase tracking-[0.3em] mb-8 border-l-4 border-blue-600 pl-4">Explore Links</h3>
                            <div id="mobile-menu-links" class="flex flex-col gap-2">
                                <!-- Links go here -->
                            </div>
                        </section>

                        <!-- Member Registry -->
                        <section>
                            <h3 class="text-[10px] font-mono font-black text-slate-300 uppercase tracking-[0.3em] mb-8 border-l-4 border-slate-200 pl-4">Account</h3>
                            <div id="mobile-auth-section" class="flex flex-col gap-4">
                                <!-- Auth items go here -->
                            </div>
                        </section>
                    </div>
                </div>

                <!-- Technical Footer -->
                <div class="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
                    <button id="close-mobile-menu" class="w-full bg-slate-900 text-white h-14 font-black uppercase text-xs tracking-widest shadow-tech hover:translate-y-[-2px] hover:shadow-tech-accent transition-all active:translate-y-0">
                        Close Menu
                    </button>
                    <div class="mt-6 flex justify-between items-center px-2">
                        <span class="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest" id="m-nav-timer">00:00:00 UTC</span>
                        <span class="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Online</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(mobileMenu);

        // Footer Timer
        setInterval(() => {
            const timer = document.getElementById('m-nav-timer');
            if (timer) timer.innerText = new Date().toISOString().substring(11, 19) + " UTC";
        }, 1000);
    }

    const btn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const panel = document.getElementById('mobile-menu-panel');
    const menuLinks = document.getElementById('mobile-menu-links');
    const menuAuth = document.getElementById('mobile-auth-section');
    const originalNav = document.getElementById('nav-links');
    const originalAuth = document.getElementById('auth-nav');

    function toggleMenu(forceClose = false) {
        const isOpen = panel.classList.contains('translate-x-0') && !forceClose;
        if (isOpen || forceClose) {
            panel.classList.replace('translate-x-0', 'translate-x-full');
            backdrop.classList.replace('opacity-100', 'opacity-0');
            document.body.classList.remove('overflow-hidden');
            setTimeout(() => mobileMenu.classList.add('invisible'), 500);
        } else {
            // Render Professional Links with Staggered Vertical Slide
            if (originalNav) {
                const links = Array.from(originalNav.querySelectorAll('a'));
                menuLinks.innerHTML = links.map((link, i) => `
                    <div class="menu-reveal-item opacity-0 transform translate-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style="transition-delay: ${i * 60}ms">
                        <a href="${link.getAttribute('href')}" class="flex items-center group py-4 gap-4">
                            <span class="text-xs font-mono font-bold text-slate-200 group-hover:text-blue-600 transition-colors">/0${i + 1}</span>
                            <span class="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">${link.innerText}</span>
                        </a>
                    </div>
                `).join('');
            }

            if (originalAuth) {
                const authClone = originalAuth.cloneNode(true);
                const dropdowns = authClone.querySelectorAll('.dropdown');
                let authHtml = '';

                dropdowns.forEach((dd, i) => {
                    const avatar = dd.querySelector('img')?.src;
                    const content = dd.querySelector('.dropdown-content');
                    if (content) {
                        const links = Array.from(content.querySelectorAll('a')).map(l => ({ text: l.innerText, href: l.getAttribute('href') }));
                        authHtml += `
                            <div class="menu-reveal-item opacity-0 transform translate-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style="transition-delay: ${(menuLinks.children.length + i) * 60}ms">
                                <div class="bg-slate-50 border border-slate-200 p-6 rounded-none relative">
                                    <div class="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
                                        <div class="w-12 h-12 bg-white border border-slate-900 p-1">
                                            <img src="${avatar}" class="w-full h-full object-cover" />
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-[9px] font-mono font-bold text-slate-400 uppercase">Profile</span>
                                            <span class="text-sm font-black text-slate-900 uppercase">Your Account</span>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-1">
                                        ${links.map(l => `<a href="${l.href}" class="py-3 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors border-b border-slate-100 last:border-0">${l.text}</a>`).join('')}
                                        <button id="sign-out-btn-mobile" class="mt-4 w-full text-[9px] font-black text-red-600 uppercase tracking-widest text-left hover:text-red-800">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                });

                const authLinks = Array.from(authClone.querySelectorAll('a')).filter(l => !l.closest('.dropdown'));
                if (authLinks.length > 0) {
                    authHtml += `<div class="flex flex-col gap-4">`;
                    authLinks.forEach((l, i) => {
                        const isSignup = l.getAttribute('href').includes('signup');
                        authHtml += `
                            <div class="menu-reveal-item opacity-0 transform translate-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style="transition-delay: ${(menuLinks.children.length + i + 1) * 60}ms">
                                <a href="${l.getAttribute('href')}" class="w-full h-14 flex items-center justify-center font-black uppercase text-xs tracking-widest ${isSignup ? 'bg-blue-600 text-white shadow-tech-accent' : 'bg-slate-900 text-white shadow-tech'}">
                                    ${l.innerText}
                                </a>
                            </div>`;
                    });
                    authHtml += `</div>`;
                }
                menuAuth.innerHTML = authHtml;

                const signOutBtn = document.getElementById('sign-out-btn-mobile');
                if (signOutBtn) {
                    signOutBtn.onclick = async () => {
                        const { signOut } = await import('./auth.js');
                        await signOut();
                    };
                }
            }

            mobileMenu.classList.remove('invisible');
            setTimeout(() => {
                panel.classList.replace('translate-x-full', 'translate-x-0');
                backdrop.classList.replace('opacity-0', 'opacity-100');
                // Trigger Vertical Revealed Sequence
                document.querySelectorAll('.menu-reveal-item').forEach(el => {
                    el.classList.remove('opacity-0', 'translate-y-6');
                });
            }, 50);
            document.body.classList.add('overflow-hidden');
        }
    }

    if (btn) btn.onclick = () => toggleMenu();
    if (closeBtn) closeBtn.onclick = () => toggleMenu();
    if (backdrop) backdrop.onclick = () => toggleMenu();
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Simple HTML Sanitizer to prevent basic XSS
 */
export function sanitizeHTML(html) {
    if (!html) return '';
    // Use DOMPurify if available (globally loaded via script tag)
    if (window.DOMPurify) {
        return window.DOMPurify.sanitize(html);
    }
    // Fallback
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

/**
 * Renders the navigation bar auth section consistently
 */
export function renderNavbar(authNavEl, navLinksEl, session, profile, signOutFn) {
    if (!authNavEl) return;

    if (session) {
        const user = session.user;
        const avatar = profile?.avatar_url || user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
        const role = profile?.role || 'author';

        authNavEl.innerHTML = `
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar border-2 border-slate-900 hover:border-blue-600">
                    <div class="w-10 h-10 rounded-full overflow-hidden">
                        <img src="${avatar}" class="w-full h-full object-cover" />
                    </div>
                </div>
                <ul tabindex="0" class="mt-4 z-[100] p-4 shadow-2xl menu menu-sm dropdown-content bg-white border border-slate-200 rounded-none w-64 text-slate-700">
                    <li class="menu-title text-[9px] font-mono font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-2">Session [${role.toUpperCase()}]</li>
                    <li><a href="profile.html" class="rounded-none py-3 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors">Profile</a></li>
                    ${(role === 'admin' || role === 'administrator' || role === 'author') ? `<li><a href="create-post.html" class="rounded-none py-3 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors">New Post</a></li>` : ''}
                    ${(role === 'admin' || role === 'administrator') ? `<li><a href="admin.html" class="rounded-none py-3 font-bold uppercase text-[10px] tracking-widest text-blue-600 border-t border-slate-100">Admin Panel</a></li>` : ''}
                    <div class="divider my-2"></div>
                    <li><button id="sign-out-btn" class="rounded-none py-3 font-bold uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-50 w-full text-left">Logout</button></li>
                </ul>
            </div>
        `;

        if (navLinksEl && (role === 'admin' || role === 'administrator' || role === 'author') && !navLinksEl.innerHTML.includes('create-post.html')) {
            const addPostLink = document.createElement('a');
            addPostLink.href = 'create-post.html';
            addPostLink.className = 'text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-widest uppercase transition-colors border-b-2 border-blue-600 pb-1';
            addPostLink.innerText = 'New Post';
            navLinksEl.appendChild(addPostLink);
        }

        const signOutBtn = document.getElementById('sign-out-btn');
        if (signOutBtn) {
            signOutBtn.onclick = async () => { await signOutFn(); };
        }
    } else {
        authNavEl.innerHTML = `
            <div class="hidden lg:flex items-center gap-4">
                <a href="login.html" class="inline-flex items-center text-[11px] font-bold text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors h-8">Login</a>
                <a href="signup.html" class="btn btn-neutral btn-sm rounded-none px-6 text-[11px] font-bold uppercase tracking-widest">Sign Up</a>
            </div>
        `;
    }

    setupMobileNav();
}

window.blogUtils = { slugify, formatDate, initCommonNav, getPostImageId, setupMobileNav, debounce, sanitizeHTML, renderNavbar };