import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gamepad2, Users, MessageCircle, User, Heart, Archive, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useData';
import toast from 'react-hot-toast';

const RevealText: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className = '', delay = 0 }) => (
  <span className={className} aria-label={text}>
    {text.split('').map((ch, i) => (
      <span key={i} aria-hidden="true" className="text-reveal" style={{ ['--i' as any]: i + delay }}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))}
  </span>
);

const CountUp: React.FC<{ to: number; suffix?: string; duration?: number }> = ({ to, suffix = '', duration = 1.6 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / (duration * 1000));
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

const TiltCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
  delay: number;
}> = ({ icon, label, desc, onClick, delay }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-3px)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = '0.5';
      glareRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.22), transparent 60%)`;
    }
  }, []);
  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, []);
  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: 0.1 + delay, duration: 0.5, ease: 'easeOut' }}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="card tilt-card p-5 flex flex-col items-center gap-3 text-center group relative overflow-hidden"
    >
      <div ref={glareRef} className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }} />
      <div style={{ color: 'var(--color-accent-light)' }} className="group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
        {icon}
      </div>
      <div className="relative">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      </div>
    </motion.button>
  );
};

const STATS = [
  { value: 4, suffix: '+', label: 'Apps shipped' },
  { value: 120, suffix: '+', label: 'Days streak' },
  { value: 230, suffix: '+', label: 'Days tracked' },
  { value: 100, suffix: '%', label: 'Self-taught' },
];

const MagneticButton: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ onClick, className = '', children }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </button>
  );
};

const Home: React.FC = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'JustJayDev',
        text: profile?.tagline || 'Check out my digital identity!',
        url: window.location.href,
      });
    } else {
      handleCopyUrl();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }} />
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Loading your experience...</p>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center gap-6 pt-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1.5 rounded-full opacity-70"
            style={{ background: 'conic-gradient(from 0deg, transparent 0%, #6366f1 20%, #d946ef 50%, #6366f1 80%, transparent 100%)', filter: 'blur(4px)' }}
          />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2" style={{ borderColor: 'var(--color-accent)' }}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold gradient-text">
                {profile?.displayName?.charAt(0) || 'J'}
              </div>
            )}
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <span className="text-white text-xs">⚡</span>
          </motion.div>
        </motion.div>
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: 'var(--color-accent-light)' }}
          >
            <Sparkles size={14} className="inline mr-1 -mt-0.5" />
            {profile?.brandName || 'JustJayDev'}
          </motion.p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            <RevealText text={profile?.displayName || 'Jay Kumar'} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-base md:text-lg"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {profile?.tagline || 'Gamer - Creator - Builder'}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          className="glow-border inline-flex items-center gap-2 px-4 py-2"
        >
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>ID:</span>
          <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-accent-light)' }}>
            {profile?.digitalId || 'JJDEV-001'}
          </span>
          <span className="w-2 h-2 rounded-full pulse-dot ml-1" style={{ background: 'var(--color-success)' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-2"
        >
          <MagneticButton className="btn-primary" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore
            <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton className="btn-secondary" onClick={handleShare}>
            <Share2 size={18} />
            Share
          </MagneticButton>
          <MagneticButton className="btn-secondary" onClick={handleCopyUrl}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </MagneticButton>
        </motion.div>
      </motion.div>

      /* Stats band */
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="card p-4 text-center"
          >
            <p className="text-2xl md:text-3xl font-black gradient-text">
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[11px] md:text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.section>

      /* Explore grid */
      <motion.section
        id="explore"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mt-16 md:mt-24 scroll-mt-20"
      >
        <h2 className="section-title text-center">Explore</h2>
        <p className="text-center text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Everything around the digital identity, one tap away.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TiltCard icon={<Gamepad2 size={34} />} label="Gaming" desc="Game library & setups" delay={0} onClick={() => navigate('/gaming')} />
          <TiltCard icon={<Sparkles size={34} />} label="Esports" desc="Competitive scene" delay={0.06} onClick={() => navigate('/esports')} />
          <TiltCard icon={<User size={34} />} label="About" desc="Who is JustJayDev" delay={0.12} onClick={() => navigate('/about')} />
          <TiltCard icon={<Users size={34} />} label="Social" desc="Links & community" delay={0.18} onClick={() => navigate('/social')} />
          <TiltCard icon={<MessageCircle size={34} />} label="Contact" desc="Get in touch" delay={0.24} onClick={() => navigate('/contact')} />
          <TiltCard icon={<Archive size={34} />} label="Archive" desc="Hidden lore vault" delay={0.3} onClick={() => navigate('/archive')} />
        </div>
      </motion.section>

      /* CTA band */
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="mt-16 md:mt-20"
      >
        <div className="glow-border p-6 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold">
            Want your own site like this?
          </h3>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            I build apps, tools and websites. Hit me up.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <MagneticButton className="btn-primary" onClick={() => navigate('/contact')}>
              <MessageCircle size={18} />
              Contact me
            </MagneticButton>
            <MagneticButton className="btn-secondary" onClick={() => navigate('/support')}>
              <Heart size={18} />
              Support
            </MagneticButton>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
