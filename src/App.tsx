import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://styjrgioxihcilpjffhp.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch waitlist count
    fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'count=exact',
      },
    })
      .then((res) => {
        const count = res.headers.get('content-range');
        if (count) {
          const total = count.split('/')[1];
          if (total && total !== '*') setWaitlistCount(parseInt(total));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMsg('');

    try {
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
          source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || null,
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || null,
        }),
      });

      if (res.ok) {
        setStatus('success');
        // Track conversion events
        if (typeof window !== 'undefined') {
          // @ts-expect-error Meta Pixel
          window.fbq?.('track', 'Lead');
          // @ts-expect-error Google
          window.gtag?.('event', 'sign_up', { method: 'waitlist' });
          // @ts-expect-error TikTok
          window.ttq?.track?.('SubmitForm');
        }
      } else if (res.status === 409) {
        setStatus('error');
        setErrorMsg('Du er allerede på listen! 🎉');
      } else {
        throw new Error('Signup failed');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Noe gikk galt. Prøv igjen.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex flex-col relative overflow-hidden">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-display text-xl font-semibold">Levd</span>
          </div>
          <a
            href="#signup"
            className="text-sm text-teal-300 hover:text-teal-200 transition-colors font-medium"
          >
            Få tidlig tilgang →
          </a>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 relative z-10">
          <div className="max-w-3xl text-center">
            <div className="animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-sm font-medium mb-6 border border-teal-500/30">
                🚀 Snart lansering — Få tidlig tilgang
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-fade-in-up">
              Alt du eier.{' '}
              <br className="hidden md:block" />
              Alt du er.{' '}
              <span className="gradient-text">Ett sted.</span>
            </h1>

            <p className="text-lg md:text-xl text-navy-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up-delay">
              Levd samler dokumenter, eiendeler, helse og familiedata på ett trygt,
              kryptert sted — med AI som hjelper deg holde oversikten.
            </p>

            {/* CTA Form */}
            <div id="signup" className="animate-fade-in-up-delay-2">
              {status === 'success' ? (
                <div className="bg-teal-500/20 border border-teal-500/40 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-white font-display text-xl mb-2">Du er på listen!</h3>
                  <p className="text-navy-200 text-sm">
                    Vi gir deg beskjed så snart Levd er klar. Takk for tilliten.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="din@epost.no"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all text-base"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-navy-900 font-semibold hover:from-teal-400 hover:to-teal-300 transition-all disabled:opacity-60 animate-pulse-glow whitespace-nowrap text-base"
                  >
                    {status === 'loading' ? 'Sender...' : 'Få tidlig tilgang'}
                  </button>
                </form>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
              )}
              {waitlistCount !== null && waitlistCount > 10 && status !== 'success' && (
                <p className="text-navy-300 text-xs mt-4">
                  🔥 {waitlistCount}+ har allerede registrert seg
                </p>
              )}
              <p className="text-navy-400 text-xs mt-4">
                Gratis. Ingen spam. Avmeld når som helst.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        {/* Scroll indicator */}
        <div className="pb-8 flex justify-center relative z-10">
          <div className="animate-bounce text-navy-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-navy-800 mb-6">
            Kjennes dette kjent?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                emoji: '📂',
                title: 'Dokumentkaos',
                desc: 'Forsikringsbrev i e-posten, skjøte i en skuff, bilpapirer... et sted.',
              },
              {
                emoji: '🏠',
                title: 'Ingen oversikt',
                desc: 'Hva er huset verdt? Når gikk servicen på bilen ut? Hva dekker forsikringen?',
              },
              {
                emoji: '👨‍👩‍👧‍👦',
                title: 'Familien vet ikke',
                desc: 'Hva skjer om noe skjer deg? Har familien tilgang til det de trenger?',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm card-hover border border-gray-100"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="font-display text-lg text-navy-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-navy-800 mb-4">
              Levd gir deg kontroll
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ett trygt sted for alt som betyr noe — med AI som gjør det enkelt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🔐',
                title: 'Kryptert dokumenthvelv',
                desc: 'Last opp dokumenter med klient-side kryptering (AES-256). Bare du har nøkkelen.',
              },
              {
                icon: '🚗',
                title: 'Eiendeler samlet',
                desc: 'Bil, båt, bolig — alt med historikk, dokumenter og automatisk verdi-oppdatering.',
              },
              {
                icon: '🤖',
                title: 'AI som forstår livet ditt',
                desc: 'Last opp et dokument — Levd leser, sorterer og kobler det til rett eiendel automatisk.',
              },
              {
                icon: '👨‍👩‍👧',
                title: 'Trygg familiedeling',
                desc: 'Del utvalgte dokumenter og oversikt med familien — på dine premisser.',
              },
              {
                icon: '📊',
                title: 'Livsindeks',
                desc: 'Se hele livet ditt i ett dashboard — økonomi, helse, eiendeler og dokumenter.',
              },
              {
                icon: '🇳🇴',
                title: 'Bygget for Norge',
                desc: 'Vegvesen-oppslag, norske dokumenttyper, og snart BankID-innlogging.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-navy-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-16 px-6 md:px-12 bg-navy-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
            Bygget med omtanke
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
            {[
              { value: 'AES-256', label: 'Kryptering' },
              { value: 'EU', label: 'Data lagret i EU' },
              { value: 'AI', label: 'Smart sortering' },
              { value: '100%', label: 'Norsk' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{item.value}</div>
                <div className="text-navy-300 text-sm mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-navy-800 mb-4">
            Vær blant de første
          </h2>
          <p className="text-gray-600 mb-10">
            Få tidlig tilgang til Levd og vær med på å forme fremtidens livsplattform.
            Helt gratis i beta-perioden.
          </p>

          {status === 'success' ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-display text-xl text-navy-800 mb-2">Du er allerede på listen!</h3>
              <p className="text-gray-600 text-sm">Vi gleder oss til å ha deg med.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="din@epost.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-base"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-white font-semibold hover:from-navy-600 hover:to-navy-700 transition-all disabled:opacity-60 whitespace-nowrap text-base"
              >
                {status === 'loading' ? 'Sender...' : 'Registrer deg'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-3">{errorMsg}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-gray-600 text-sm">Levd © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="mailto:hei@levd.ai" className="hover:text-navy-700 transition-colors">
              Kontakt oss
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
