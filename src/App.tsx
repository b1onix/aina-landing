import {useState} from 'react';
import type {ReactNode} from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ClipboardCheck,
  Database,
  FileCheck2,
  LockKeyhole,
  Menu,
  Network,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1663353104784-4568fbf87d9d?auto=format&fit=crop&fm=jpg&q=80&w=1600';

const logoMark = new URL('../shapes-aina.svg', import.meta.url).href;

const copyrightYear = 2026;

const navItems = [
  {label: 'Agent Aina', href: '#agent'},
  {label: 'Expertise', href: '#expertise'},
  {label: 'Workflow', href: '#workflow'},
  {label: 'Pricing', href: '#pricing'},
];

const clientNames = ['NaturaCorp', 'EcoTimber', 'GlobalForestry', 'VerdeSupply', 'SilvaSystems'];

const monitorItems = [
  {
    icon: FileCheck2,
    title: 'Certificate checks',
    copy: 'Validate supplier certificates, claims, dates, and scope before they enter the audit file.',
  },
  {
    icon: Database,
    title: 'Volume reconciliation',
    copy: 'Compare invoices, conversion factors, product groups, and outgoing claims across systems.',
  },
  {
    icon: Network,
    title: 'Supplier traceability',
    copy: 'Keep FSC and PEFC evidence connected from purchase order to finished product.',
  },
  {
    icon: AlertTriangle,
    title: 'Exception handling',
    copy: 'Surface missing documents, unusual ratios, and expired evidence while there is still time to act.',
  },
];

const serviceRows = [
  {
    icon: ShieldCheck,
    title: 'Audit readiness',
    copy: 'A structured evidence layer for FSC and PEFC Chain of Custody audits.',
  },
  {
    icon: ClipboardCheck,
    title: 'Document automation',
    copy: 'Extraction and routing for invoices, delivery notes, declarations, and supplier certificates.',
  },
  {
    icon: Search,
    title: 'Standards monitoring',
    copy: 'Practical interpretation of standard updates, policy changes, and internal procedure impact.',
  },
  {
    icon: LockKeyhole,
    title: 'Governance support',
    copy: 'Clear controls for claims, approvals, user access, and corrective action records.',
  },
];

const workflowSteps = [
  {
    title: 'Map the chain',
    copy: 'AINA starts with the real flow of materials, documents, roles, and systems already inside your business.',
  },
  {
    title: 'Build the control layer',
    copy: 'We define the checks that matter: certificates, claim language, volume logic, risk signals, and audit evidence.',
  },
  {
    title: 'Run continuous assurance',
    copy: 'Agent Aina monitors daily activity and keeps exceptions visible before they become audit problems.',
  },
];

const plans = [
  {
    name: 'Essential',
    price: '$29.99',
    note: 'For small teams that need a dependable document check workflow.',
    features: ['Automated document verification', 'Standard update watch', 'One workspace', 'Email support'],
    cta: 'Start Essential',
  },
  {
    name: 'Advanced',
    price: '$59.99',
    note: 'For active supply chains that need live checks and faster exception handling.',
    features: [
      'Everything in Essential',
      'Real-time exception detection',
      'ERP and database integration',
      'Five user accounts',
      'Priority support with Aina',
    ],
    cta: 'Get Advanced',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    note: 'For complex global operations and bespoke governance.',
    features: [
      'Unlimited users',
      'Custom AI model training',
      'Multi-site governance',
      'Dedicated compliance consultant',
      'On-premise options',
    ],
    cta: 'Contact Sales',
  },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3 text-aina-green" aria-label="AINA home">
      <img src={logoMark} alt="" aria-hidden="true" className="h-9 w-9 flex-none" />
      <span className="font-logo text-[1.45rem] font-extrabold leading-none">AINA</span>
    </a>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-aina-light px-5 py-5 md:hidden">
      <div className="flex items-center justify-between border-b border-aina-green/20 pb-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-aina-green/20 text-aina-green"
          aria-label="Close menu"
        >
          <X size={21} />
        </button>
      </div>
      <div className="flex flex-col gap-1 py-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="rounded-lg px-2 py-4 text-lg font-semibold text-aina-green"
          >
            {item.label}
          </a>
        ))}
      </div>
      <a
        href="#contact"
        onClick={onClose}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-aina-green px-5 py-3 font-bold text-white"
      >
        Consult With Us
        <ArrowRight size={18} />
      </a>
    </div>
  );
}

function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="text-3xl font-extrabold leading-tight text-aina-green md:text-4xl">{title}</h2>
      {children ? <div className="mt-4 text-base leading-7 text-aina-green/70">{children}</div> : null}
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-aina-light font-sans text-aina-green">
      <header className="sticky top-0 z-40 border-b border-aina-green/10 bg-aina-light/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-aina-green/75 transition-colors hover:text-aina-green"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-aina-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-aina-green/90"
            >
              Consult With Us
              <ArrowRight size={16} />
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-aina-green/20 text-aina-green md:hidden"
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        <section className="relative isolate overflow-hidden bg-aina-green text-white">
          <img
            src={heroImage}
            alt="Wooden walkway through a certified forest"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,60,68,0.96)_0%,rgba(0,60,68,0.78)_46%,rgba(0,60,68,0.34)_100%)]" />

          <div className="mx-auto flex min-h-[calc(100svh-136px)] max-w-7xl flex-col justify-between px-5 py-12 md:px-8 md:py-16">
            <div className="max-w-3xl pt-6 md:pt-10">
              <h1 className="text-5xl font-extrabold leading-[1.02] md:text-7xl">
                Agent Aina
              </h1>
              <p className="mt-5 max-w-2xl text-2xl font-extrabold leading-tight text-aina-yellow md:text-4xl">
                Compliance has a new name — Aina
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-aina-light/90">
                Your Compliance Intelligence — Always On. Agent Aina is at your service 24/7,
                continuously analysing your documents, your processes, and the latest FSC and
                PEFC Chain of Custody requirements.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-aina-yellow px-5 py-3 font-extrabold text-aina-green transition-colors hover:bg-white"
                >
                  Book a consultation
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#expertise"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 font-bold text-white transition-colors hover:border-white/50 hover:bg-white/10"
                >
                  See services
                </a>
              </div>
            </div>

            <div className="mt-12 grid overflow-hidden rounded-lg border border-white/18 bg-white text-aina-green shadow-sm lg:grid-cols-[0.8fr_1.2fr]">
              <div className="border-b border-aina-green/10 p-5 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold">Daily compliance queue</h2>
                    <p className="mt-1 text-sm text-aina-green/60">Agent Aina is at your service 24/7.</p>
                    </div>
                  <ShieldCheck className="h-6 w-6 text-aina-green" />
                </div>
              </div>
              <div className="grid divide-y divide-aina-green/10 md:grid-cols-3 md:divide-x md:divide-y-0">
                {[
                  ['She never sleeps.', 'Active'],
                  ['She never misses an update.', 'Tracking'],
                  ['She never forgets a rule.', 'Ready'],
                ].map(([label, state]) => (
                  <div key={label} className="p-5">
                    <p className="text-sm font-semibold text-aina-green/68">{label}</p>
                    <p
                      className={`mt-2 text-lg font-extrabold ${
                        state === 'Flagged' ? 'text-[#9b7610]' : 'text-aina-green'
                      }`}
                    >
                      {state}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-aina-green/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">
            <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
              <p className="text-sm font-bold text-aina-green">Used by certification-driven teams</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
                {clientNames.map((name) => (
                  <span key={name} className="text-sm font-extrabold text-aina-green/50">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="agent" className="bg-aina-light">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-24">
            <div>
              <SectionHeader title="Your Compliance Intelligence — Always On.">
                <p>
                  While you focus on what truly matters — running and growing your business — Aina works
                  tirelessly in the background, tracking every change, update and interpretation across
                  FSC and PEFC Chain of Custody.
                </p>
              </SectionHeader>
              <div className="space-y-4 border-l border-aina-green/20 pl-5">
                <p className="text-lg font-extrabold leading-7 text-aina-green">
                  She never sleeps. She never misses an update. She never forgets a rule.
                </p>
                <p className="leading-7 text-aina-green/70">
                  Aina continuously analyses your documents, your processes, and the latest standard
                  requirements, ensuring your organisation stays fully compliant, fully informed, and
                  fully prepared — at all times.
                </p>
                <p className="leading-7 text-aina-green/70">
                  Because in a world where standards evolve, supply chains shift and expectations rise…
                  You deserve an agent who evolves even faster.
                </p>
                <p className="text-lg font-extrabold leading-7 text-aina-green">
                  That’s why we are your chAIn. Strong where it matters. Smart where it counts.
                  Always connected. Always compliant.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-aina-green/10 bg-white">
              <div className="grid grid-cols-2 border-b border-aina-green/10">
                <div className="p-5">
                  <p className="text-sm text-aina-green/60">Open checks</p>
                  <p className="mt-1 text-3xl font-extrabold text-aina-green">18</p>
                </div>
                <div className="border-l border-aina-green/10 p-5">
                  <p className="text-sm text-aina-green/60">Ready for audit</p>
                  <p className="mt-1 text-3xl font-extrabold text-aina-green">94%</p>
                </div>
              </div>
              <div className="divide-y divide-aina-green/10">
                {[
                  ['Supplier invoice', 'Claim text checked', 'Complete'],
                  ['PEFC certificate', 'Scope needs review', 'Person needed'],
                  ['Conversion factor', 'Variance under threshold', 'Complete'],
                  ['Corrective action', 'Due in two days', 'Watch'],
                ].map(([type, detail, state]) => (
                  <div key={`${type}-${detail}`} className="grid gap-3 p-5 sm:grid-cols-[1fr_1.2fr_130px] sm:items-center">
                    <p className="font-extrabold text-aina-green">{type}</p>
                    <p className="text-sm text-aina-green/70">{detail}</p>
                    <p className="text-sm font-bold text-aina-green">{state}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="expertise" className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SectionHeader title="Compliance work without the paper chase.">
              <p>
                AINA combines AI tooling with hands-on FSC and PEFC consulting, so the system reflects
                how your supply chain actually works.
              </p>
            </SectionHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {monitorItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-aina-green/10 bg-aina-light p-6">
                  <item.icon className="h-6 w-6 text-aina-green" strokeWidth={1.9} />
                  <h3 className="mt-5 text-xl font-extrabold text-aina-green">{item.title}</h3>
                  <p className="mt-3 leading-7 text-aina-green/70">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-aina-light">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <SectionHeader title="Built for the details auditors ask about.">
                <p>
                  The service is narrow on purpose: chain-of-custody evidence, claims, suppliers,
                  procedure controls, and the operational habits that keep certification stable.
                </p>
              </SectionHeader>

              <div className="rounded-lg border border-aina-green/10 bg-white">
                {serviceRows.map((row) => (
                  <div
                    key={row.title}
                    className="grid gap-4 border-b border-aina-green/10 p-5 last:border-b-0 sm:grid-cols-[36px_1fr]"
                  >
                    <row.icon className="h-6 w-6 text-aina-green" strokeWidth={1.9} />
                    <div>
                      <h3 className="font-extrabold text-aina-green">{row.title}</h3>
                      <p className="mt-2 leading-7 text-aina-green/70">{row.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-aina-green text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">A clearer path from data to assurance.</h2>
              <p className="mt-5 max-w-xl leading-8 text-aina-light/75">
                Implementation starts with the way your team already operates. AINA fits around the
                procedures, systems, and audit expectations you have to defend.
              </p>
            </div>
            <div className="divide-y divide-white/20 rounded-lg border border-white/20 bg-white/10">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="grid gap-4 p-6 sm:grid-cols-[70px_1fr]">
                  <div className="text-2xl font-extrabold text-aina-yellow">{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="text-xl font-extrabold">{step.title}</h3>
                    <p className="mt-2 leading-7 text-aina-light/75">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <SectionHeader title="Pricing that scales with the control you need.">
              <p>
                Start with document verification, expand into live monitoring, or build a bespoke
                control environment for multiple sites.
              </p>
            </SectionHeader>

            <div className="grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex rounded-lg border p-6 ${
                    plan.featured
                      ? 'border-aina-green bg-aina-green text-white'
                      : 'border-aina-green/10 bg-aina-light text-aina-green'
                  }`}
                >
                  <div className="flex min-h-[420px] w-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-extrabold">{plan.name}</h3>
                        <p className={`mt-3 min-h-14 text-sm leading-6 ${plan.featured ? 'text-aina-light/75' : 'text-aina-green/70'}`}>
                          {plan.note}
                        </p>
                      </div>
                      {plan.featured ? <p className="text-sm font-extrabold text-aina-yellow">Recommended</p> : null}
                    </div>
                    <div className="mt-8">
                      <p className="text-4xl font-extrabold">{plan.price}</p>
                      {plan.price !== 'Custom' ? (
                        <p className={`mt-1 text-sm ${plan.featured ? 'text-aina-light/60' : 'text-aina-green/60'}`}>per month</p>
                      ) : null}
                    </div>
                    <ul className="mt-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex gap-3 text-sm leading-6 ${plan.featured ? 'text-aina-light/90' : 'text-aina-green/75'}`}
                        >
                          <Check className={`mt-1 h-4 w-4 flex-none ${plan.featured ? 'text-aina-yellow' : 'text-aina-green'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className={`mt-8 inline-flex items-center justify-center rounded-lg px-5 py-3 font-extrabold transition-colors ${
                        plan.featured
                          ? 'bg-aina-yellow text-aina-green hover:bg-white'
                          : 'border border-aina-green text-aina-green hover:bg-aina-green hover:text-white'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-aina-light">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <div className="grid gap-8 rounded-lg bg-aina-green p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">
                  Give your compliance team a better operating system.
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-aina-light/80">
                  Schedule a working session and we will map AINA to your FSC and PEFC requirements,
                  document flows, and audit calendar.
                </p>
              </div>
              <a
                href="mailto:hello@aina.consulting"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-aina-yellow px-5 py-3 font-extrabold text-aina-green transition-colors hover:bg-white"
              >
                hello@aina.consulting
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-aina-green/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1fr_auto] md:px-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-7 text-aina-green/60">
              AI consulting and compliance intelligence for certified forest-product supply chains.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <h3 className="font-extrabold text-aina-green">Solutions</h3>
              <ul className="mt-3 space-y-2 text-aina-green/60">
                <li><a href="#expertise" className="hover:text-aina-green">Audit readiness</a></li>
                <li><a href="#expertise" className="hover:text-aina-green">Document checks</a></li>
                <li><a href="#workflow" className="hover:text-aina-green">Workflow</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-aina-green">Company</h3>
              <ul className="mt-3 space-y-2 text-aina-green/60">
                <li><a href="#agent" className="hover:text-aina-green">Agent Aina</a></li>
                <li><a href="#pricing" className="hover:text-aina-green">Pricing</a></li>
                <li><a href="#contact" className="hover:text-aina-green">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-aina-green">Team</h3>
              <ul className="mt-3 space-y-2 text-aina-green/60">
                <li className="flex items-center gap-2"><Users size={14} /> Compliance leads</li>
                <li>Certification managers</li>
                <li>Operations teams</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-aina-green/10 py-5">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-xs text-aina-green/50 md:flex-row md:items-center md:justify-between md:px-8">
            <p>Copyright {copyrightYear} AINA Consulting. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="/privacy" className="hover:text-aina-green">Privacy</a>
              <a href="/terms" className="hover:text-aina-green">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
