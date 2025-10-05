// Point to the actual files in `public/` (Vite serves those at root)
const HERO_IMG = "/hero.jpeg";
const LAPTOP_SCREEN_IMG = "/screen.jpeg"; // dashboard / screen image
const STUDENT_IMG = "/student.jpeg"; // student photo
const EDUCATION_IMG = "/education.jpeg"; // education block
const PHONE_SCENE_IMG = "/laptop.jpeg"; // phone/laptop scene

// Allumino-style landing page — full, fixed version (SPA-ready)
// React + Tailwind v4 single-file component

import { useState, useId } from "react";
import { Link } from "react-router-dom";

/* ---------------- Local images ----------------
   Keep these files in the SAME folder as this JSX (i.e., src/).
   If you rename them, update the imports below to match.
*/
// import HERO_IMG from "./hero-1.jpeg";
// import LAPTOP_SCREEN_IMG from "./screen-2.jpeg";
// import STUDENT_IMG from "./student-3.jpeg";
// import EDUCATION_IMG from "./education-4.jpeg";
// import PHONE_SCENE_IMG from "./phone-0.jpeg";

/* ---------------- Logo (fixed) ---------------- */
function Logo({ className = "w-32" }) {
  const gradId = useId().replace(/:/g, "_");
  return (
    <div className={className + " flex items-center gap-2 font-semibold tracking-tight"}>
      <svg viewBox="0 0 64 64" className="w-8 h-8" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="0" stopColor="#ffb11a" />
            <stop offset="1" stopColor="#ff8a00" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradId})`}
          d="M32 4c-8.8 0-22 18.9-22 28.1C10 42.8 20.2 52 32 52s22-9.2 22-19.9C54 22.9 40.8 4 32 4zm0 18a10 10 0 0 1 10 10v2H22v-2a10 10 0 0 1 10-10z"
        />
      </svg>
      <span className="text-2xl font-bold">allumino</span>
    </div>
  );
}

/* ---------------- Small helpers ---------------- */
function ImageCard({ src, alt = "", className = "" }) {
  return (
    <div className={`relative mx-auto w-full max-w-[640px] ${className}`}>
      <div className="relative h-[540px] overflow-hidden rounded-[2.25rem] bg-white shadow-2xl ring-1 ring-black/10">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          fetchpriority="high"
        />
      </div>
    </div>
  );
}

function LaptopMock({ screenSrc }) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="rounded-3xl bg-gradient-to-br from-neutral-700 to-neutral-900 p-6 shadow-2xl">
        <div className="relative mx-auto aspect-[16/9] w-full rounded-[22px] border-[10px] border-neutral-900 bg-gradient-to-tr from-neutral-100 to-neutral-200 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div className="absolute left-1/2 -top-3 h-2 w-28 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
          <img
            src={screenSrc}
            alt="Dashboard"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full rounded-[12px] object-cover"
          />
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 h-3 w-[88%] -translate-x-1/2 rounded-full bg-black/30 blur-sm" />
    </div>
  );
}

function Badge3D({ className = "" }) {
  return (
    <div className={"relative h-24 w-24 " + className}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffb11a] to-[#ff8a00] blur" />
      <div className="absolute inset-1 rounded-full bg-white" />
      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#ffd08a] to-[#ff9d6b]" />
      <div className="absolute inset-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ff8a00] to-[#ff6a00] font-bold text-white">
        ★
      </div>
    </div>
  );
}

function Section({ id, className = "", children }) {
  return (
    <section
      id={id}
      className={"relative mx-auto w-full max-w-7xl px-6 py-20 scroll-mt-24 md:scroll-mt-28 " + className}
    >
      {children}
    </section>
  );
}

function DotDivider() {
  return <div className="mx-auto my-12 h-px w-full max-w-6xl border-t-2 border-dotted border-neutral-300" />;
}

function PricingCard({ title, subtitle, price, features, cta, header = "gray" }) {
  const headerBg =
    header === "gradient"
      ? "bg-gradient-to-r from-[#fba919] to-[#ff8a00]"
      : "bg-gradient-to-b from-[#e6e6e6] to-[#d9d9d9]";
  const headerText = header === "gradient" ? "text-white" : "text-neutral-900";
  const btnCls =
    header === "gradient"
      ? "bg-gradient-to-r from-[#fba919] to-[#ff8a00] text-white"
      : "bg-gradient-to-b from-white to-neutral-100 text-neutral-900";

  return (
    <div className="flex w-full max-w-sm flex-col justify-between rounded-[22px] bg-white text-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/10">
      <div className={`rounded-t-[22px] border-b border-black/10 px-6 pb-2 pt-5 ${headerBg} ${headerText}`}>
        <h3 className="text-[28px] font-extrabold tracking-tight">{title}</h3>
        <p className="text-sm/6 opacity-90">{subtitle}</p>
      </div>
      <div className="px-8 pb-8 pt-3">
        <p className="mt-1 text-[40px] font-extrabold md:text-5xl">{price}</p>
        <ul className="mt-4 space-y-4 text-[15px]">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-neutral-50 text-neutral-600">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <button
          className={`mt-8 w-full rounded-full px-6 py-4 text-base font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_18px_rgba(0,0,0,0.15)] hover:brightness-[.97] ${btnCls}`}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Main page ---------------- */
export default function AlluminoLanding() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff,#fff7eb_40%,#ffffff_100%)] text-black">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <a href="#home" aria-label="Allumino home"><Logo /></a>
              <nav className="hidden items-center gap-6 md:flex">
                {[
                  ["Home", "#home"],
                  ["About", "#about"],
                  ["Program", "#program"],
                  ["Price", "#pricing"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <a key={label} href={href} className="text-sm font-medium hover:text-black/70">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Search" className="hidden rounded-full p-2 hover:bg-black/5 md:inline-flex">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>

              {/* SPA-style Sign Up */}
              <Link
                to="/signup"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:bg-black/5 md:inline-block"
              >
                Sign Up
              </Link>

              {/* SPA-style Login */}
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-[#fba919] to-[#ff8a00] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Login
              </Link>

              <button
                className="ml-2 inline-flex items-center rounded-md p-2 md:hidden"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                <span className="sr-only">Menu</span>
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          {open && (
            <div id="mobile-nav" role="navigation" aria-label="Mobile" className="border-t border-black/5 px-6 pb-4 md:hidden">
              <nav className="grid gap-2">
                {[
                  ["Home", "#home"],
                  ["About", "#about"],
                  ["Program", "#program"],
                  ["Price", "#pricing"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <a key={label} href={href} className="rounded-md px-2 py-2 text-sm font-medium hover:bg-black/5">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Hero */}
        <Section id="home" className="pt-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative">
              <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-b from-[#ffbfa8] to-[#ff8aa1] opacity-70 blur-2xl" />
              <div className="absolute -right-10 bottom-12 h-40 w-40 rounded-[2rem] bg-gradient-to-br from-[#ffb11a] to-[#ff8a00] opacity-60 blur-2xl" />
              <ImageCard src={HERO_IMG} alt="Hero photo" />
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 -z-10 h-24 w-24 rounded-full bg-gradient-to-br from-[#ffd6a1] to-[#ff9d6b] blur-xl" />
              <p className="mb-2 text-4xl font-extrabold leading-tight sm:text-5xl">
                <span className="text-[#f29100]">Level Up</span> Your STEM
                <br />
                Learning With Allumino
              </p>
              <p className="mt-4 max-w-xl text-base text-neutral-900">
                Take your STEM skills to the real-world job market. With Allumino you can browse learning content,
                develop career pathways, and find real job offers all under one sleek platform.
              </p>
              <div className="mt-8">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fba919] to-[#ff8a00] px-7 py-3 font-semibold text-white shadow-lg"
                >
                  Get started with us today
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Detector headline */}
        <Section>
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 rounded-[2.75rem] bg-black/5 blur-xl" />
            <div className="relative rounded-[2.75rem] border border-black/10 bg-white/95 px-10 py-12 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <h2 className="text-center text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
                Meet the World’s First AI STEM Talent Detector
              </h2>
            </div>
          </div>
        </Section>

        {/* Guidance */}
        <Section id="about" className="pt-0">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 h-full border-l-2 border-dotted border-neutral-300" />
              <div className="ml-6 sm:ml-10">
                <div className="mb-4 flex items-center gap-3 text-[#f29100]">
                  <span className="inline-block h-3.5 w-3.5 rotate-45 rounded-[3px] border-2 border-[#f29100]" />
                  <span className="text-xl font-semibold">Guidance</span>
                </div>
                <h3 className="text-4xl font-extrabold text-neutral-900">AI-Powered Career Pathways</h3>
                <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-900">
                  Through a brief 20-minute survey, Allumino creates a dedicated profile to your STEM talent.
                  Then we match your strengths with in-demand skills and opportunities.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <p className="text-lg font-medium text-neutral-900">Take your first assessment for free</p>
                  <a href="#program" className="inline-flex items-center rounded-full bg-gradient-to-r from-[#fba919] to-[#ff8a00] px-6 py-2 font-semibold text-white shadow">
                    here <span className="ml-2">←</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <LaptopMock screenSrc={LAPTOP_SCREEN_IMG} />
            </div>
          </div>
        </Section>

        <DotDivider />

        {/* Hiring */}
        <Section id="program" className="pt-0">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative order-2 md:order-1">
              <img
                alt="student"
                className="mx-auto h-80 w-full max-w-md rounded-2xl object-cover"
                src={STUDENT_IMG}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="relative order-1 md:order-2">
              <div>
                <div className="mb-4 flex items-center gap-3 text-[#f29100]">
                  <span className="inline-block h-3.5 w-3.5 rotate-45 rounded-[3px] border-2 border-[#f29100]" />
                  <span className="text-xl font-semibold">Hiring</span>
                </div>
                <h3 className="text-4xl font-extrabold text-neutral-900">STEM Employment Opportunities</h3>
                <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-900">
                  Attach your LinkedIn or let Allumino search connections with real employers.
                  Review leads in your Opportunities tab.
                </p>
                <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-900">All your needs at the click of a button.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Education */}
        <Section className="pt-0">
          <div className="mb-3 flex items-center gap-2 text-[#f29100]">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M3 12l6-6v12l-6-6zm8 0l6-6v12l-6-6z" fill="currentColor" />
            </svg>
            <span className="font-semibold uppercase tracking-wide">Education</span>
          </div>
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-extrabold">Dedicated Content and AI Tutors</h3>
              <p className="mt-4 max-w-xl text-neutral-900">
                Prompt our chatbot <em>Lami</em> to guide you through topics, summarize readings, quiz understanding,
                track metrics, and generate content with real-time feedback.
              </p>
              <p className="mt-4 max-w-xl text-neutral-900">
                Gain access to over 50+ STEM-related courses covering 500+ topics!
              </p>
            </div>
            <div className="relative">
              <div className="mx-auto h-64 w-full max-w-xl rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/10">
                <div className="flex h-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#fba919]/10 to-[#ff8a00]/10">
                  <img
                    src={EDUCATION_IMG}
                    alt="Education"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Waitlist CTA */}
        <Section className="pt-0">
          <div className="grid items-center gap-8 rounded-[2rem] border border-black/10 bg-white p-10 shadow-sm md:grid-cols-2">
            <div className="relative order-2 md:order-1">
              <div className="mx-auto h-72 w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffecd1] to-[#fff6e6] shadow-inner">
                <img
                  src={PHONE_SCENE_IMG}
                  alt="Phone on chair"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <Badge3D className="absolute -bottom-8 left-6" />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-extrabold">
                Kickstart your <span className="text-[#f29100]">STEM</span> opportunities.
                <br />
                Join the waitlist now.
              </h3>
              <a
                href="#about"
                className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-[#fba919] to-[#ff8a00] px-6 py-3 font-semibold text-white shadow"
              >
                See why we’re the #1 rated EdTech Platform
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing" className="pt-0">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white to-neutral-100 p-6 pt-16 text-neutral-900 md:p-10">
            <h2 className="relative z-10 mb-12 text-center text-6xl font-extrabold">Pricing</h2>
            <div className="pointer-events-none absolute left-6 right-6 top-6 h-24 rounded-[2.5rem] border border-black/10 bg-black/5 backdrop-blur-sm" />
            <div className="pointer-events-none absolute -left-8 top-28 h-24 w-24 rounded-full bg-gradient-to-br from-[#fba919] to-[#ff8a00]" />
            <div className="pointer-events-none absolute -right-10 top-6 h-28 w-28 rounded-full bg-gradient-to-tr from-[#fba919] to-[#ff8a00]" />
            <div className="pointer-events-none absolute right-20 bottom-6 h-28 w-28 rounded-full bg-gradient-to-br from-[#fba919] to-[#ff8a00]" />

            <div className="relative z-10 grid justify-center gap-8 md:grid-cols-3">
              <PricingCard
                header="gray"
                title="Standard"
                subtitle="Ideal for students"
                price="Free"
                cta="Unlock Now"
                features={[
                  "3 AI-Generated Pathways",
                  "Basic access to educational features",
                  "24/7 Lami Chatbot Assistance",
                  "Up to 5 career opportunities",
                ]}
              />
              <PricingCard
                header="gray"
                title="Allumino+"
                subtitle="Ideal for schools"
                price="$6.99/month"
                cta="Buy Now"
                features={[
                  "7 AI-Generated Pathways",
                  "Premium access to educational features",
                  "Access to Lami+ Assistance",
                  "Up to 30 career opportunities",
                  "Access to over 50 STEM courses",
                ]}
              />
              <PricingCard
                header="gradient"
                title="Allumino Pro 👑"
                subtitle="Perfect for professionals"
                price="$10.99/month"
                cta="Buy Now!"
                features={[
                  "Unlimited AI-Generated Pathways",
                  "Premium access to educational features",
                  "Access to LamiPro Assistance",
                  "Unlimited career opportunities",
                  "Unlimited access to personalized content",
                  "AI Portfolio & Resume Builder",
                ]}
              />
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer id="contact" className="mt-20 bg-gradient-to-t from-[#ffb11a] to-[#ff8a00]">
          <Section className="py-12 text-neutral-900">
            <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Logo className="w-40" />
                  <nav className="mt-6 grid gap-2 text-sm">
                    {["Home", "About", "Dashboard", "Inbox", "Connections", "Opportunities"].map((x) => (
                      <a key={x} href="#" className="hover:underline">
                        {x}
                      </a>
                    ))}
                  </nav>
                </div>
                <div>
                  <div className="h-6" />
                  <nav className="mt-6 grid gap-2 text-sm">
                    <Link to="/login" className="hover:underline">Log In</Link>
                    <Link to="/signup" className="hover:underline">Sign Up</Link>
                    {["Learning", "Lami", "News", "Log Out"].map((x) => (
                      <a key={x} href="#" className="hover:underline">
                        {x}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="grid gap-6">
                <div>
                  <p className="font-semibold">Contact Us:</p>
                  <a href="mailto:allumino.startup@gmail.com" className="block underline">
                    allumino.startup@gmail.com
                  </a>
                  <a href="tel:1234567890" className="block underline">
                    1-234-567-8900
                  </a>
                </div>
                <div>
                  <p className="font-semibold">Workspace Located At:</p>
                  <address className="not-italic">
                    New Stadium<br />
                    83 Walnut Ave.<br />
                    M5V 2S1, Toronto ON
                  </address>
                  <div className="mt-4 h-40 w-full max-w-md rounded-xl bg-white/70 p-2">
                    <div className="h-full w-full rounded-lg bg-neutral-200 bg-cover bg-center" />
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </footer>

        <Section className="py-8 text-center text-sm text-neutral-600">
          © {new Date().getFullYear()} Allumino — concept landing page clone for demo.
        </Section>
      </div>
    </>
  );
}

/* Dev-only sanity checks */
if (typeof window !== "undefined" && import.meta.env?.DEV) {
  try {
    console.assert(typeof AlluminoLanding === "function", "AlluminoLanding should be a function component");
  } catch {}
}