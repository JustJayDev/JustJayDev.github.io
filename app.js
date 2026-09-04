// ============================================================
// CONFIG - Edit these values to customize your e-card
// ============================================================
const CFG = {
  // Profile
  name: 'Jay Kumar',
  handle: '@JustJayDev',
  bio: '16-year-old developer. Building cool stuff every day.',
  photoUrl: '', // Replace with your photo URL or leave empty

  // Gaming IDs
  ff: { name: 'Your FF Name & ID', id: '' },
  fc: { name: 'Your FC Name & ID', id: '' },
  game: { name: 'Your Game Name & ID', id: '' },

  // Socials
  instagram: { handle: '@your_username', url: '' },
  youtube: { handle: '@your_channel', url: '' },
  discord: { handle: 'your_discord#0000', url: '' },
  github: { handle: 'JustJayDev', url: 'https://github.com/JustJayDev' },

  // UPI
  upiQrUrl: '', // Replace with your UPI QR code image URL or leave empty
  upiNote: 'All payments go directly to your UPI',

  // About
  aboutText: 'Write something about yourself here. Who you are, what you do, your interests, goals, and what makes you unique...',

  // vCard
  vcard: {
    firstName: 'Jay',
    lastName: 'Kumar',
    org: 'JustJayDev',
    title: 'Developer',
    phone: '',
    email: '',
    url: 'https://JustJayDev.github.io'
  }
};

// ============================================================
// PASSWORDS & SECURITY
// ============================================================
const PASS_REAL = '5380';
const PASS_DECOY = '1234';
const PASS_SECRET = 'jay';

// ============================================================
// STATE
// ============================================================
let clicks = 0, fails = 0, lockUntil = 0, unlocked = false;
let deferredPrompt = null;

// ============================================================
// SOUND EFFECTS (Web Audio API)
// ============================================================
let audioCtx = null;
function initAudio() {
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}
function playSound(type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  if (type === 'click') {
    osc.frequency.value = 800; gain.gain.value = 0.05;
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'success') {
    osc.frequency.value = 880; gain.gain.value = 0.1;
    osc.start();
    setTimeout(() => { osc.frequency.value = 1100; }, 80);
    osc.stop(audioCtx.currentTime + 0.2);
  } else if (type === 'error') {
    osc.frequency.value = 200; gain.gain.value = 0.08;
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
  } else if (type === 'unlock') {
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = f; g.gain.value = 0.08;
      o.start(audioCtx.currentTime + i * 0.1);
      o.stop(audioCtx.currentTime + i * 0.1 + 0.15);
    });
  }
}

// ============================================================
// HAPTIC FEEDBACK
// ============================================================
function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// ============================================================
// STORAGE HELPERS
// ============================================================
function getStore(k, def) {
  try { return localStorage.getItem(k) || def; } catch(e) { return def; }
}
function setStore(k, v) {
  try { localStorage.setItem(k, v); } catch(e) {}
}
function getStoreObj(k, def) {
  try { return JSON.parse(localStorage.getItem(k)) || def; } catch(e) { return def; }
}
function setStoreObj(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
}

// ============================================================
// ANALYTICS
// ============================================================
function trackView() {
  let views = parseInt(getStore('jl_views', '0'));
  views++;
  setStore('jl_views', views);
  setStore('jl_lastVisit', new Date().toLocaleString());
  setStore('jl_lastVisitTs', Date.now());
  return views;
}
function trackUnlock() {
  let unlocks = parseInt(getStore('jl_unlocks', '0'));
  unlocks++;
  setStore('jl_unlocks', unlocks);
}
function getLastVisit() {
  const ts = parseInt(getStore('jl_lastVisitTs', '0'));
  if (!ts) return '--';
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
  return Math.floor(diff/86400000) + 'd ago';
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout = null;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2200);
}

// ============================================================
// COPY FUNCTION
// ============================================================
function cpD(elId, btnId) {
  const el = document.getElementById(elId);
  const btn = document.getElementById(btnId);
  if (!el || !btn) return;
  const text = el.textContent;
  if (text.includes('Your ') || text.includes('placeholder')) { toast('Not set yet!'); return; }
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    playSound('click');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
  }).catch(() => toast('Copy failed'));
}

// ============================================================
// COPY ALL IDs
// ============================================================
function copyAll() {
  const ids = [];
  const ff = document.getElementById('ffId');
  const fc = document.getElementById('fcId');
  const game = document.getElementById('gameId');
  if (ff && !ff.textContent.includes('Your ')) ids.push('Free Fire: ' + ff.textContent);
  if (fc && !fc.textContent.includes('Your ')) ids.push('FC Mobile: ' + fc.textContent);
  if (game && !game.textContent.includes('Your ')) ids.push('Other: ' + game.textContent);
  if (!ids.length) { toast('No IDs set yet!'); return; }
  navigator.clipboard.writeText(ids.join('\n')).then(() => toast('All IDs copied!')).catch(() => toast('Copy failed'));
}

// ============================================================
// SHARE
// ============================================================
function shareW() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'JustJayDev', text: 'Check out Jay Kumar\'s profile!', url });
  } else {
    navigator.clipboard.writeText(url).then(() => toast('Link copied!')).catch(() => toast('Copy failed'));
  }
}

// ============================================================
// VCARD DOWNLOAD
// ============================================================
function dlVcard() {
  const v = CFG.vcard;
  const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${v.firstName} ${v.lastName}\nN:${v.lastName};${v.firstName};;;\nORG:${v.org}\nTITLE:${v.title}\nTEL:${v.phone}\nEMAIL:${v.email}\nURL:${v.url}\nEND:VCARD`;
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'JayKumar.vcf';
  a.click();
  toast('vCard downloaded!');
}

// ============================================================
// THEME
// ============================================================
function toggleTheme() {
  const root = document.documentElement;
  const isLight = root.getAttribute('data-theme') === 'light';
  root.setAttribute('data-theme', isLight ? '' : 'light');
  setStore('jl_theme', isLight ? '' : 'light');
  playSound('click');
}

// ============================================================
// SCROLL PROGRESS
// ============================================================
function updateScrollProgress() {
  const el = document.getElementById('scrollProgress');
  if (!el) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight * 100) : 0;
  el.style.width = pct + '%';
}

// ============================================================
// SECTION REVEAL (Intersection Observer)
// ============================================================
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ============================================================
// CONFETTI
// ============================================================
function fireConfetti() {
  const el = document.getElementById('confetti');
  if (!el) return;
  el.innerHTML = '';
  const colors = ['#7C6CF0', '#2DD4BF', '#F5A623', '#EF4444', '#22C55E', '#fff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (2 + Math.random() * 2) + 's';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    el.appendChild(p);
  }
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

// ============================================================
// PASSWORD MODAL
// ============================================================
function openModal() {
  const modal = document.getElementById('modalBg');
  const input = document.getElementById('passInput');
  if (!modal) return;
  modal.classList.add('active');
  input.value = '';
  input.classList.remove('shake');
  document.getElementById('modalErr').textContent = '';
  updateSubtitle();
  setTimeout(() => input.focus(), 350);
}
function closeModal() {
  document.getElementById('modalBg').classList.remove('active');
  clicks = 0;
}
function updateSubtitle() {
  const el = document.getElementById('modalSub');
  if (!el) return;
  el.innerHTML = fails === 0
    ? '3 clicks detected. Enter the code to continue.'
    : 'Wrong code! <span class="fc">Fail ' + fails + '/6</span> \u2014 wait increases each time';
}

function tryUnlock() {
  const val = document.getElementById('passInput').value.trim();
  if (!val) return;
  initAudio();

  // Decoy mode - show fake wrong first
  if (val === PASS_DECOY) {
    fails++;
    playSound('error');
    vibrate(100);
    document.getElementById('passInput').classList.add('shake');
    document.getElementById('modalErr').textContent = 'Wrong code! Try again.';
    setTimeout(() => document.getElementById('passInput').classList.remove('shake'), 500);
    document.getElementById('passInput').value = '';
    document.getElementById('passInput').focus();
    return;
  }

  // Secret easter egg - type "jay"
  if (val === PASS_SECRET) {
    closeModal();
    toast('&#128540; Easter egg found!');
    document.querySelector('.made-by-line').innerHTML += ' <span style="font-size:12px">&#127942;</span>';
    return;
  }

  if (val === PASS_REAL) {
    unlocked = true;
    closeModal();
    playSound('unlock');
    vibrate([50, 50, 100, 50, 200]);
    fireConfetti();
    try { sessionStorage.setItem('jl_unlocked', '1'); } catch(e) {}
    document.getElementById('publicPage').style.display = 'none';
    document.getElementById('fullPage').classList.add('show');
    trackUnlock();
    initReveal();
    initStats();
    applyTheme();
    initSw();
    setTimeout(() => toast('&#128275; Welcome!'), 500);
    // Request notification permission
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  } else {
    fails++;
    playSound('error');
    vibrate(100);
    const input = document.getElementById('passInput');
    input.classList.add('shake');
    input.value = '';
    input.focus();
    setTimeout(() => input.classList.remove('shake'), 500);

    if (fails >= 6) {
      document.getElementById('unlockBtn').disabled = true;
      document.getElementById('passInput').disabled = true;
      document.getElementById('modalErr').textContent = '\u26D4 Access Denied Permanently';
      setTimeout(closeModal, 2000);
      return;
    }

    const wait = fails * 10;
    lockUntil = Date.now() + (wait * 1000);
    document.getElementById('modalErr').textContent = 'Wrong! Wait ' + wait + 's';
    updateSubtitle();
    setTimeout(() => { if (document.getElementById('modalBg').classList.contains('active')) closeModal(); }, 1500);
  }
}

// ============================================================
// STATS
// ============================================================
function initStats() {
  const views = trackView();
  const viewEl = document.getElementById('viewCount');
  if (viewEl) {
    animateNum(viewEl, 0, views, 800);
  }
  const timeEl = document.getElementById('visitTime');
  if (timeEl) {
    timeEl.textContent = getLastVisit();
  }
}
function animateNum(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(from + (to - from) * easeOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ============================================================
// APPLY THEME
// ============================================================
function applyTheme() {
  const saved = getStore('jl_theme', '');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
}

// ============================================================
// SERVICE WORKER (PWA)
// ============================================================
function initSw() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered', reg.scope);
    }).catch(err => {
      console.log('SW error', err);
    });
  }
}

// ============================================================
// PWA INSTALL
// ============================================================
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    const banner = document.getElementById('installBanner');
    if (banner) banner.classList.add('show');
  }, 3000);
});
function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      toast('App installed!');
    }
    deferredPrompt = null;
    document.getElementById('installBanner').classList.remove('show');
  });
}
function dismissInstall() {
  document.getElementById('installBanner').classList.remove('show');
}

// ============================================================
// RIGHT CLICK BLOCK
// ============================================================
document.addEventListener('contextmenu', (e) => {
  if (unlocked) e.preventDefault();
});

// ============================================================
// DEVTOOLS DETECTION
// ============================================================
(function() {
  const threshold = 160;
  function check() {
    if (unlocked) return;
    const w = window.outerWidth - window.innerWidth;
    const h = window.outerHeight - window.innerHeight;
    if (w > threshold || h > threshold) {
      // DevTools likely open
      closeModal();
      toast('Access restricted');
    }
  }
  setInterval(check, 1000);
})();

// ============================================================
// CLICK PATTERN DETECTION
// ============================================================
let clickTimes = [];
document.addEventListener('click', (e) => {
  if (!unlocked) {
    clickTimes.push(Date.now());
    if (clickTimes.length > 10) clickTimes.shift();
    // Detect bot-like clicking (all clicks within 200ms)
    if (clickTimes.length >= 3) {
      const recent = clickTimes.slice(-3);
      const gaps = [recent[1] - recent[0], recent[2] - recent[1]];
      if (gaps.every(g => g < 200)) {
        // Too fast, likely bot
        closeModal();
        toast('Suspicious activity detected');
        clickTimes = [];
      }
    }
  }
});

// ============================================================
// BOTTOM SHEET MODAL (mobile feel)
// ============================================================
document.getElementById('modalBg')?.addEventListener('click', (e) => {
  if (e.target.id === 'modalBg') closeModal();
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // Restore session
  try {
    if (sessionStorage.getItem('jl_unlocked') === '1') {
      unlocked = true;
      document.getElementById('publicPage').style.display = 'none';
      document.getElementById('fullPage').classList.add('show');
      initReveal();
      initStats();
      applyTheme();
      initSw();
    }
  } catch(e) {}

  // Apply saved theme
  applyTheme();

  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    initAudio();
    toggleTheme();
  });

  // 3-click access
  const trigger = document.getElementById('accessTrigger');
  trigger?.addEventListener('click', () => {
    if (unlocked) return;
    initAudio();
    const now = Date.now();
    if (now < lockUntil) {
      const secs = Math.ceil((lockUntil - now) / 1000);
      toast('Wait ' + secs + 's');
      playSound('error');
      return;
    }
    playSound('click');
    vibrate(30);
    clicks++;
    if (clicks >= 3) {
      clicks = 0;
      openModal();
    }
  });

  // Modal events
  document.getElementById('unlockBtn')?.addEventListener('click', tryUnlock);
  document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
  document.getElementById('passInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
    if (e.key === 'Escape') closeModal();
  });

  // Scroll progress
  window.addEventListener('scroll', () => {
    updateScrollProgress();
  });

  // Pull to refresh hint
  if (unlocked) initStats();
});

// ============================================================
// SERVICE WORKER REGISTER
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
