import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

function MenuTrigger({ children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      {children}
      <span className="text-slate-400">▾</span>
    </button>
  )
}

function HoverMenu({ label, children }) {
  return (
    <div className="group relative">
      <MenuTrigger>{label}</MenuTrigger>
      <div className="pointer-events-none absolute left-1/2 top-full z-20 w-[360px] -translate-x-1/2 translate-y-1 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="relative mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border border-slate-200 bg-white" />
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  )
}

function HoverMegaMenu({ label, children }) {
  return (
    <div className="group relative">
      <MenuTrigger>{label}</MenuTrigger>
      <div className="pointer-events-none absolute left-1/2 top-full z-20 w-[920px] -translate-x-1/2 translate-y-1 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="relative mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border border-slate-200 bg-white" />
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { session, loading } = useAuth()

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
  }

  return (
    <div className="min-h-[100svh] bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold tracking-tight text-slate-900">IBOM</div>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <HoverMenu label="What is IBOM">
              <div className="grid gap-1">
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#overview">
                  Overview
                </a>
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#how-it-works">
                  How it works
                </a>
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#customers">
                  Customers
                </a>
              </div>
            </HoverMenu>

            <HoverMenu label="IBOM + AI">
              <div className="grid gap-2 p-1">
                <a className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50" href="#ai-automation">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    ✦
                  </span>
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-900">Automation with AI</span>
                    <span className="block text-xs text-slate-600">Revolutionize your work with AI</span>
                  </span>
                </a>
                <a className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50" href="#agents">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    ☄
                  </span>
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-900">Agentic automation</span>
                    <span className="block text-xs text-slate-600">Adaptive flows in real time</span>
                  </span>
                </a>
                <a className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50" href="#mcp">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    ⛓
                  </span>
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-900">MCP tools</span>
                    <span className="block text-xs text-slate-600">Connect AI to real business actions</span>
                  </span>
                </a>
              </div>
            </HoverMenu>

            <HoverMegaMenu label="Solutions">
              <div className="text-lg font-semibold tracking-tight text-slate-900">IBOM across your business</div>

              <div className="mt-4 grid grid-cols-4 gap-4">
                {[
                  ['Marketing', 'Drive faster growth with marketing…', '📣'],
                  ['Sales', 'Level up your sales cycle to close more…', '📈'],
                  ['Operations', 'Get teams and tools working together…', '⚙️'],
                  ['Customer Experience', 'Take better care of customers…', '🎧'],
                  ['Finance', 'Manage time as well as you manage…', '💳'],
                  ['Information Technology', 'Efficiently scale and control your IT…', '🖥️'],
                  ['People', 'Get your HR processes running…', '👥'],
                  ['Workplace Productivity', 'Automate busy work to focus on…', '🔥'],
                ].map(([title, desc, icon]) => (
                  <a key={title} href="#solutions" className="group/item flex gap-3 rounded-xl p-3 hover:bg-slate-50">
                    <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                      {icon}
                    </span>
                    <span className="block">
                      <span className="block text-sm font-semibold text-slate-900 group-hover/item:text-fuchsia-700">
                        {title}
                      </span>
                      <span className="block text-xs text-slate-600">{desc}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-6 text-lg font-semibold tracking-tight text-slate-900">Popular automations</div>
              <div className="mt-3 grid grid-cols-4 gap-4">
                {[
                  ['Social Media Posting', 'More engagement, less effort'],
                  ['Lead Management', 'Automate for more conversions'],
                  ['Invoicing', 'Save time on invoicing and billing'],
                  ['Contracting', 'Automate and make deals faster'],
                  ['Email Marketing', 'Increase your email conversions'],
                  ['Content Creation', 'Generate high quality content with AI'],
                ].map(([title, desc]) => (
                  <a key={title} href="#automations" className="rounded-xl p-3 hover:bg-slate-50">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-xs text-slate-600">{desc}</div>
                  </a>
                ))}
              </div>
            </HoverMegaMenu>

            <HoverMenu label="Resources">
              <div className="grid gap-1">
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#docs">
                  Documentation
                </a>
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#guides">
                  Guides
                </a>
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#community">
                  Community
                </a>
              </div>
            </HoverMenu>

            <HoverMenu label="Partners">
              <div className="grid gap-1">
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#partners">
                  Partner program
                </a>
                <a className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" href="#experts">
                  Experts directory
                </a>
              </div>
            </HoverMenu>

            <button
              type="button"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Pricing
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:inline-flex"
            >
              Talk to sales
            </button>

            {loading ? null : session ? (
              <>
                <Link
                  to="/portal"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Portal
                </Link>
                <button
                  onClick={signOut}
                  className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-xl border border-fuchsia-300 bg-white px-4 py-2 text-sm font-semibold text-fuchsia-700 hover:bg-fuchsia-50"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-400 hover:to-indigo-400"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1446] via-[#1b1446] to-[#120c30]" />
          <div className="absolute -bottom-44 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-40 right-[-140px] h-[520px] w-[520px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  AI automation you can
                  <br />
                  visually build and
                  <br />
                  orchestrate in real time
                </h1>
                <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
                  IBOM brings no-code automation and AI agents into one visual-first platform so you can build with
                  speed and scale with control.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-400 hover:to-indigo-400"
                  >
                    Get started free
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                  >
                    Talk to sales
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    No time limit on Free plan
                  </div>
                </div>
              </div>

              <div className="relative lg:col-span-5">
                <div className="relative mx-auto h-56 w-full max-w-md lg:h-72">
                  <div className="absolute left-0 top-10 flex items-center gap-6">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-cyan-500/90 shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
                      <span className="text-lg font-black text-white">A</span>
                    </div>
                    <div className="h-px w-14 bg-white/25" />
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-violet-500/90 shadow-lg shadow-violet-500/20 ring-1 ring-white/20">
                      <span className="text-lg font-black text-white">◎</span>
                    </div>
                    <div className="h-px w-14 bg-white/25" />
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                      <span className="text-lg text-white/80">✦</span>
                    </div>
                  </div>

                  <div className="absolute -right-8 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-400/15 blur-2xl" />
                </div>
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-10">
              <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 text-white/30">
                <div className="text-xl font-semibold tracking-tight">bambooHR</div>
                <div className="text-xl font-semibold tracking-tight">BNY</div>
                <div className="text-xl font-semibold tracking-tight">Bolt</div>
                <div className="text-xl font-semibold tracking-tight">FINN</div>
                <div className="text-xl font-semibold tracking-tight">GoJob</div>
                <div className="text-xl font-semibold tracking-tight">tally</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 lg:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-500">Quick links</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Get around</div>
              <p className="mt-2 text-sm text-slate-600">
                Use these routes while we build out the rest of the product.
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              <Link className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50" to="/login">
                Sign in
              </Link>
              <Link className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50" to="/protected">
                Protected example
              </Link>
              <Link className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50" to="/auth/reset">
                Reset password
              </Link>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-500">Status</div>
              <div className="mt-2 text-sm text-slate-700">
                Supabase configured:{' '}
                <span className={isSupabaseConfigured ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'}>
                  {isSupabaseConfigured ? 'yes' : 'no'}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-700">
                Session:{' '}
                <span className="font-semibold text-slate-900">{loading ? 'loading' : session ? 'signed in' : 'signed out'}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
