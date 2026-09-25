import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, TerminalSquare, Github } from 'lucide-react';
import { profile } from '@/data/profile';
import { mainGames, casualGames } from '@/data/games';
import GameCard from '@/components/GameCard';
import CountUp from '@/components/CountUp';
import { spawnRipple } from '@/lib/ripple';

/**
 * Home — neon cyber hero, live ticker, stats, horizontal game showcase,
 * casual marquee, and a terminal-style "about me" block.
 */
const Home: React.FC = () => {
  const [typed, setTyped] = useState('');
  const roles = ['Mobile Gamer', 'Builder', 'Future Trader', 'Rusher'];

  // typewriter loop
  useEffect(() => {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        setTyped(word.slice(0, charIdx));
        if (charIdx === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
        timer = setTimeout(tick, 90);
      } else {
        charIdx--;
        setTyped(word.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 45);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  const nowPlaying = mainGames.filter((g) => g.nowPlaying);

  const marqueeItems = [...casualGames, ...casualGames];

  return (
    <div className="wrap">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="reveal">
          <span className="hero-status">
            <span className="dot" /> system_online · india
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '26px 0 8px' }} className="reveal">
          <img src={profile.heroImage} alt="Jay Kumar" className="hero-avatar floaty" />
          <div>
            <div className="mono" style={{ color: 'var(--mg)', fontSize: 13, letterSpacing: 2 }}>
              $ whoami
            </div>
            <h1
              className="glitch neon-text"
              data-text={profile.handle}
              style={{ fontSize: 'clamp(44px, 9vw, 84px)', fontWeight: 800, margin: '4px 0', lineHeight: 1 }}
            >
              {profile.handle}
            </h1>
          </div>
        </div>

        <p
          className="reveal"
          style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 500, color: 'var(--text)', margin: '6px 0 0' }}
        >
          {profile.name} — <span className="caret">{typed}</span>
        </p>
        <p className="mono reveal" style={{ color: 'var(--muted)', maxWidth: 620, lineHeight: 1.7, marginTop: 14 }}>
          {profile.bio}
        </p>

        <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 26 }}>
          {profile.chips.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>

        <div className="reveal" style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
          <Link to="/games" className="btn btn-primary" onClick={spawnRipple}>
            <Gamepad2 size={18} /> View Games <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="btn" onClick={spawnRipple}>
            <TerminalSquare size={18} /> About Me
          </Link>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn" onClick={spawnRipple}>
            <Github size={18} /> GitHub
          </a>
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <div className="ticker reveal">
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <React.Fragment key={dup}>
              {mainGames.map((g) => {
                const head = g.name.toUpperCase();
                const sub = g.badges[0] || g.status;
                return (
                  <span key={g.id + '-' + dup}>
                    <b>{head}</b> · {sub}
                  </span>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <section style={{ margin: '54px 0' }}>
        <div className="section-title">stats</div>
        <div
          className="glass reveal"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', marginTop: 18 }}
        >
          <div className="stat">
            <div className="num">
              <CountUp to={mainGames.length + casualGames.length} />
            </div>
            <div className="lbl">Games played</div>
          </div>
          <div className="stat">
            <div className="num">
              <CountUp to={nowPlaying.length} />
            </div>
            <div className="lbl">Grinding now</div>
          </div>
          <div className="stat">
            <div className="num">
              <CountUp to={161} />
            </div>
            <div className="lbl">Dragons owned</div>
          </div>
          <div className="stat">
            <div className="num">
              <CountUp to={100} suffix="%" />
            </div>
            <div className="lbl">Mobile player</div>
          </div>
        </div>
      </section>

      {/* ================= NOW PLAYING ================= */}
      <section style={{ margin: '54px 0' }}>
        <div className="section-title">now_playing</div>
        <div className="hscroll reveal" style={{ marginTop: 18 }}>
          {nowPlaying.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* ================= ALL GAMES ================= */}
      <section style={{ margin: '54px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title" style={{ flex: 1 }}>
            all_games
          </div>
          <Link to="/games" className="mono" style={{ color: 'var(--cy)', textDecoration: 'none', fontSize: 13 }}>
            view_all ↗
          </Link>
        </div>
        <div className="hscroll reveal" style={{ marginTop: 18 }}>
          {mainGames.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* ================= CASUAL MARQUEE ================= */}
      <section style={{ margin: '54px 0' }}>
        <div className="section-title">casual_classics</div>
        <div className="marquee reveal" style={{ marginTop: 18 }}>
          <div className="marquee-track">
            {marqueeItems.map((c, i) => (
              <span key={i} className="chip" style={{ fontSize: 13, padding: '8px 16px' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TERMINAL ABOUT ================= */}
      <section style={{ margin: '54px 0' }}>
        <div className="section-title">~/.profile</div>
        <div className="glass neon-border reveal" style={{ marginTop: 18, padding: 22, fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.9 }}>
          <div>
            <span style={{ color: 'var(--gr)' }}>jay@justjaydev</span>
            <span style={{ color: 'var(--muted)' }}>:</span>
            <span style={{ color: 'var(--cy)' }}>~</span>
            <span style={{ color: 'var(--muted)' }}>$</span> cat about.txt
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ color: 'var(--mg)' }}>name</span> = "{profile.name}"
          </div>
          <div>
            <span style={{ color: 'var(--mg)' }}>handle</span> = "{profile.handle}"
          </div>
          <div>
            <span style={{ color: 'var(--mg)' }}>location</span> = "{profile.location}"
          </div>
          <div>
            <span style={{ color: 'var(--mg)' }}>setup</span> = "{profile.setup.phone} · {profile.setup.chipset}"
          </div>
          <div>
            <span style={{ color: 'var(--mg)' }}>tagline</span> = "{profile.tagline}"
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ color: 'var(--gr)' }}>jay@justjaydev</span>
            <span style={{ color: 'var(--muted)' }}>:</span>
            <span style={{ color: 'var(--cy)' }}>~</span>
            <span style={{ color: 'var(--muted)' }}>$</span>{' '}
            <span className="caret" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;