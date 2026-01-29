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

export default function OverviewPage() {
  const { session, loading } = useAuth()

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
  }

  return (
    <div className="min-h-[100svh] bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-semibold tracking-tight text-slate-900">
              IBOM
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <HoverMenu label="What is IBOM">
              <div className="grid gap-1">
                <Link className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" to="/overview">
                  Overview
                </Link>
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
                    <span className="block text-xs text-slate-600">Human-in-the-loop, when you need it</span>
                  </span>
                </a>
                <a className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50" href="#agents">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    ☄
                  </span>
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-900">Agentic automation</span>
                    <span className="block text-xs text-slate-600">Adaptive workflows in real time</span>
                  </span>
                </a>
                <a className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50" href="#mcp">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    ⛓
                  </span>
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-900">MCP tools</span>
                    <span className="block text-xs text-slate-600">Connect AI to real actions</span>
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
                  ['Finance', 'Save time on invoicing and billing…', '💳'],
                  ['Information Technology', 'Scale and control your IT…', '🖥️'],
                  ['People', 'Get your HR processes running…', '👥'],
                  ['Workplace Productivity', 'Automate busy work to focus…', '🔥'],
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
          <div className="absolute -bottom-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-40 right-[-140px] h-[520px] w-[520px] rounded-full bg-violet-400/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/20">
                What is IBOM
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                An intelligent operating layer for how your team works
              </h1>
              <p className="mt-6 text-base text-white/70 sm:text-lg">
                IBOM connects your tools, policies, and AI capabilities into one place so you can automate workflows,
                capture decisions, and keep operations consistent.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-400 hover:to-indigo-400"
                >
                  Sign in
                </Link>
                <Link
                  to="/portal"
                  className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                >
                  Go to portal
                </Link>
              </div>
              {!isSupabaseConfigured ? (
                <div className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
                  Supabase not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="ai-automation" className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-slate-500">IBOM + AI</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Automation with guardrails</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use AI to draft, classify, and route work while keeping approvals, policies, and audit trails in place.
                IBOM stays human-in-the-loop where it matters.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#mcp"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  See MCP tools
                </a>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-400 hover:to-indigo-400"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Draft + refine', 'Generate emails, docs, and summaries with context.'],
                ['Classify', 'Auto-tag requests and route them to the right queue.'],
                ['Approve', 'Add checkpoints for sensitive actions and data.'],
                ['Audit', 'Keep an activity trail across workflows and tools.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="mt-1 text-sm text-slate-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="agents" className="mx-auto max-w-7xl px-6 pb-4">
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="text-sm font-semibold text-slate-500">Agentic automation</div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Workflows that adapt</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Agents handle routine steps, ask for clarification when needed, and keep your team in control.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Runbooks', 'Turn best practices into repeatable playbooks.'],
                  ['Routing', 'Escalate the right work to the right owner.'],
                  ['Exceptions', 'Pause and request confirmation for edge cases.'],
                  ['Observability', 'Track outcomes and improve over time.'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 p-6">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-600">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="mcp" className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="text-sm font-semibold text-slate-500">MCP tools</div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Connect AI to actions</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Use Model Context Protocol connectors to safely execute tasks in your tooling: deployments, database
                  queries, support operations, and more.
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Deployments', 'Automate releases and rollbacks with audit trails.'],
                    ['Data', 'Run safe queries and exports with permissions.'],
                    ['Support', 'Triage tickets and draft responses faster.'],
                    ['Ops', 'Standardize processes across tools and teams.'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl bg-slate-50 p-6">
                      <div className="text-sm font-semibold text-slate-900">{title}</div>
                      <div className="mt-1 text-sm text-slate-600">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 lg:grid-cols-3">
            {[
              ['Connect', 'Bring your apps, data, and docs into one consistent model.'],
              ['Automate', 'Use workflows and AI to execute repeatable processes safely.'],
              ['Observe', 'Make operations measurable with logs, alerts, and audit trails.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-6">
                <div className="text-sm font-semibold text-slate-500">{title}</div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{title} your work</div>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="solutions" className="mx-auto max-w-7xl px-6 pb-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="text-sm font-semibold text-slate-500">Solutions</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Make across your business</div>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Start with the workflows you run every day, then expand automation across teams as you build confidence.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Marketing', 'Drive faster growth with consistent campaigns.'],
                ['Sales', 'Standardize qualification, follow-ups, and handoffs.'],
                ['Operations', 'Keep processes consistent across tools and vendors.'],
                ['Customer Experience', 'Resolve issues faster with better context.'],
                ['Finance', 'Automate invoicing, approvals, and reporting.'],
                ['IT', 'Scale operations with safe automations and logs.'],
                ['People', 'Streamline onboarding and HR processes.'],
                ['Productivity', 'Automate busywork so teams can focus.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="mt-1 text-sm text-slate-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="customers" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="text-sm font-semibold text-slate-500">Customers</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Built for teams that ship</div>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              IBOM is designed for operations, product, and engineering teams who need a consistent way to run work
              across tools—without losing control.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Operations', 'Keep workflows consistent across teams and vendors.'],
                ['Engineering', 'Automate routine tasks with guardrails and audit trails.'],
                ['Leadership', 'See what’s happening and why—without chasing updates.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="mt-1 text-sm text-slate-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="docs" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 lg:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-500">Resources</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Learn and launch</div>
              <p className="mt-2 text-sm text-slate-600">
                Documentation, guides, and a community to help you move from first workflow to full rollout.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
              <a href="#docs" className="rounded-2xl bg-slate-50 p-6 hover:bg-slate-100">
                <div className="text-sm font-semibold text-slate-900">Documentation</div>
                <div className="mt-1 text-sm text-slate-600">Reference for auth, workflows, and integrations.</div>
              </a>
              <a id="guides" href="#guides" className="scroll-mt-28 rounded-2xl bg-slate-50 p-6 hover:bg-slate-100">
                <div className="text-sm font-semibold text-slate-900">Guides</div>
                <div className="mt-1 text-sm text-slate-600">Patterns for common operations and rollouts.</div>
              </a>
              <a
                id="community"
                href="#community"
                className="scroll-mt-28 rounded-2xl bg-slate-50 p-6 hover:bg-slate-100"
              >
                <div className="text-sm font-semibold text-slate-900">Community</div>
                <div className="mt-1 text-sm text-slate-600">Share templates and learn from other teams.</div>
              </a>
              <a href="#partners" className="rounded-2xl bg-slate-50 p-6 hover:bg-slate-100">
                <div className="text-sm font-semibold text-slate-900">Partners</div>
                <div className="mt-1 text-sm text-slate-600">Work with experts to accelerate delivery.</div>
              </a>
            </div>
          </div>
        </section>

        <section id="partners" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div id="experts" className="scroll-mt-28" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">Partners</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  Bring IBOM into your stack
                </div>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Start with authentication and a simple portal, then add integrations as you grow.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
