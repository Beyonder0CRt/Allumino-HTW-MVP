// src/pages/LoginPage.jsx
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(255,255,255,0.08)_0%,transparent_60%),linear-gradient(135deg,#0f172a_0%,#0b1222_50%,#151a27_100%)] text-white">
      {/* Top bar logo */}
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-6">
        <div className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path d="M12 3l7 7-7 7-7-7 7-7z" fill="currentColor" className="opacity-70" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight">allumino</span>
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mx-auto mt-4 w-full max-w-md">
          <div className="relative rounded-2xl bg-white/90 text-slate-900 shadow-2xl ring-1 ring-black/10">
            {/* Header strip */}
            <div className="rounded-t-2xl bg-gradient-to-r from-[#fba919] to-[#ff8a00] px-6 py-4 text-center text-lg font-bold text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.3)]">
              Log in to Allumino
            </div>

            <div className="px-8 py-6">
              <h2 className="text-xl font-semibold text-slate-900">Welcome Back!</h2>
              <p className="mt-1 text-sm text-slate-600">Please enter the following:</p>

              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full rounded-xl border border-slate-300/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ring-0 focus:border-[#ff9d33] focus:shadow-[0_0_0_3px_rgba(255,157,51,.25)]"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-300/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ring-0 focus:border-[#ff9d33] focus:shadow-[0_0_0_3px_rgba(255,157,51,.25)]"
                  />
                </div>

                <div className="text-right">
                  <button type="button" className="text-sm text-[#5b77ff] hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#f7a53a] px-4 py-3 text-center font-semibold text-white shadow hover:brightness-95 active:scale-[.99]"
                >
                  Log In
                </button>

                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-white px-4 py-3 font-medium text-slate-800 hover:bg-slate-50"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.5 3.5-5.4 3.5-3.2 0-5.8-2.7-5.8-6s2.6-6 5.8-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.9 3.4 14.7 2.5 12 2.5 6.9 2.5 2.7 6.7 2.7 11.8S6.9 21 12 21c7.1 0 8.7-5 8.1-8.1H12z"/>
                  </svg>
                  Sign in With Google
                </button>

                <div className="border-t border-slate-200 pt-4 text-center text-sm text-slate-700">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-[#5b77ff] hover:underline">
                    Sign up!
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white">
              <span className="-ml-1">‹</span> Go back
            </Link>
          </div>
        </div>
      </div>

      {/* faint watermark diamond on the right */}
      <div className="pointer-events-none absolute right-[8%] top-1/3 hidden h-80 w-80 -translate-y-1/2 rotate-45 rounded-3xl border border-white/10 bg-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,.35)] md:block" />
      <div className="pointer-events-none absolute right-[8%] top-1/3 hidden h-40 w-40 -translate-y-1/2 -rotate-45 rounded-[999px] border border-white/10 bg-white/5 md:block" />
    </div>
  );
}
