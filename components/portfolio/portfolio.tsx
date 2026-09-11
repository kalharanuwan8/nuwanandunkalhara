'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Check, Copy, Download, GraduationCap, Mail, Menu, Sparkles, Trophy, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profile, projects, skillGroups, type Project, type Category } from '@/data/portfolio';
import { HeroPortrait } from './hero-portrait';
import { InteractiveBackground } from './interactive-background';

function GithubIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const categories: Category[] = ['All', 'Full-stack', 'AI & research', 'Client work'];

function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        ref.current.style.setProperty('--rx', `${(y - 0.5) * -7}deg`);
        ref.current.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
        ref.current.style.setProperty('--mx', `${x * 100}%`);
        ref.current.style.setProperty('--my', `${y * 100}%`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--rx', '0deg');
        ref.current?.style.setProperty('--ry', '0deg');
      }}
    >
      {children}
    </div>
  );
}

function Heading({ number, label, children }: { number: string; label: string; children: ReactNode }) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">
        <span>{number}</span> / {label}
      </p>
      <h2>{children}</h2>
    </div>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('home');
  const [selected, setSelected] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-20% 0px -55% 0px' }
    );
    document.querySelectorAll('main>section[id]').forEach(el => observer.observe(el));

    const update = () => {
      const d = document.documentElement;
      d.style.setProperty(
        '--scroll-progress',
        `${d.scrollHeight === innerHeight ? 0 : (scrollY / (d.scrollHeight - innerHeight)) * 100}%`
      );
    };
    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <InteractiveBackground />

      {/* Modern Header */}
      <header className="site-header">
        <a href="#home" className="wordmark" aria-label="Nuwanandun Kalhara home">
          HK<span>.</span>
        </a>

        {/* Individual Pill Navigation Buttons */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {[
            ['work', 'Work'],
            ['about', 'About'],
            ['research', 'Research'],
            ['contact', 'Contact'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-pill ${active === id ? 'active' : ''}`}
              aria-current={active === id ? 'location' : undefined}
            >
              <span className="nav-pill-dot" aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>

        {/* Actions Area */}
        <div className="header-actions">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-github-circle"
            aria-label="GitHub profile"
            title="GitHub profile"
          >
            <GithubIcon size={18} />
          </a>
          <a className="nav-contact" href={`mailto:${profile.email}`}>
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            className="mobile-menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {menu && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={e => {
            if (e.key === 'Escape') setMenu(false);
          }}
        >
          {[
            ['work', 'Work'],
            ['about', 'About'],
            ['research', 'Research'],
            ['contact', 'Contact'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}

      <main id="main">
        {/* Hero Section */}
        <section className="hero shell" id="home">
          <div className="hero-topline">
            <p className="eyebrow">FULL-STACK ARCHITECTURE / MACHINE LEARNING / REAL-WORLD SYSTEMS</p>
            <span>SRI LANKA (UTC+05:30)</span>
          </div>

          <div className="hero-grid">
            <div className="hero-copy">
              <p className="intro">
                <span className="tiny-line" /> Nuwanandun Kalhara
              </p>
              <h1>
                Code scales,<br></br>
                <span>AI thinks.</span>
              </h1>
              <p className="hero-description flex text-justify">
                    Software engineer and AI researcher building reliable, high-performance systems from scalable web platforms to applied multimodal machine learning.
              </p>

              <div className="hero-actions">
                <a className="button primary" href="#work">
                  Discover my work <ArrowDown size={17} />
                </a>
                <a className="cv-link" href={profile.cv} download>
                  Download CV <Download size={16} />
                </a>
              </div>

              <div className="hero-caption">
                <span>FULL STACK</span>
                <span>AI RESEARCH</span>
                <span>SOFTWARE ENGINEERING</span>
              </div>
            </div>

            {/* Clean Blended Hero Portrait Component */}
            <HeroPortrait />
          </div>

          <div className="hero-bottom">
            <span>
              SCROLL TO EXPLORE <ArrowDown size={13} />
            </span>
            <div className="hero-bottom-tech" aria-label="Core technologies">
              {['React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'FastAPI', 'Docker'].map(t => (
                <span key={t} className="tech-pill">{t}</span>
              ))}
            </div>
            <span>PORTFOLIO — 2026</span>
          </div>
        </section>

        {/* Selected Work Section */}
        <section id="work" className="section shell">
          <div className="section-heading-centered" data-reveal>
            <p className="eyebrow">
              <span>01</span> / SELECTED WORK
            </p>
            <h2>My Projects &amp; Architectures</h2>
            <p className="subheading-muted">Bringing ideas into reliable code.</p>
          </div>

          <Tabs defaultValue="All" className="project-tabs">
            <TabsList className="filter-list" aria-label="Filter projects">
              {categories.map(c => (
                <TabsTrigger key={c} value={c} className="filter-trigger">
                  {c}
                  <span>{c === 'All' ? projects.length : projects.filter(p => p.category === c).length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="project-grid">
                  {projects
                    .filter(p => category === 'All' || p.category === category)
                    .map(p => (
                      <Tilt key={p.id} className={`project-card ${p.accent}`}>
                        <button
                          type="button"
                          className="project-open"
                          onClick={() => setSelected(p)}
                          aria-label={`Explore ${p.name}`}
                        >
                          <div className="project-cover">
                            <div className="cover-top">
                              <span>{p.category}</span>
                              <ArrowUpRight size={21} />
                            </div>
                            <div className="project-emblem" aria-hidden="true">
                              <span>{p.mark}</span>
                              <div className="emblem-ring" />
                              <div className="emblem-ring ring-two" />
                            </div>
                            <div className="cover-bottom">
                              <span>{p.type}</span>
                              <span>{String(projects.indexOf(p) + 1).padStart(2, '0')}</span>
                            </div>
                          </div>
                          <div className="project-content">
                            <h3>{p.name}</h3>
                            <p>{p.summary}</p>
                            <div className="project-tech">{p.stack.slice(0, 4).join(' / ')}</div>
                            <div className="project-card-footer">
                              <span className="project-explore">
                                Details <ArrowUpRight size={14} />
                              </span>
                              {p.github && (
                                <a
                                  href={p.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="project-repo-link"
                                  onClick={e => e.stopPropagation()}
                                  title={`View ${p.name} on GitHub`}
                                >
                                  <GithubIcon size={13} />
                                  <span>Repo</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </button>
                      </Tilt>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Project Details Modal */}
          <Dialog
            open={selected !== null}
            onOpenChange={open => {
              if (!open) setSelected(null);
            }}
          >
            <DialogContent className="project-dialog">
              {selected && (
                <>
                  <div className={`dialog-mast ${selected.accent}`}>
                    <span className="eyebrow">
                      {selected.category} / {selected.type}
                    </span>
                    <div className="dialog-mark" aria-hidden="true">
                      {selected.mark}
                      <ArrowUpRight size={48} />
                    </div>
                  </div>
                  <DialogTitle className="dialog-title">{selected.name}</DialogTitle>
                  <DialogDescription className="dialog-description">{selected.description}</DialogDescription>
                  <div className="dialog-body">
                    <h4>Inside the project</h4>
                    <ul>
                      {selected.features.map(f => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <h4>Built with</h4>
                    <div className="tags">
                      {selected.stack.map(t => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="dialog-actions">
                    {selected.github && (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button primary"
                      >
                        <GithubIcon size={16} /> View on GitHub <ArrowUpRight size={15} />
                      </a>
                    )}
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${selected.name}`)}`}
                      className="button secondary"
                    >
                      Ask me about this project <ArrowUpRight size={16} />
                    </a>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="shell section">
            <Heading number="02" label="ENGINEER PROFILE">
              <span className="muted-heading">Guided by curiosity, sharpened by discipline</span>
            </Heading>
            <div className="about-grid">
              <Tilt className="about-photo">
                <Image
                  src="/images/kalhara-profile.png"
                  alt="Studio portrait of Nuwanandun Kalhara"
                  width={1254}
                  height={1254}
                />
                <div className="photo-label">
                  <span>NUWANANDUN KALHARA</span>
                  <span>SOFTWARE ENGINEERING UNDERGRADUATE</span>
                </div>
              </Tilt>
              <div className="about-copy " data-reveal>
                <p className="about-lead">
                  Where curiosity meets consistency
                </p>
                <p className="text-justify">
                  I’m a final-year Software Engineering undergraduate at General Sir John Kotelawala Defence University. Alongside my degree, I engineer internal automation systems and customer-facing web platforms at HardTalk. My engineering journey connects responsive frontend interfaces, distributed microservices, cloud infrastructure, and practical multimodal AI models.
                </p>
                  
                <div className="education">
                  <GraduationCap size={25} />
                  <div>
                    <strong>BSc (Hons) in Software Engineering</strong>
                    <span>General Sir John Kotelawala Defence University</span>
                    <small>Final-year undergraduate · Sri Lanka</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="experience" data-reveal>
              <div className="experience-meta">
                <p className="eyebrow">WHERE I’M BUILDING</p>
                <span>NOV 2025 — PRESENT</span>
              </div>
              <div className="experience-main">
                <h3>
                  Full Stack Developer <ArrowUpRight size={25} />
                </h3>
                <p>
                  HardTalk (Pvt) Ltd <span>Contract</span>
                </p>
                <ul>
                  <li>Building production MERN and PERN applications for internal automation and customer platforms.</li>
                  <li>Architected a project management platform and a content distribution system for publishing and analytics.</li>
                  <li>Delivering resilient software solutions across diverse stacks and modern cloud services.</li>
                </ul>
              </div>
            </div>

            {/* Technical Toolbox */}
            <div className="toolbox">
              <div className="toolbox-heading">
                <p className="eyebrow">THE TOOLBOX</p>
                <h3>
                  Modular layers.<br />
                  One unified system.
                </h3>
              </div>
              <Tabs defaultValue="Interface" className="skills-tabs">
                <TabsList className="skills-list" aria-label="Explore technical skills">
                  {skillGroups.map(g => (
                    <TabsTrigger key={g.label} value={g.label}>
                      {g.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {skillGroups.map(g => (
                  <TabsContent value={g.label} key={g.label} className="skill-panel">
                    <h4>{g.title}</h4>
                    <p>{g.detail}</p>
                    <div className="tags">
                      {g.skills.map(t => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>

        {/* Research Section */}
        <section id="research" className="section shell">
          <Heading number="03" label="APPLIED AI & RESEARCH">
            Exploring what’s next.
          </Heading>
          <div className="research-grid">
            <Tilt className="research-card">
              <div className="research-top">
                <Sparkles size={28} strokeWidth={1.4} />
                <span>ONGOING RESEARCH &amp; REPO</span>
              </div>
              <h3>
                Technology that<br />
                pays attention.
              </h3>
              <p>
                An adaptive multimodal learning system for children with ADHD. Machine learning analyzes attention patterns in real time and triggers gamified micro-interventions to sustain focus.
              </p>
              <div className="tags">
                <span>Multimodal ML</span>
                <span>Real-time Systems</span>
                <span>Adaptive Interventions</span>
              </div>
              <div className="publication">
                <p className="eyebrow">CONFERENCE PRESENTATION / 2026</p>
                <h4>
                  Real-Time Attention Monitoring and Adaptive Interventions for Children with ADHD: A Systematic Review
                </h4>
                <p>Presented at SASIGD 2026, Hyderabad, India. IEEE SSIT technically co-sponsored.</p>
              </div>
            </Tilt>

            <div className="recognition" data-reveal>
              <p className="eyebrow">
                <Trophy size={15} /> MILESTONES &amp; LEADERSHIP
              </p>
              <div className="milestone">
                <span>2025 / ROOTCODE</span>
                <h4>Tech Triathlon Finalist</h4>
                <p>Tech Triathlon 2025</p>
              </div>
              <div className="milestone">
                <span>IEEEXTREME 18.0</span>
                <h4>37th in Sri Lanka</h4>
                <p>IEEE Global Competitive Programming</p>
              </div>
              <div className="community">
                <h3>Leadership &amp; Community</h3>
                <p>
                  <strong>Vice Chair, Public Visibility</strong>
                  <span>LetsTalk 25 · IEEE Young Professionals Sri Lanka</span>
                </p>
                <p>
                  <strong>Logistics Coordinator</strong>
                  <span>LetsTalk 24 · IEEE Young Professionals Sri Lanka</span>
                </p>
                <p>
                  <strong>Student Ambassador</strong>
                  <span>IEEEXtreme 18.0 · KDU</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="shell">
            <p className="eyebrow">04 / START A CONVERSATION</p>
            <div className="contact-grid">
              <h2>
                Your next idea.<br />
                <span>Let’s build it.</span>
              </h2>
              <div>
                <p>
                  Have an engineering opening, project, or technical problem worth solving? Let’s connect.
                </p>
                <a className="contact-email" href={`mailto:${profile.email}`}>
                  {profile.email}
                  <ArrowUpRight size={24} />
                </a>
                <div className="contact-actions">
                  <a className="button primary" href={`mailto:${profile.email}`}>
                    Say hello <Mail size={16} />
                  </a>
                  <button type="button" className="copy-button" onClick={copy}>
                    {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Email copied' : 'Copy email'}
                  </button>
                </div>
                <p role="status" className="copy-status">
                  {copyError
                    ? 'Please select and copy the email address above.'
                    : copied
                    ? 'Email address copied to clipboard.'
                    : ''}
                </p>
              </div>
            </div>

            <div className="contact-bottom">
              <span>BASED IN SRI LANKA · AVAILABLE GLOBALLY</span>
              <div>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub <ArrowUpRight size={15} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight size={15} />
                </a>
                <a href={profile.cv} download>
                  Résumé <Download size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer shell">
        <a className="wordmark" href="#home">
          HK<span>.</span>
        </a>
        <span>© 2026 Nuwanandun Kalhara · Full Stack Developer &amp; AI Researcher</span>
        <a href="#home">Back to the top ↑</a>
      </footer>
    </>
  );
}
