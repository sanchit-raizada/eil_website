/* ── CURSOR GLOW ── */
const glow = document.getElementById('cursorGlow');
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
} else {
    glow.style.display = 'none';
}











/* ── ACCESSIBILITY FONT SIZE BAR ── */
(function () {
    const MIN = 80, MAX = 150, STEP = 5;
    let size = 100;

    try {
        const saved = parseInt(localStorage.getItem('eilFontSize'));
        if (!isNaN(saved) && saved >= MIN && saved <= MAX) size = saved;
    } catch (e) { }

    const display = document.getElementById('fsDisplay');
    const btnInc = document.getElementById('fsIncrease');
    const btnDec = document.getElementById('fsDecrease');
    const btnReset = document.getElementById('fsReset');

    function applySize(s) {
        size = Math.min(MAX, Math.max(MIN, s));
        document.documentElement.style.fontSize = (size / 100) * 16 + 'px';
        if (display) display.textContent = size + '%';
        if (btnInc) btnInc.disabled = size >= MAX;
        if (btnDec) btnDec.disabled = size <= MIN;
        try { localStorage.setItem('eilFontSize', size); } catch (e) { }
    }

    if (btnInc) btnInc.addEventListener('click', () => applySize(size + STEP));
    if (btnDec) btnDec.addEventListener('click', () => applySize(size - STEP));
    if (btnReset) btnReset.addEventListener('click', () => applySize(100));

    applySize(size);
})();










/* ── HEADER SCROLL ── */
const hdr = document.getElementById('siteHeader');
const bt = document.getElementById('backTop');
window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 60);
    bt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });








/* ── HAMBURGER ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobNav');

ham.addEventListener('click', () => {
    const isOpen = mob.classList.toggle('open');
    ham.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});








/* Close mob nav when a direct (non-accordion) link is clicked */
mob.querySelectorAll('a.mob-nav-link, .mob-sub a').forEach(a => {
    a.addEventListener('click', () => {
        ham.classList.remove('open');
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});






/* ── MOBILE ACCORDION SUBMENUS ── */
mob.querySelectorAll('.mob-nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const sub = btn.nextElementSibling;   /* .mob-sub */
        const isOpen = sub.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
    });
});





/* ── SEARCH ── */
const overlay = document.getElementById('searchOverlay');
const si = document.getElementById('searchInput');

document.getElementById('searchBtn').addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => si.focus(), 200);
});
document.getElementById('searchClose').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        overlay.classList.remove('open');
    }
});






/* ── CAROUSEL ── */
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.c-dot');
const slideContents = [
    {
        title: 'Concept to <span class="accent">Commissioning</span><br>Total Energy Solutions',
        sub: "India's premier Engineering Consultancy & EPC company delivering world-class solutions across 27 countries."
    },
    {
        title: 'Engineering <span class="accent">Excellence</span><br>Since 1965',
        sub: "Six decades of trusted engineering consultancy for petroleum refineries, pipelines and petrochemical complexes."
    },
    {
        title: 'Global <span class="accent">Presence</span><br>Local Expertise',
        sub: "Significant footprints in MENA, Africa and Asia Pacific with an engineering hub in Abu Dhabi."
    },
    {
        title: 'Building a <span class="accent">Green</span><br>Energy Future',
        sub: "Leading India's energy transition with Green Hydrogen, Bio-fuels and sustainable engineering solutions."
    }
];
let cur = 3, autoTimer;

function goSlide(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
    document.getElementById('slideNum').textContent = String(cur + 1).padStart(2, '0');

    const ct = slideContents[cur];
    const h1 = document.getElementById('heroTitle');
    const sub = document.getElementById('heroSub');
    h1.style.opacity = '0'; h1.style.transform = 'translateY(16px)';
    sub.style.opacity = '0'; sub.style.transform = 'translateY(16px)';
    setTimeout(() => {
        h1.innerHTML = ct.title;
        sub.textContent = ct.sub;
        h1.style.transition = 'all .6s ease';
        sub.style.transition = 'all .6s ease .1s';
        h1.style.opacity = '1'; h1.style.transform = 'translateY(0)';
        sub.style.opacity = '1'; sub.style.transform = 'translateY(0)';
    }, 200);

    const pb = document.getElementById('heroProgress');
    pb.style.animation = 'none';
    void pb.offsetWidth;
    pb.style.animation = 'progress 5s linear infinite';

    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => goSlide(cur + 1), 5000);
}

document.getElementById('nextSlide').addEventListener('click', () => goSlide(cur + 1));
document.getElementById('prevSlide').addEventListener('click', () => goSlide(cur - 1));
autoTimer = setTimeout(() => goSlide(cur + 1), 5000);

/* ── COUNT UP ── */
function countUp(el, target, suffix, dur) {
    let s = null;
    const fn = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * target).toLocaleString() + (suffix || '');
        if (p < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
}

const statsObs = new IntersectionObserver(ents => {
    ents.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('.stat-num[data-target]').forEach((el, i) => {
                setTimeout(() => countUp(el, +el.dataset.target, el.dataset.suffix || '', 1800), i * 150);
            });
            statsObs.disconnect();
        }
    });
}, { threshold: .4 });
const sb = document.querySelector('.hero-statsbar');
if (sb) statsObs.observe(sb);

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(ents => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── PROJECT FILTER ── */
function filterProj(cat, btn) {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.proj-card').forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
    });
}

/* ── SMOOTH SCROLL (for all anchor links) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ── PARALLAX — Global Section ── */
function scrollingParallex() {
    const el = document.querySelector('.global-parallax');
    if (!el || window.innerWidth < 769) return;
    const rect = el.getBoundingClientRect();
    if (window.innerHeight > rect.top && rect.bottom > 0) {
        const inner = el.querySelector('.global-inner');
        if (inner) inner.style.transform = `translateY(${rect.top * 0.5}px)`;
    }
}
window.addEventListener('scroll', scrollingParallex, { passive: true });
