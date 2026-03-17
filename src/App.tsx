import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CloudUpload,
  Catalog,
  Share,
  Security,
  DataBase,
  Locked,
  CheckmarkFilled,
  ArrowRight,
  Collaborate,
  DocumentSecurity,
  Car,
  Home as HomeIcon,
  HealthCross,
  FingerprintRecognition,
  SailboatCoastal,
} from '@carbon/icons-react';

// ── Design tokens (matches v2) ──
const CORAL = '#E8614D';
const TEAL = '#1B7B6F';
const GOLDEN = '#E5A838';
const BG = '#FAFAF8';
const TEXT = '#1A1A1A';

const SUPABASE_URL = 'https://styjrgioxihcilpjffhp.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// ── Animation presets ──
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ── Waitlist Form ──
function WaitlistForm({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          source: params.get('utm_source') || 'direct',
          utm_medium: params.get('utm_medium') || null,
          utm_campaign: params.get('utm_campaign') || null,
        }),
      });

      if (res.ok) {
        setStatus('success');
        // @ts-expect-error Meta Pixel
        window.fbq?.('track', 'Lead');
        // @ts-expect-error Google
        window.gtag?.('event', 'sign_up', { method: 'waitlist' });
        // @ts-expect-error TikTok
        window.ttq?.track?.('SubmitForm');
      } else if (res.status === 409) {
        setStatus('error');
        setErrorMsg('Du er allerede på listen!');
      } else {
        throw new Error('Signup failed');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Noe gikk galt. Prøv igjen.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 text-center"
        style={{
          backgroundColor: variant === 'dark' ? 'rgba(27,123,111,0.15)' : `${TEAL}10`,
          border: `1px solid ${variant === 'dark' ? 'rgba(27,123,111,0.3)' : `${TEAL}30`}`,
        }}
      >
        <CheckmarkFilled size={32} style={{ color: TEAL }} className="mx-auto mb-3" />
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: variant === 'dark' ? '#fff' : TEXT }}
        >
          Du er på listen!
        </h3>
        <p style={{ color: variant === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.6)' }} className="text-sm">
          Vi gir deg beskjed når Levd er klar. Takk for tilliten.
        </p>
      </motion.div>
    );
  }

  const isDark = variant === 'dark';

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="din@epost.no"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-5 py-3.5 rounded-xl text-base outline-none transition-all"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#fff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
            color: isDark ? '#fff' : TEXT,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold transition-transform hover:scale-[1.03] disabled:opacity-60 whitespace-nowrap"
          style={{ backgroundColor: CORAL, color: '#fff' }}
        >
          {status === 'loading' ? 'Sender...' : 'Få tidlig tilgang'}
          {status !== 'loading' && <ArrowRight size={18} />}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-sm mt-3" style={{ color: CORAL }}>{errorMsg}</p>
      )}
      <p className="text-xs mt-4" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,26,0.4)' }}>
        Gratis. Ingen spam. Avmeld når som helst.
      </p>
    </div>
  );
}

// ── Navbar ──
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(250,250,248,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
        >
          Levd
        </span>
        <a
          href="#signup"
          className="px-5 py-2 rounded-xl text-sm font-medium transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: TEXT, color: BG }}
        >
          Få tidlig tilgang
        </a>
      </div>
    </nav>
  );
}

// ── Hero ──
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: BG }}>
      {/* Decorative shapes */}
      <motion.div
        className="absolute -right-20 top-1/4 w-[420px] h-[420px] rounded-[3rem] hidden lg:block"
        style={{ backgroundColor: CORAL }}
        initial={{ opacity: 0, x: 80, rotate: -8 }}
        animate={{ opacity: 0.9, x: 0, rotate: -6 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
      <motion.div
        className="absolute right-32 top-[38%] w-[200px] h-[200px] rounded-[2rem] hidden lg:block"
        style={{ backgroundColor: GOLDEN, opacity: 0.7 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
      />
      <motion.div
        className="absolute right-16 top-[22%] w-[120px] h-[120px] rounded-[1.5rem] hidden lg:block"
        style={{ backgroundColor: TEAL, opacity: 0.6 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              style={{ backgroundColor: `${CORAL}15`, color: CORAL, border: `1px solid ${CORAL}30` }}
            >
              Snart lansering
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
          >
            Alt du eier.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mt-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: CORAL }}
          >
            Alt du er.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: TEAL }}
          >
            Ett sted.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-lg leading-relaxed max-w-md"
            style={{ color: 'rgba(26,26,26,0.7)' }}
          >
            Dump alle dokumentene dine. Levd sorterer, kategoriserer og oppretter eiendelene dine automatisk. Du slipper å gjøre noe.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 max-w-md" id="signup">
            <WaitlistForm variant="light" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Problem ──
const PROBLEMS = [
  'Hvor har vi forsikret huset?',
  'Hvor ligger bilpapirene?',
  'Når gikk servicen ut?',
  'Hva dekker forsikringen egentlig?',
  'Hvor la vi kjøpekontrakten?',
  'Har familien tilgang om noe skjer?',
  'Hva betyr egentlig det legen sa?',
  'Hva burde jeg spurt legen om?',
  'Hvor er prøvesvarene mine fra i fjor?',
];

function Problem() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: '#F4F3EF' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
          style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
        >
          Kjenner du igjen dette?
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PROBLEMS.map((q) => (
            <motion.div
              key={q}
              variants={fadeUp}
              className="rounded-2xl p-6 border transition-shadow hover:shadow-md cursor-default"
              style={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <p className="text-lg font-medium italic leading-snug" style={{ color: TEXT }}>
                «{q}»
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── How it works ──
const STEPS = [
  {
    icon: CloudUpload,
    title: 'Dump alt',
    desc: 'Last opp alle dokumentene dine. Forsikringsbrev, kontrakter, kvitteringer, bilder. Bare slipp dem inn.',
    color: CORAL,
  },
  {
    icon: Catalog,
    title: 'Vi ordner resten',
    desc: 'Levd leser, sorterer og kobler hvert dokument til rett eiendel. Bilen, båten, huset. Automatisk.',
    color: TEAL,
  },
  {
    icon: Share,
    title: 'Del trygt',
    desc: 'Gi familien tilgang til det som betyr noe. På dine premisser.',
    color: GOLDEN,
  },
];

function HowItWorks() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
        >
          Slik fungerer det
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center text-lg mb-16 max-w-md mx-auto"
          style={{ color: 'rgba(26,26,26,0.6)' }}
        >
          Du laster opp. Vi tar oss av resten.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {STEPS.map((s) => (
            <motion.div key={s.title} variants={fadeUp} className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: s.color }}
              >
                <s.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: TEXT }}>
                {s.title}
              </h3>
              <p className="text-base leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(26,26,26,0.65)' }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Features ──
const FEATURES = [
  {
    icon: CloudUpload,
    title: 'Bare last opp',
    desc: 'Slipp inn 10 eller 100 dokumenter. Levd leser innholdet, gjenkjenner typen og sorterer alt for deg.',
    color: CORAL,
  },
  {
    icon: Catalog,
    title: 'Eiendeler opprettes automatisk',
    desc: 'Laster du opp et forsikringsbrev for bilen? Levd oppretter bilen og kobler dokumentet. Uten at du løfter en finger.',
    color: TEAL,
  },
  {
    icon: DocumentSecurity,
    title: 'Kryptert fra start',
    desc: 'AES-256 kryptering på din enhet. Bare du har nøkkelen. Ikke engang vi kan lese filene dine.',
    color: GOLDEN,
  },
  {
    icon: HealthCross,
    title: 'Forstå helsen din',
    desc: 'Last opp prøvesvar og epikriser. Levd oversetter legespråk til vanlig norsk og foreslår spørsmål du bør stille.',
    color: CORAL,
  },
  {
    icon: Collaborate,
    title: 'Familiedeling',
    desc: 'Del utvalgte dokumenter med familien. Alle ser det de trenger, ingenting mer.',
    color: TEAL,
  },
  {
    icon: SailboatCoastal,
    title: 'Båt, bil, bolig',
    desc: 'Hver eiendel får sin egen side med dokumenter, historikk og oversikt. Alt samlet.',
    color: GOLDEN,
  },
];

function Features() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: TEAL }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
          style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}
        >
          Du dumper. Vi sorterer.
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="rounded-2xl p-8 transition-shadow hover:shadow-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <f.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#fff' }}>
                {f.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Use cases section (tabbed: Bil, Bolig, Helse) ──
const USE_CASES = [
  {
    key: 'bil',
    label: 'Bil',
    icon: Car,
    color: CORAL,
    heading: 'Servicehistorikk, samlet',
    description: 'Aldri lur på når bilen sist var på service. Last opp kvitteringer og verkstedrapporter. Levd kobler alt til rett bil.',
    card: {
      title: 'Servicekvittering',
      source: { label: 'Fra verkstedet', text: '«60 000 km service utført. Byttet bremseskiver foran, oljefilter, pollenfilter og bremsevæske. Neste service ved 80 000 km.»' },
      result: { label: 'Levd oppsummerer', text: 'Stor service utført. Bremser og filter byttet. Neste service om 20 000 km. Levd varsler deg når det nærmer seg.' },
      action: { label: 'Koblet til', text: 'Tesla Model 3 2022 — Service #3' },
    },
  },
  {
    key: 'bolig',
    label: 'Bolig',
    icon: HomeIcon,
    color: TEAL,
    heading: 'Alt om boligen, ett sted',
    description: 'Takstrapporter, forsikringsbrev, oppussingskvitteringer. Levd samler alt og gir deg oversikt over boligens historikk.',
    card: {
      title: 'Takstrapport',
      source: { label: 'Fra takstmann', text: '«Tilstandsgrad 2 på våtrom. Membran fra 2008, anbefalt utbedring innen 3-5 år. Elektrisk anlegg TG1. Estimert markedsverdi: 4 850 000 kr.»' },
      result: { label: 'Levd oppsummerer', text: 'Badet bør oppgraderes i løpet av noen år. Resten av boligen er i god stand. Verdi estimert til 4,85 mill.' },
      action: { label: 'Koblet til', text: 'Storgata 12B — Takst 2025' },
    },
  },
  {
    key: 'helse',
    label: 'Helse',
    icon: HealthCross,
    color: GOLDEN,
    heading: 'Helsen din, på ditt språk',
    description: 'Legejournaler er fulle av faguttrykk. Levd oversetter det til vanlig norsk og foreslår spørsmål du bør stille legen.',
    card: {
      title: 'Prøvesvar forklart',
      source: { label: 'Fra epikrisen', text: '«Pasienten har forhøyet CRP og leukocytose forenlig med akutt inflammatorisk respons.»' },
      result: { label: 'Levd forklarer', text: 'Blodprøvene viser tegn på betennelse i kroppen. CRP og hvite blodceller er høyere enn normalt, noe som betyr at immunforsvaret jobber med noe.' },
      action: { label: 'Spør legen din', text: '«Hva kan være årsaken til betennelsen, og trenger vi flere undersøkelser?»' },
    },
  },
];

function UseCases() {
  const [active, setActive] = useState(0);
  const c = USE_CASES[active];

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: '#F4F3EF' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
        >
          Se det i praksis
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center text-lg mb-12 max-w-lg mx-auto"
          style={{ color: 'rgba(26,26,26,0.6)' }}
        >
          Last opp et dokument. Levd gjør resten.
        </motion.p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {USE_CASES.map((uc, i) => (
            <button
              key={uc.key}
              onClick={() => setActive(i)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: active === i ? uc.color : 'transparent',
                color: active === i ? '#fff' : 'rgba(26,26,26,0.6)',
                border: active === i ? 'none' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <uc.icon size={18} />
              {uc.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h3
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
            >
              {c.heading}
            </h3>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: 'rgba(26,26,26,0.7)' }}
            >
              {c.description}
            </p>
            <div className="space-y-4">
              {[
                { title: 'Last opp dokumentet', desc: 'Slipp inn filen. Levd leser og gjenkjenner innholdet automatisk.' },
                { title: 'Automatisk sortert', desc: 'Dokumentet kobles til rett eiendel og kategori uten at du gjør noe.' },
                { title: 'Alltid tilgjengelig', desc: 'Finn det igjen når du trenger det. Delt med familien om du vil.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckmarkFilled size={20} style={{ color: c.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: TEXT }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(26,26,26,0.6)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-8 border"
            style={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${c.color}15` }}
              >
                <c.icon size={20} style={{ color: c.color }} />
              </div>
              <span className="font-semibold" style={{ color: TEXT }}>{c.card.title}</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FEF2F2' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'rgba(26,26,26,0.5)' }}>{c.card.source.label}</p>
                <p className="text-sm italic" style={{ color: TEXT }}>{c.card.source.text}</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight size={20} style={{ color: c.color, transform: 'rotate(90deg)' }} />
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: `${c.color}10` }}>
                <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.card.result.label}</p>
                <p className="text-sm" style={{ color: TEXT }}>{c.card.result.text}</p>
              </div>
              <div className="rounded-xl p-4 border" style={{ borderColor: `${c.color}40`, backgroundColor: `${c.color}08` }}>
                <p className="text-xs font-medium mb-1" style={{ color: c.color }}>{c.card.action.label}</p>
                <p className="text-sm" style={{ color: TEXT }}>{c.card.action.text}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Trust ──
const TRUST_ITEMS = [
  { icon: Security, label: 'AES-256 kryptering' },
  { icon: DataBase, label: 'Data lagret i EU' },
  { icon: Locked, label: 'BankID (kommer)' },
  { icon: FingerprintRecognition, label: '100% norsk' },
];

function Trust() {
  return (
    <section className="py-14" style={{ backgroundColor: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {TRUST_ITEMS.map((t) => (
            <motion.div key={t.label} variants={fadeUp} className="flex items-center gap-3">
              <t.icon size={24} style={{ color: TEAL }} />
              <span
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(26,26,26,0.55)' }}
              >
                {t.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Social proof / who it's for ──
const PERSONAS = [
  {
    icon: HomeIcon,
    title: 'Boligeiere',
    desc: 'Forsikring, vedlikehold, oppussing og takst. Alt samlet for boligen din.',
    color: CORAL,
  },
  {
    icon: Car,
    title: 'Bileiere',
    desc: 'Servicebøker, forsikring, kjøpekontrakter. Slå opp bilen direkte fra Vegvesenet.',
    color: TEAL,
  },
  {
    icon: SailboatCoastal,
    title: 'Båteiere',
    desc: 'Motorlogg, forsikring, vedlikehold og sesongklargjøring. Alt for båten samlet.',
    color: '#2563EB',
  },
  {
    icon: Collaborate,
    title: 'Familier',
    desc: 'Del trygt med familien. Alle har tilgang til det viktige, uansett hva som skjer.',
    color: GOLDEN,
  },
];

function WhoItsFor() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: '#F4F3EF' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
          style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
        >
          Bygget for deg
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {PERSONAS.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="rounded-2xl p-8 border transition-shadow hover:shadow-md"
              style={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${p.color}15` }}
              >
                <p.icon size={24} style={{ color: p.color }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: TEXT }}>
                {p.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(26,26,26,0.65)' }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Final CTA ──
function FinalCTA() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: TEXT }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}
          >
            Vær blant de første
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Få tidlig tilgang til Levd og vær med på å forme fremtidens livsplattform. Helt gratis i beta.
          </motion.p>
          <motion.div variants={fadeUp} className="max-w-md mx-auto">
            <WaitlistForm variant="dark" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer() {
  return (
    <footer className="py-12" style={{ backgroundColor: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: TEXT }}
          >
            Levd
          </span>
          <a
            href="mailto:hei@levd.ai"
            className="text-sm transition-colors hover:underline"
            style={{ color: 'rgba(26,26,26,0.5)' }}
          >
            Kontakt
          </a>
          <p className="text-xs" style={{ color: 'rgba(26,26,26,0.35)' }}>
            © {new Date().getFullYear()} Levd.ai. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main ──
export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <UseCases />
      <Trust />
      <WhoItsFor />
      <FinalCTA />
      <Footer />
    </div>
  );
}
