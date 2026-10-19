/* ==========================================================================
   Portfolio behaviour — fully config-driven; no content lives in the markup.
   Single-page sections; background + navigation are JS-driven.
   ========================================================================== */
(() => {
    'use strict';

    const EMPTY = { meta: {}, personal: {}, social: {}, sections: {}, skills: [], experience: [], certifications: [] };

    let data = Object.assign({}, EMPTY);

    const $ = (s, r = document) => r.querySelector(s);
    const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
    const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    /* ---------- Inline icons ---------- */
    const I = {
        sun: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
        moon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>',
        mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
        github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>',
        linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z"/></svg>',
        ext: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/></svg>'
    };

    /* ---------- Data ---------- */
    async function loadData() {
        try {
            const res = await fetch('config.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const json = await res.json();
            data = Object.assign({}, EMPTY, json);
        } catch (e) {
            console.warn('[portfolio] config load failed:', e.message);
        }
    }

    const sentences = (text, n) => {
        if (!text) return '';
        const parts = text.match(/[^.!?]+[.!?]+/g) || [text];
        return parts.slice(0, n).map((s) => s.trim()).join(' ');
    };

    /* ---------- Populate ---------- */
    function populate() {
        applyText();
        applyMeta();
        populateContact(data.personal || {});
        populateSkills(data.skills);
        populateExperience(data.experience);
        populateCertifications(data.certifications);
    }

    /* Every [data-text] element declares the config.json path it renders.
       `{year}` / `{name}` tokens are substituted; `data-sentences` trims
       the value to N sentences. No content lives in the markup. */
    function applyText() {
        const year = new Date().getFullYear();
        const name = get(data, 'personal.name') || '';
        document.querySelectorAll('[data-text]').forEach((el) => {
            let v = get(data, el.getAttribute('data-text'));
            if (v == null) v = '';
            v = String(v).replace(/\{year\}/g, year).replace(/\{name\}/g, name);
            const n = parseInt(el.getAttribute('data-sentences'), 10);
            if (n > 0) v = sentences(v, n);
            el.textContent = v;
        });
    }

    function applyMeta() {
        const m = data.meta || {};
        if (m.title) document.title = m.title;
        if (m.description) {
            const el = document.querySelector('meta[name="description"]');
            if (el) el.setAttribute('content', m.description);
        }
    }

    function populateCertifications(list) {
        const box = $('#certs-grid');
        if (!box) return;
        if (!list || !list.length) { box.innerHTML = ''; return; }
        box.innerHTML = list.map((c) => {
            const url = c.verificationUrl && c.verificationUrl.trim();
            const inner = `
                <span class="cert-issuer">${esc(c.issuer)}</span>
                <h3 class="cert-name">${esc(c.name)}</h3>
                <p class="cert-desc">${esc(c.description)}</p>
                <div class="cert-foot">
                    <span class="cert-date">${esc(c.date)}</span>
                    ${url ? `<span class="cert-verify" title="Verify credential">${I.ext}</span>` : ''}
                </div>`;
            return url
                ? `<a class="cert-card" href="${esc(url)}" target="_blank" rel="noopener">${inner}</a>`
                : `<div class="cert-card">${inner}</div>`;
        }).join('');
    }

    function populateSkills(list) {
        const box = $('#skills-grid');
        if (!box) return;
        if (!list || !list.length) { box.innerHTML = ''; return; }
        box.innerHTML = list.map((s) => `
            <div class="skill-card">
                <h3 class="skill-cat">${esc(s.category)}</h3>
                <ul class="skill-tags">
                    ${(s.technologies || []).map((t) => `<li>${esc(t)}</li>`).join('')}
                </ul>
            </div>`).join('');
    }

    function populateExperience(list) {
        const box = $('#exp-list');
        if (!box) return;
        if (!list || !list.length) {
            box.innerHTML = '<p class="exp-empty">Details coming soon.</p>';
            return;
        }
        box.innerHTML = list.map((e) => `
            <article class="exp-item">
                <span class="exp-date">${esc(e.duration)}</span>
                <div class="exp-main">
                    <h3>${esc(e.position)}</h3>
                    <span class="exp-co">${esc(e.company)}</span>
                    <p>${esc(e.description)}</p>
                </div>
            </article>`).join('');
    }

    function populateContact(p) {
        const box = $('#contact-actions');
        if (!box) return;
        const s = data.social || {};
        const parts = [];
        if (p.email) parts.push(`<a class="btn btn-primary" href="mailto:${p.email}">${I.mail}<span>Send Email</span></a>`);
        if (s.linkedin) parts.push(`<a class="btn" href="${s.linkedin}" target="_blank" rel="noopener">${I.linkedin}<span>LinkedIn</span></a>`);
        if (s.github) parts.push(`<a class="btn" href="${s.github}" target="_blank" rel="noopener">${I.github}<span>GitHub</span></a>`);
        box.innerHTML = parts.join('');
    }

    /* ---------- Theme ---------- */
    function initTheme() {
        const btn = $('#theme-toggle');
        if (!btn) return;
        btn.innerHTML = `<span class="sun">${I.sun}</span><span class="moon">${I.moon}</span>`;
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            window.dispatchEvent(new Event('themechange'));
        });
    }

    /* ======================================================================
       Agent network — dense mesh rendered on canvas, with streaming data
       ====================================================================== */
    function initAgentNetwork() {
        const canvas = $('#agents-net');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        const TAU = Math.PI * 2;

        let seed = 20260719;
        const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        const rand = (a, b) => a + rnd() * (b - a);

        const makeNode = (nx, ny, r, hub) => ({
            nx, ny, r, hub, x: 0, y: 0,
            ax: rand(6, hub ? 9 : 20), wx: rand(0.05, 0.16), px: rand(0, TAU),
            ax2: rand(3, 8), wx2: rand(0.22, 0.45), px2: rand(0, TAU),
            ay: rand(6, hub ? 9 : 20), wy: rand(0.05, 0.16), py: rand(0, TAU),
            ay2: rand(3, 8), wy2: rand(0.22, 0.45), py2: rand(0, TAU)
        });

        // Jittered grid, normalised → even coverage, no symmetry
        const COLS = 15, ROWS = 10;
        const nodes = [], edges = [];
        const id = (r, c) => r * COLS + c;
        const edge = (v) => (v < 0.07 ? 0.07 : v > 0.93 ? 0.93 : v);

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const nx = edge((c + 0.5) / COLS + (rand(-0.5, 0.5) / COLS) * 0.72);
                const ny = edge((r + 0.5) / ROWS + (rand(-0.5, 0.5) / ROWS) * 0.72);
                const hub = rnd() < 0.07;
                nodes.push(makeNode(nx, ny, hub ? rand(3.5, 5) : rand(1.2, 2.2), hub));
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const i = id(r, c);
                if (c < COLS - 1 && rnd() < 0.84) edges.push({ a: i, b: id(r, c + 1), far: false });
                if (r < ROWS - 1 && rnd() < 0.84) edges.push({ a: i, b: id(r + 1, c), far: false });
                if (c < COLS - 1 && r < ROWS - 1 && rnd() < 0.28) edges.push({ a: i, b: id(r + 1, c + 1), far: true });
                if (rnd() < 0.04) {
                    const j = Math.floor(rnd() * nodes.length);
                    if (j !== i) edges.push({ a: i, b: j, far: true });
                }
            }
        }

        // Streaming "data" packets
        const flows = [];
        for (let i = 0; i < 46; i++) {
            flows.push({ e: Math.floor(rnd() * edges.length), t: rnd(), sp: rand(0.12, 0.34) });
        }

        // Canvas sizing
        let W = 0, H = 0;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = canvas.clientWidth; H = canvas.clientHeight;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        // Accent colour (theme aware)
        let acc = [29, 78, 216];
        const readColor = () => {
            const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
            if (v) acc = v.split(',').map(n => parseFloat(n));
        };
        const rgba = (a) => `rgba(${acc[0]},${acc[1]},${acc[2]},${a})`;
        readColor();
        window.addEventListener('themechange', readColor);

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const speed = reduce ? 0.4 : 1;
        let last = performance.now();

        const frame = (now) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            const t = (now / 1000) * speed;

            for (const n of nodes) {
                n.x = n.nx * W + n.ax * Math.sin(t * n.wx + n.px) + n.ax2 * Math.sin(t * n.wx2 + n.px2);
                n.y = n.ny * H + n.ay * Math.sin(t * n.wy + n.py) + n.ay2 * Math.sin(t * n.wy2 + n.py2);
            }

            ctx.clearRect(0, 0, W, H);

            // Far links
            ctx.strokeStyle = rgba(0.07);
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (const e of edges) {
                if (!e.far) continue;
                const a = nodes[e.a], b = nodes[e.b];
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            }
            ctx.stroke();

            // Near links
            ctx.strokeStyle = rgba(0.18);
            ctx.beginPath();
            for (const e of edges) {
                if (e.far) continue;
                const a = nodes[e.a], b = nodes[e.b];
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            }
            ctx.stroke();

            // Nodes
            for (const n of nodes) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, TAU);
                ctx.fillStyle = n.hub ? rgba(0.9) : rgba(0.42);
                ctx.fill();
            }

            // Streaming data packets with a short trail
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            for (const f of flows) {
                f.t += f.sp * dt * speed;
                if (f.t >= 1) { f.t = 0; f.e = Math.floor(rnd() * edges.length); }
                const a = nodes[edges[f.e].a], b = nodes[edges[f.e].b];
                const x1 = a.x + (b.x - a.x) * f.t, y1 = a.y + (b.y - a.y) * f.t;
                const tp = Math.max(0, f.t - 0.06);
                const x0 = a.x + (b.x - a.x) * tp, y0 = a.y + (b.y - a.y) * tp;
                ctx.strokeStyle = rgba(0.85);
                ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
                ctx.fillStyle = rgba(1);
                ctx.beginPath(); ctx.arc(x1, y1, 1.9, 0, TAU); ctx.fill();
            }

            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    /* ---------- Whole-graph motion ---------- */
    function initBackgroundMotion() {
        const pan = $('.agents-pan');
        const net = $('.agents');
        if (!pan || !net) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const speed = reduce ? 0.35 : 1;
        const TAU = Math.PI * 2;
        const t0 = performance.now();

        const frame = (now) => {
            const t = ((now - t0) / 1000) * speed;
            const x = Math.sin(t * TAU / 11) * 6;
            const y = Math.sin(t * TAU / 8 + 1.7) * 7;
            const rot = Math.sin(t * TAU / 16) * 2;
            const scale = 1.12 + Math.sin(t * TAU / 22) * 0.03;
            pan.style.transform = `translate3d(${x.toFixed(3)}%, 0, 0)`;
            net.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0) rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    /* ---------- Background reaction (cursor + section parallax) ---------- */
    function initBackgroundReaction() {
        const layer = $('#agents-layer');
        if (!layer) return { setScroll: () => {} };

        const target = { px: 0, py: 0, scroll: 0 };
        const cur = { px: 0, py: 0, scroll: 0 };

        if (!window.matchMedia('(pointer: coarse)').matches) {
            window.addEventListener('pointermove', (e) => {
                const x = e.clientX / window.innerWidth - 0.5;
                const y = e.clientY / window.innerHeight - 0.5;
                target.px = -x * 58;
                target.py = -y * 58;
            }, { passive: true });
        }

        const frame = () => {
            cur.px += (target.px - cur.px) * 0.1;
            cur.py += (target.py - cur.py) * 0.1;
            cur.scroll += (target.scroll - cur.scroll) * 0.1;
            layer.style.transform = `translate3d(${cur.px.toFixed(2)}px, ${(cur.py + cur.scroll).toFixed(2)}px, 0)`;
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);

        return {
            setScroll: (v) => { target.scroll = v; }
        };
    }

    /* ======================================================================
       Section navigation (SPA) — no page scroll; panes move programmatically
       ====================================================================== */
    function initSections(bgReact) {
        const root = $('#sections');
        if (!root) return;
        const panes = Array.from(root.querySelectorAll('.pane'));
        const up = $('#nav-up');
        const down = $('#nav-down');
        const topnav = $('#topnav');
        const LAST = panes.length - 1;
        let index = 0;
        let current = 0;
        let raf = 0;

        const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const apply = (pos) => { root.style.transform = `translate3d(0, ${(-pos * 100).toFixed(3)}%, 0)`; };
        const reactBg = (pos) => { if (bgReact) bgReact.setScroll(-pos * window.innerHeight * 0.16); };
        const syncButtons = () => {
            if (up) up.disabled = index <= 0;
            if (down) down.disabled = index >= LAST;
        };
        const syncNav = () => {
            if (topnav) topnav.classList.toggle('is-visible', index > 0);
            document.querySelectorAll('.topnav-links a').forEach((a, i) => {
                a.classList.toggle('is-active', i === index);
            });
        };

        const goTo = (target) => {
            target = Math.max(0, Math.min(LAST, target));
            if (target === index) return;
            const from = current;
            index = target;
            syncButtons();
            syncNav();
            if (raf) cancelAnimationFrame(raf);
            const start = performance.now();
            const duration = 780;
            const step = (now) => {
                const p = Math.min((now - start) / duration, 1);
                current = from + (target - from) * easeInOutCubic(p);
                apply(current);
                reactBg(current);
                if (p < 1) { raf = requestAnimationFrame(step); }
                else { current = target; apply(target); reactBg(target); raf = 0; }
            };
            raf = requestAnimationFrame(step);
        };

        if (up) up.addEventListener('click', () => goTo(index - 1));
        if (down) down.addEventListener('click', () => goTo(index + 1));

        const contactIndex = Math.max(0, panes.indexOf($('#contact')));
        const cta = $('#cta-contact');
        if (cta) cta.addEventListener('click', () => goTo(contactIndex));

        const navLabel = (p) => get(data, `sections.${p.id}.nav`) || '';
        const linkBox = $('#topnav-links');
        if (linkBox) {
            linkBox.innerHTML = panes
                .map((p, i) => `<a href="#" data-i="${i}">${esc(navLabel(p))}</a>`)
                .join('');
            linkBox.querySelectorAll('a').forEach((a) => {
                a.addEventListener('click', (e) => { e.preventDefault(); goTo(Number(a.dataset.i)); });
            });
        }
        const brand = $('#topnav-brand');
        if (brand) brand.addEventListener('click', () => goTo(0));

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(index + 1); }
            else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(index - 1); }
        });

        /* Wheel / trackpad / swipe → snap to the next full section.
           If the current pane has more content to scroll in that direction,
           let it scroll natively first; snap only at the edge. */
        let navLockUntil = 0;
        const atEdge = (pane, dir) => {
            const canScroll = pane.scrollHeight > pane.clientHeight + 1;
            if (!canScroll) return true;
            const atTop = pane.scrollTop <= 0;
            const atBottom = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 1;
            return dir < 0 ? atTop : atBottom;
        };
        const snap = (dir) => {
            if (raf || performance.now() < navLockUntil) return;
            navLockUntil = performance.now() + 850;
            goTo(index + dir);
        };

        window.addEventListener('wheel', (e) => {
            if (document.body.classList.contains('is-loading')) return;
            const dir = e.deltaY > 0 ? 1 : -1;
            if (!atEdge(panes[index], dir)) return; // pane scrolls natively
            e.preventDefault();
            if (Math.abs(e.deltaY) < 2) return;
            snap(dir);
        }, { passive: false });

        let touchStartX = 0, touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        window.addEventListener('touchend', (e) => {
            if (document.body.classList.contains('is-loading')) return;
            const t = e.changedTouches[0];
            const dy = touchStartY - t.clientY;
            const dx = touchStartX - t.clientX;
            if (Math.abs(dy) < 55 || Math.abs(dy) <= Math.abs(dx)) return;
            const dir = dy > 0 ? 1 : -1;
            if (!atEdge(panes[index], dir)) return;
            snap(dir);
        }, { passive: true });

        apply(0);
        reactBg(0);
        syncButtons();
        syncNav();
    }

    /* ---------- Boot ---------- */
    document.addEventListener('DOMContentLoaded', async () => {
        const loader = $('#loader');
        const started = performance.now();
        const reveal = () => {
            const wait = Math.max(0, 550 - (performance.now() - started));
            setTimeout(() => {
                document.body.classList.remove('is-loading');
                if (loader) loader.classList.add('is-hidden');
            }, wait);
        };

        try {
            initTheme();
            await loadData();
            populate();
            const bgReact = initBackgroundReaction();
            initSections(bgReact);
            initAgentNetwork();
            initBackgroundMotion();
        } catch (e) {
            console.error('[portfolio] init failed:', e);
        } finally {
            reveal();
        }
    });
})();
