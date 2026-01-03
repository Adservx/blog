// MOCK DATA & CLIENT FOR LOCAL DEVELOPMENT
// This replaces the actual Supabase client to prevent "ERR_NAME_NOT_RESOLVED" errors
// and provides a fully functional offline/demo mode.

const MOCK_DATA = {
    profiles: [
        {
            id: 'imserv_user_01',
            name: 'imserv67',
            full_name: 'Lead Engineer',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=imserv67',
            bio: 'Principal investigator at Imserv Engineering. specialized in high-voltage infrastructure and renewable energy systems.',
            expertise: 'Electrical Infrastructure',
            linkedin: '#'
        }
    ],
    categories: [
        { id: 1, name: 'Power Systems', slug: 'power-systems' },
        { id: 2, name: 'Electronics', slug: 'electronics' },
        { id: 3, name: 'Control Systems', slug: 'control-systems' },
        { id: 4, name: 'Renewable Energy', slug: 'renewable-energy' },
        { id: 5, name: 'Signal Processing', slug: 'signal-processing' }
    ],
    posts: [
        {
            id: 1,
            title: 'Optimizing Grid Stability with Solid-State Transformers',
            slug: 'optimizing-grid-stability-sst',
            content: 'Solid-State Transformers (SSTs) are emerging as a critical component in the modern smart grid...',
            excerpt: 'Exploring the role of SSTs in enhancing distribution network resilience.',
            category_id: 1,
            user_id: 'imserv_user_01',
            created_at: '2025-10-15T09:00:00Z',
            view_count: 1420,
            featured_image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200'
        },
        {
            id: 2,
            title: 'Gallium Nitride (GaN) vs Silicon Carbide (SiC) in EV Chargers',
            slug: 'gan-vs-sic-ev-chargers',
            content: 'Wide-bandgap semiconductors are revolutionizing power electronics...',
            excerpt: 'A comparative analysis of efficiency and thermal performance in automotive applications.',
            category_id: 2,
            user_id: 'imserv_user_01',
            created_at: '2025-11-02T14:30:00Z',
            view_count: 980,
            featured_image: 'https://images.unsplash.com/photo-1517420812313-8fc54b172db1?auto=format&fit=crop&q=80&w=1200'
        },
        {
            id: 3,
            title: 'Advanced SCADA Systems for Substation Automation',
            slug: 'scada-substation-automation',
            content: 'Modern substations require high-speed data acquisition and supervisory control...',
            excerpt: 'Implementing IEC 61850 protocols for enhanced grid intelligence and remote operation.',
            category_id: 3,
            user_id: 'imserv_user_01',
            created_at: '2025-11-15T10:20:00Z',
            view_count: 745,
            featured_image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200'
        },
        {
            id: 4,
            title: 'Harvesting Kinetic Energy: Piezoelectric Advancements',
            slug: 'kinetic-energy-piezoelectric',
            content: 'Micro-scale energy harvesting is becoming viable for low-power IoT sensors...',
            excerpt: 'Analyzing the conversion efficiency of new synthetic piezoelectric crystals in industrial environments.',
            category_id: 4,
            user_id: 'imserv_user_01',
            created_at: '2025-12-01T08:45:00Z',
            view_count: 1230,
            featured_image: 'https://images.unsplash.com/photo-1508514171922-509d9c827df1?auto=format&fit=crop&q=80&w=1200'
        },
        {
            id: 5,
            title: 'Wavelet Transforms in Power Quality Analysis',
            slug: 'wavelet-transforms-power-quality',
            content: 'Detecting transient disturbances in power systems requires more than standard Fourier analysis...',
            excerpt: 'Utilizing multi-resolution analysis to identify sub-cycle voltage sags and harmonic distortions.',
            category_id: 5,
            user_id: 'imserv_user_01',
            created_at: '2025-12-12T16:30:00Z',
            view_count: 412,
            featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
        },
        {
            id: 6,
            title: 'Arc Flash Safety: Implementing NFPA 70E Standards',
            slug: 'arc-flash-safety-nfpa70e',
            content: 'Protecting personnel from thermal energy released during a fault is a primary design concern...',
            excerpt: 'Practical implementation of boundary calculations and PPE selection for high-voltage switchgear.',
            category_id: 1,
            user_id: 'imserv_user_01',
            created_at: '2025-12-20T11:00:00Z',
            view_count: 2150,
            featured_image: 'https://images.unsplash.com/photo-1612282130134-75afc0b02c23?auto=format&fit=crop&q=80&w=1200'
        },
        {
            id: 7,
            title: 'V2G (Vehicle-to-Grid) Implementation Challenges',
            slug: 'v2g-implementation-challenges',
            content: 'Electric vehicles can act as mobile energy storage units for the grid...',
            excerpt: 'Technical barriers in bidirectional charging infrastructure and battery degradation modeling.',
            category_id: 4,
            user_id: 'imserv_user_01',
            created_at: '2025-12-28T09:15:00Z',
            view_count: 890,
            featured_image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200'
        }
    ],
    comments: JSON.parse(localStorage.getItem('mock_comments') || '[]')
};

// --- Mock Client Implementation ---

class MockSupabaseClient {
    constructor() {
        this.auth = {
            getUser: async () => {
                const user = JSON.parse(localStorage.getItem('mock_user'));
                return { data: { user: user || null }, error: null };
            },
            getSession: async () => {
                const user = JSON.parse(localStorage.getItem('mock_user'));
                const session = user ? {
                    access_token: 'mock_token',
                    user: user
                } : null;
                return { data: { session }, error: null };
            },
            signInWithPassword: async ({ email, password }) => {
                // If email matches the real user, use their ID
                const isRealUser = email === 'imserv67@gmail.com';
                const user = {
                    id: isRealUser ? 'imserv_user_01' : 'user_' + Math.random().toString(36).substr(2, 9),
                    email: email || 'imserv67@gmail.com',
                    user_metadata: {
                        avatar_url: isRealUser ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=imserv67' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
                        full_name: isRealUser ? 'Lead Engineer' : email.split('@')[0]
                    }
                };
                localStorage.setItem('mock_user', JSON.stringify(user));
                return {
                    data: { user, session: { access_token: 'mock_token', user } },
                    error: null
                };
            },
            signUp: async ({ email, password, options }) => {
                const user = {
                    id: 'user_' + Math.random().toString(36).substr(2, 9),
                    email: email,
                    user_metadata: options?.data || {}
                };
                localStorage.setItem('mock_user', JSON.stringify(user));
                return {
                    data: { user, session: { access_token: 'mock_token', user } },
                    error: null
                };
            },
            signOut: async () => {
                localStorage.removeItem('mock_user');
                return { error: null };
            },
            onAuthStateChange: (callback) => {
                return { data: { subscription: { unsubscribe: () => { } } } };
            }
        };

        this.storage = {
            from: () => ({
                upload: async () => ({ error: null }),
                getPublicUrl: (path) => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400' } })
            })
        };
    }

    from(table) {
        return new QueryBuilder(table);
    }

    async rpc(func, params) {
        console.log(`[MockRPC] Calling ${func}`, params);
        if (func === 'increment_view_count') {
            const post = MOCK_DATA.posts.find(p => p.id === params.post_id);
            if (post) post.view_count = (post.view_count || 0) + 1;
        }
        return { data: null, error: null };
    }
}

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this.data = JSON.parse(JSON.stringify(MOCK_DATA[table] || [])); // Deep clone
        this.filters = [];
        this.sorts = [];
        this.rangeStart = null;
        this.rangeEnd = null;
        this.isSingle = false;
        this.isMaybeSingle = false;
        this.pendingOperation = null;
    }

    select(columns, options) {
        // In a real mock, we'd parse columns. Here we just attach relations if requested.
        this.selectOptions = options;

        // Refresh comments from localStorage in case they've been updated
        if (this.table === 'comments' && !this.pendingOperation) {
            this.data = JSON.parse(localStorage.getItem('mock_comments') || '[]');
        }

        this.applyJoins();
        return this;
    }

    applyJoins() {
        // Simulating joins crudely for specific cases
        if (this.table === 'posts') {
            this.data = this.data.map(post => {
                const profile = MOCK_DATA.profiles.find(p => p.id === post.user_id);
                const category = MOCK_DATA.categories.find(c => c.id === post.category_id);
                return {
                    ...post,
                    profiles: profile,
                    categories: category
                };
            });
        }
        if (this.table === 'categories') {
            this.data = this.data.map(cat => {
                const count = MOCK_DATA.posts.filter(p => p.category_id === cat.id).length;
                return { ...cat, posts: [{ count }] }; // simulating count structure
            });
        }
        if (this.table === 'comments') {
            this.data = this.data.map(comment => {
                const profile = MOCK_DATA.profiles.find(p => p.id === comment.user_id) || {
                    full_name: 'Guest User',
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`
                };
                return { ...comment, profiles: profile };
            });
        }
    }

    eq(column, value) {
        this.data = this.data.filter(item => item[column] == value);
        return this;
    }

    or(filterString) {
        // Very basic mock for search: title.ilike.%val%,content.ilike.%val%
        if (filterString.includes('ilike')) {
            const val = filterString.split('%')[1].toLowerCase();
            this.data = this.data.filter(item =>
                (item.title && item.title.toLowerCase().includes(val)) ||
                (item.content && item.content.toLowerCase().includes(val))
            );
        }
        return this;
    }

    order(column, { ascending = true } = {}) {
        this.data.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
        });
        return this;
    }

    range(from, to) {
        this.rangeStart = from;
        this.rangeEnd = to;
        return this; // Determine result on await
    }

    single() {
        this.isSingle = true;
        return this;
    }

    maybeSingle() {
        this.isMaybeSingle = true;
        return this;
    }

    insert(rows) {
        this.pendingOperation = () => {
            console.log(`[MockDB] Inserting into ${this.table}:`, rows);
            const newRows = (Array.isArray(rows) ? rows : [rows]).map(row => ({
                id: Math.floor(Math.random() * 1000000),
                created_at: new Date().toISOString(),
                ...row
            }));

            if (this.table === 'comments') {
                const comments = JSON.parse(localStorage.getItem('mock_comments') || '[]');
                comments.push(...newRows);
                localStorage.setItem('mock_comments', JSON.stringify(comments));
                this.data = newRows;
            } else if (MOCK_DATA[this.table]) {
                MOCK_DATA[this.table].push(...newRows);
                this.data = newRows;
            } else {
                this.data = newRows;
            }
            return { error: null };
        };
        return this;
    }

    update(values) {
        this.pendingOperation = () => {
            console.log(`[MockDB] Updating ${this.table}:`, values);
            this.data = this.data.map(item => ({ ...item, ...values }));
            return { error: null };
        };
        return this;
    }

    delete() {
        this.pendingOperation = () => {
            console.log(`[MockDB] Deleting from ${this.table}`);
            this.data = [];
            return { error: null };
        };
        return this;
    }

    // Allow awaiting the builder directly
    async then(resolve, reject) {
        if (this.pendingOperation) {
            const operationResult = this.pendingOperation();
            if (operationResult.error) {
                resolve({ data: null, error: operationResult.error });
                return;
            }
            // Re-apply joins if a select was already called
            if (this.selectOptions) {
                this.applyJoins();
            }
        }

        const total = this.data.length;
        let result = this.data;

        if (this.rangeStart !== null && this.rangeEnd !== null) {
            result = result.slice(this.rangeStart, this.rangeEnd + 1);
        }

        if (this.isSingle) {
            const item = result[0];
            resolve({
                data: item || null,
                error: item ? null : { message: 'Row not found', code: 'PGRST116' }
            });
        } else if (this.isMaybeSingle) {
            const item = result[0];
            resolve({
                data: item || null,
                error: null
            });
        } else {
            resolve({
                data: result,
                error: null,
                count: this.selectOptions?.count ? total : null
            });
        }
    }
}

export const supabase = new MockSupabaseClient();
window.supabaseClient = supabase;