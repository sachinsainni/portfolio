'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Mail, Phone, Globe, ArrowUpRight, ChevronDown, Code2, Database, Cloud, Shield, Layers, Zap } from 'lucide-react';

const HeroScene = dynamic(() => import('./components/HeroScene'), { ssr: false });
const SkillsGlobe = dynamic(() => import('./components/SkillsGlobe'), { ssr: false });

function GithubIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
}
function LinkedinIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}

const NAV_ITEMS = ['about', 'experience', 'projects', 'skills', 'contact'];

const EXPERIENCE = [
  {
    role: 'Software Engineer', company: 'Telemune Software Solutions', location: 'Chandigarh',
    period: 'Jan 2023 – Present', type: 'Full-time',
    bullets: [
      'Led end-to-end architecture of WMMM, a multi-tenant WhatsApp Business SaaS (Spring Boot + Next.js) with 20+ REST APIs, reducing client onboarding by 60%.',
      'Integrated Meta WhatsApp Business API with real-time WABA analytics and date-range presets across 10+ client accounts.',
      'Optimized CRBT backend for Airtel & Idea telecom via query tuning and Redis caching — cut API latency by 35%.',
      'Shipped Google OAuth2 + JWT in under 2 weeks after resolving 4 critical production auth bugs (CORS, redirect URI, stale sessions).',
      'Introduced AES-256 encrypted credential storage — passed internal security review on first attempt.',
      'Mentored 2 junior engineers, cutting onboarding ramp-up from 4 weeks to 2.',
    ],
  },
  {
    role: 'Software Engineer Intern', company: 'MountBlue', location: 'Remote',
    period: 'Jun 2022 – Sept 2022', type: 'Internship',
    bullets: [
      'Built 15+ REST APIs for an HR Management System (Java, Spring Boot) serving 200+ users, with 80%+ test coverage via JUnit & Mockito.',
      'Introduced structured request logging across 3 cross-functional teams — reduced API debugging time by 30%.',
      'Automated CI/CD pipelines with Jenkins, enabling same-day hotfix deployment.',
    ],
  },
];

const PROJECTS = [
  {
    name: 'WMMM', full: 'WhatsApp Business Management Platform',
    desc: 'Multi-tenant SaaS with WABA registration, analytics pipeline, webhook config, and RBAC. All credentials secured with AES-256 encryption.',
    stack: ['Java', 'Spring Boot', 'Next.js', 'PostgreSQL', 'Meta API', 'OAuth2', 'JWT', 'Docker'],
    link: 'https://github.com/sachinsainni', kpi: '60% faster onboarding',
  },
  {
    name: 'ChatWave', full: 'Real-Time Chat Platform',
    desc: 'JWT-secured WebSocket chat with sub-100ms delivery under load. Tested with Apache JMeter across concurrent sessions.',
    stack: ['React', 'Spring Boot', 'MongoDB', 'WebSockets', 'Spring Security', 'JWT'],
    link: 'https://github.com/sachinsainni', kpi: 'Sub-100ms latency',
  },
  {
    name: 'AirBook', full: 'Airline Reservation System',
    desc: 'Full-stack booking platform with RBAC, flight search, and seat reservation using Spring MVC and Hibernate ORM.',
    stack: ['Spring MVC', 'Hibernate', 'MySQL', 'Spring Security'],
    link: 'https://github.com/sachinsainni', kpi: 'End-to-end booking',
  },
];

const SKILLS = [
  { name: 'Languages', icon: Code2, items: ['Java', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'] },
  { name: 'Frameworks', icon: Layers, items: ['Spring Boot', 'Spring Security', 'Next.js', 'React', 'Hibernate/JPA', 'Tailwind CSS'] },
  { name: 'Databases', icon: Database, items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'] },
  { name: 'Cloud & DevOps', icon: Cloud, items: ['AWS (EC2, S3, RDS)', 'Docker', 'Jenkins', 'GitHub Actions', 'CI/CD'] },
  { name: 'APIs & Auth', icon: Shield, items: ['REST', 'OAuth2', 'JWT', 'WebSockets', 'Meta WhatsApp API', 'Google OAuth2'] },
  { name: 'Tools & Practices', icon: Zap, items: ['Git', 'Postman', 'Apache JMeter', 'Linux', 'Agile', 'Microservices', 'System Design'] },
];

const STATS = [
  { value: 3, suffix: '+', label: 'Years Exp' },
  { value: 20, suffix: '+', label: 'REST APIs' },
  { value: 60, suffix: '%', label: 'Faster Onboarding' },
  { value: 35, suffix: '%', label: 'Latency Cut' },
];

const TECH_MARQUEE = ['Java', 'Spring Boot', 'Next.js', 'React', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'OAuth2', 'JWT', 'TypeScript', 'MongoDB', 'WebSockets', 'Jenkins', 'GitHub Actions'];

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}>
      {children}
    </motion.div>
  );
}

function SlideIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function TypeWriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, 40);
    return () => clearInterval(t);
  }, [text]);
  return <><span>{displayed}</span>{!done && <span className="blink">|</span>}</>;
}

export default function Portfolio() {
  const [active, setActive] = useState('about');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    NAV_ITEMS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const } }),
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Custom cursor */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y, transform: `translate(-50%, -50%) scale(${hovering ? 2.5 : 1})`, background: hovering ? 'var(--accent3)' : 'var(--accent2)' }} />
      <div className="cursor-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Noise + Orbs */}
      <div className="noise" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Scroll bar */}
      <div className="scroll-track">
        <motion.div className="scroll-fill" style={{ scaleX }} />
      </div>

      {/* ── NAV ── */}
      <motion.nav className="nav" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <span className="nav-logo">SS</span>
        <div className="nav-links">
          {NAV_ITEMS.map(id => (
            <a key={id} href={`#${id}`} className={`nav-link${active === id ? ' active' : ''}`}
              onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
              {id}
            </a>
          ))}
        </div>
        <a href="mailto:sachins98169@gmail.com" className="nav-cta"
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          hire me →
        </a>
      </motion.nav>

      <section id="about" className="hero">
        {/* 3D background scene */}
        <HeroScene />
        <div style={{ maxWidth: 960, position: 'relative', zIndex: 2 }}>

          {/* Grid lines decoration */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03, backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: 0 }} />

          <motion.div className="hero-eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="status-dot" />
            <span className="eyebrow-text">available for opportunities</span>
          </motion.div>

          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            Sachin
            <span className="hero-title-gradient">Saini</span>
          </motion.h1>

          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <TypeWriter text="< Software Engineer — Backend / Full-Stack />" />
          </motion.p>

          <motion.p className="hero-desc" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }}>
            3+ years building backend systems & web apps. Delivered a multi-tenant SaaS with 20+ REST APIs, cutting onboarding by <strong>60%</strong> and API latency by <strong>35%</strong>.
          </motion.p>

          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }}>
            <a href="#projects" className="btn-primary"
              onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
              View Projects ↓
            </a>
            <a href="https://github.com/sachinsainni" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <GithubIcon size={15} /> GitHub
            </a>
            <a href="https://linkedin.com/in/sachin-saini-3a5455200" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <LinkedinIcon size={15} /> LinkedIn
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }}>
            <div className="stats-wrap">
              <div className="stats-row">
                {STATS.map((s, i) => (
                  <div key={i} className="stat-item">
                    <div className="stat-value"><CountUp target={s.value} suffix={s.suffix} /></div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <span>scroll</span>
          <ChevronDown size={14} className="bounce" />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((t, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-sep">◆</span>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section">
        <div className="section-inner">
          <FadeUp style={{ marginBottom: 64 }}>
            <span className="section-label">02 / experience</span>
            <h2 className="section-title">Where I've Worked</h2>
          </FadeUp>
          <div className="timeline">
            <div className="timeline-rail" />
            {EXPERIENCE.map((job, i) => (
              <SlideIn key={i} delay={i * 0.12}>
                <div style={{ position: 'relative' }}>
                  <div className="timeline-node" style={{ top: 28 }} />
                  <div className="exp-card glow-card">
                    <div className="exp-header">
                      <div>
                        <div className="exp-role">{job.role}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="exp-co">{job.company}</span>
                          <span className="exp-loc">· {job.location}</span>
                        </div>
                      </div>
                      <div className="exp-meta">
                        <span className="exp-badge">{job.type}</span>
                        <span className="exp-period">{job.period}</span>
                      </div>
                    </div>
                    <div className="exp-bullets">
                      {job.bullets.map((b, j) => (
                        <motion.div key={j} className="exp-bullet"
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * j, duration: 0.4 }}
                          viewport={{ once: true }}>
                          <span className="bullet-mark">▸</span>
                          <span>{b}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section section-alt">
        <div className="section-wide">
          <FadeUp style={{ marginBottom: 64 }}>
            <span className="section-label">03 / projects</span>
            <h2 className="section-title">Things I've Built</h2>
          </FadeUp>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <motion.div key={i} className="project-card glow-card"
                custom={i} variants={cardVariants}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
                onClick={() => window.open(p.link, '_blank')}
                onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <div className="proj-top">
                  <div>
                    <div className="proj-num">0{i + 1}</div>
                    <div className="proj-name">{p.name}</div>
                  </div>
                  <ArrowUpRight size={20} className="proj-arrow" />
                </div>
                <div className="proj-full">{p.full}</div>
                <div className="proj-desc">{p.desc}</div>
                <div className="proj-footer">
                  <div className="proj-kpi">
                    <Zap size={11} style={{ color: 'var(--accent3)' }} />
                    <span className="proj-kpi-text">{p.kpi}</span>
                  </div>
                  <div className="proj-tags">
                    {p.stack.map(s => <span key={s} className="tag">{s}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section">
        <div className="section-wide">
          <FadeUp style={{ marginBottom: 48 }}>
            <span className="section-label">04 / skills</span>
            <h2 className="section-title">Tech Stack</h2>
          </FadeUp>

          {/* 3D Globe */}
          <FadeUp delay={0.1} style={{ marginBottom: 48 }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 24, overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)',
              }} />
              {/* <div style={{ padding: '8px 0 0' }}>
                <p style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.15em', paddingTop: 20 }}>
                  DRAG TO EXPLORE · HOVER TO HIGHLIGHT
                </p>
                <SkillsGlobe />
              </div> */}
            </div>
          </FadeUp>

          {/* Skills cards below globe */}
          <div className="skills-grid">
            {SKILLS.map((cat, i) => (
              <motion.div key={i} className="skill-card"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-40px' }}>
                <div className="skill-icon">
                  <cat.icon size={16} />
                </div>
                <div className="skill-name">{cat.name}</div>
                <div className="skill-tags">
                  {cat.items.map(item => <span key={item} className="tag">{item}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="section section-alt" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="section-inner">
          <FadeUp>
            <span className="section-label" style={{ marginBottom: 20 }}>05 / education</span>
            <motion.div className="edu-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}>
              <div className="edu-badge" style={{ fontSize: 0 }}>
                <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>B</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="edu-degree">B.Tech — Electronics and Communication Engineering</div>
                <div className="edu-school">Guru Nanak Dev University, Punjab</div>
                <div className="edu-desc">Built full-stack projects during coursework, earning a software engineering internship at MountBlue in the final year.</div>
              </div>
              <div className="edu-year" style={{ flexShrink: 0 }}>
                <span className="tag">2018 – 2022</span>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section">
        <div className="contact-wrap">
          <FadeUp>
            <span className="section-label">06 / contact</span>
            <h2 className="contact-title">
              Let's Build<br />
              <span>Something.</span>
            </h2>
            <p className="contact-desc">Open to backend, full-stack, and SaaS roles. Drop me a line.</p>

            <div className="contact-cards">
              {[
                { icon: Mail, label: 'Email', val: 'sachins98169@gmail.com', href: 'mailto:sachins98169@gmail.com' },
                // { icon: Phone, label: 'Phone', val: '+91 73472 19361', href: 'tel:+917347219361' },
                // { icon: Globe, label: 'Portfolio', val: 'sachinsainni.github.io', href: 'https://sachinsainni.github.io/portfolio' },
                { icon: LinkedinIcon, label: 'LinkedIn', val: 'linkedin.com/in/sachin-saini-3a5455200', href: 'https://linkedin.com/in/sachin-saini-3a5455200' },
                { icon: GithubIcon, label: 'GitHub', val: 'github.com/sachinsainni', href: 'https://github.com/sachinsainni' }
              ].map((c, i) => (
                <motion.a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-card"
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                  onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                  <div className="contact-icon"><c.icon size={16} /></div>
                  <span className="contact-lbl">{c.label}</span>
                  <span className="contact-val">{c.val}</span>
                </motion.a>
              ))}
            </div>

            {/* <div className="socials">
              {[
                { icon: GithubIcon, href: 'https://github.com/sachinsainni', label: 'GitHub' },
                { icon: LinkedinIcon, href: 'https://linkedin.com/in/sachin-saini-3a5455200', label: 'LinkedIn' },
              ].map((s, i) => (
                <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="social-btn" title={s.label}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                  <s.icon size={18} />
                </motion.a>
              ))}
            </div> */}
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span>© 2025 Sachin Saini</span>
        <span>Built with Next.js + Framer Motion</span>
      </footer>
    </div>
  );
}
