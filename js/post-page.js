import { checkSession, signOut } from './auth.js';
import { getPostBySlug, incrementViewCount } from './posts.js';
import { getComments, addComment } from './comments.js';
import { getProfile } from './profiles.js';
import { formatDate, getPostImageId, renderNavbar, sanitizeHTML } from './utils.js';

export async function initPostPage() {
    try {
        console.log('Post Page Initializing...');
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (!slug) {
            renderErrorMessage('Error: Missing Identifier', 'No slug provided in the URL.');
            return;
        }

        const authNav = document.getElementById('auth-nav');
        const navLinks = document.getElementById('nav-links');
        const session = await checkSession();
        let profile = null;

        if (session) {
            try {
                const { data } = await getProfile(session.user.id);
                profile = data;
            } catch (e) {
                console.error('Profile fetch failed:', e);
            }
        }

        renderNavbar(authNav, navLinks, session, profile, signOut);
        await renderPost(session ? session.user : null, slug);
    } catch (err) {
        console.error('Core Init Failed:', err);
        renderErrorMessage('System Error', err.message);
    }
}

function renderErrorMessage(title, msg) {
    const container = document.getElementById('post-content');
    if (container) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-6 py-24 text-center">
                <h1 class="text-3xl font-black uppercase mb-4 text-red-600">${sanitizeHTML(title)}</h1>
                <p class="font-mono text-[10px] uppercase text-slate-400 mb-8">${sanitizeHTML(msg)}</p>
                <a href="index.html" class="btn btn-neutral rounded-none">Return Home</a>
            </div>`;
    }
}

async function renderPost(user, slug) {
    const container = document.getElementById('post-content');
    try {
        const { data: post, error } = await getPostBySlug(slug);
        if (error) throw error;
        if (!post) {
            renderErrorMessage('Article Not Found', 'The requested slug does not exist in our database.');
            return;
        }

        await incrementViewCount(post.id);
        const authorName = post.profiles?.full_name || post.profiles?.name || 'Staff Writer';
        const contentImage = post.content?.match(/<img[^>]+src="([^">]+)"/)?.[1];
        const mdImage = post.content?.match(/!\[.*?\]\((.*?)\)/)?.[1];
        const headerImage = post.featured_image || contentImage || mdImage || ('https://images.unsplash.com/photo-' + getPostImageId(post.category_id || post.categories?.id) + '?auto=format&fit=crop&q=80&w=2000');

        container.innerHTML = `
            <article class="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-24">
                <div class="flex items-center gap-4 mb-6 md:mb-10">
                    <span class="bg-blue-600 text-white px-2 py-1 font-mono text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-blue-500">${post.categories?.name || 'General'}</span>
                </div>
                <h1 class="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-12 leading-[1.1] break-words">${sanitizeHTML(post.title)}</h1>
                
                <a href="profile.html?id=${post.user_id}" class="flex flex-wrap items-center gap-4 md:gap-6 mb-10 md:mb-16 py-6 md:py-8 border-y-2 border-slate-900 group/author hover:bg-slate-50 transition-colors">
                    <div class="w-12 h-12 md:w-16 md:h-16 border-2 border-slate-900 p-0.5 md:p-1 shrink-0 rounded-full overflow-hidden group-hover/author:border-blue-600 transition-colors">
                        <img src="${post.profiles?.avatar_url || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.profiles?.id)}" class="w-full h-full object-cover" />
                    </div>
                    <div class="min-w-0">
                        <span class="text-[8px] md:text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-0.5">Author</span>
                        <h4 class="text-lg md:text-xl font-black uppercase truncate group-hover/author:text-blue-600 group-hover/author:underline underline-offset-4 transition-all">${sanitizeHTML(authorName)}</h4>
                        <span class="text-[8px] md:text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest">${sanitizeHTML(post.profiles?.expertise || 'Field Engineer')}</span>
                    </div>
                    <div class="ml-auto text-right hidden sm:flex flex-col items-end gap-3">
                        <div>
                            <span class="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest block mb-1">Published On</span>
                            <span class="text-sm font-bold uppercase">${formatDate(post.created_at)}</span>
                        </div>
                        <button id="download-pdf-btn" class="btn btn-xs btn-outline border-2 border-slate-900 rounded-none font-black uppercase text-[8px] tracking-widest h-8 px-4 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Save as PDF
                        </button>
                    </div>
                </div>

                <img src="${headerImage}" 
                     onerror="this.src='https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000'"
                     class="w-full aspect-video md:aspect-[21/9] object-cover mb-10 md:mb-16 border border-slate-100 shadow-tech">
                <div class="prose-content markdown-body mb-20">${sanitizeHTML(post.content)}</div>

                <!-- Technical Bio Section -->
                <section class="mt-24 p-10 border-2 border-slate-900 bg-slate-50 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-slate-100 -mr-16 -mt-16 rotate-45"></div>
                    <h3 class="text-[10px] font-mono font-black tracking-[0.3em] text-slate-400 uppercase mb-6">About the Author</h3>
                    <div class="flex flex-col md:flex-row gap-10 items-start">
                        <div class="space-y-4 flex-1">
                            <p class="text-lg font-medium text-slate-700 leading-relaxed italic">"${sanitizeHTML(post.profiles?.bio || 'Author bio coming soon.')}"</p>
                            <div class="flex gap-4">
                                <a href="profile.html?id=${post.profiles?.id}" class="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View Profile</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mt-24 border-t-4 border-slate-900 pt-16">
                    <h3 class="text-3xl font-black uppercase mb-12">Comments</h3>
                    <div id="comments-list" class="space-y-12"></div>
                    
                    ${user ? `
                    <div class="mt-16 border-2 border-slate-900 p-8">
                        <h4 class="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-6">Leave a Comment</h4>
                        <form id="comment-form" class="space-y-6">
                            <textarea id="comment-content" class="textarea textarea-bordered w-full h-32 rounded-none border-2 border-slate-900 font-bold" placeholder="Share your thoughts..." required></textarea>
                            <button type="submit" class="btn btn-neutral rounded-none font-black uppercase tracking-widest text-[10px]">Post Comment</button>
                        </form>
                    </div>
                    ` : `
                    <div class="mt-16 p-8 border-2 border-dashed border-slate-200 text-center">
                        <p class="text-slate-400 font-bold uppercase text-sm mb-4">Please sign in to comment.</p>
                        <a href="login.html" class="btn btn-neutral btn-sm rounded-none px-8 font-black text-[10px] uppercase">Login</a>
                    </div>`
            }
                </section>
            </article>
        `;

        if (user) {
            const commentForm = document.getElementById('comment-form');
            if (commentForm) {
                commentForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const content = document.getElementById('comment-content').value;
                    const submitBtn = commentForm.querySelector('button');
                    submitBtn.disabled = true;

                    const { error } = await addComment(post.id, user.id, content);
                    if (error) {
                        alert('Post Failed: ' + error.message);
                        submitBtn.disabled = false;
                    } else {
                        document.getElementById('comment-content').value = '';
                        await renderComments(post.id);
                        submitBtn.disabled = false;
                    }
                };
            }
        }

        const pdfBtn = document.getElementById('download-pdf-btn');
        if (pdfBtn) {
            pdfBtn.onclick = async (e) => {
                const btn = e.currentTarget;
                const originalBtnContent = btn.innerHTML;

                try {
                    if (typeof window.html2pdf === 'undefined') throw new Error('PDF Engine not ready.');
                    btn.disabled = true;
                    btn.innerHTML = 'Compiling...';

                    const articleInner = document.querySelector('article').innerHTML;
                    const pdfTemplate = [
                        '<div style="font-family: Arial, sans-serif; color: #1a1a1a; margin: 40px; line-height: 1.6;">',
                        '<h1 style="font-size: 28pt; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; border-bottom: 4px solid #000; padding-bottom: 10px;">' + sanitizeHTML(post.title) + '</h1>',
                        '<div style="font-size: 10pt; font-weight: bold; color: #666; margin-bottom: 40px; text-transform: uppercase;">Published by ' + sanitizeHTML(authorName) + ' | ' + formatDate(post.created_at) + '</div>',
                        '<div class="prose-content">' + articleInner + '</div>',
                        '</div>'
                    ].join('');

                    const opt = {
                        margin: [10, 10],
                        filename: (post.slug || 'article') + '.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, logging: false },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };

                    await window.html2pdf().set(opt).from(pdfTemplate).save();
                } catch (err) {
                    console.error('PDF Error:', err);
                    alert('Download Failed.');
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = originalBtnContent;
                }
            };
        }

        await renderComments(post.id);
    } catch (err) {
        console.error('Render error:', err);
        container.innerHTML = `<div class="p-10 text-red-500">Error rendering article: ${err.message}</div>`;
    }
}

async function renderComments(postId) {
    const list = document.getElementById('comments-list');
    if (!list) return;

    try {
        const { data: comments, error } = await getComments(postId);
        if (error) throw error;

        if (comments && comments.length > 0) {
            list.innerHTML = comments.map(c => {
                const avatarUrl = c.profiles?.avatar_url || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + c.user_id);
                const cAuthor = sanitizeHTML(c.profiles?.full_name || 'Anonymous Staff');
                const cBody = sanitizeHTML(c.content);
                const cDate = formatDate(c.created_at);

                return `
                <div class="border-b border-slate-100 pb-8 last:border-0 hover:bg-slate-50 transition-colors px-2 -mx-2">
                    <div class="flex items-center gap-3 mb-4">
                        <a href="profile.html?id=${c.user_id}" class="flex items-center gap-3 group/author">
                            <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 group-hover/author:border-blue-600 transition-colors">
                                <img src="${avatarUrl}" class="w-full h-full object-cover" />
                            </div>
                            <span class="text-[11px] font-black uppercase tracking-widest group-hover/author:text-blue-600 transition-colors">${cAuthor}</span>
                        </a>
                        <span class="text-[9px] font-mono text-slate-300 ml-auto">${cDate}</span>
                    </div>
                    <p class="text-base sm:text-lg font-bold text-slate-700 leading-relaxed uppercase">${cBody}</p>
                </div>`;
            }).join('');
        } else {
            list.innerHTML = '<p class="text-slate-400 font-mono text-xs uppercase tracking-widest">No comments yet.</p>';
        }
    } catch (err) {
        console.error('Comments Error:', err);
        list.innerHTML = '<p class="text-red-400 font-mono text-xs uppercase tracking-widest">Comments loading failure.</p>';
    }
}
