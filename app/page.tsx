"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const heroStats = [
  { label: "AI replies / day", value: "640", change: "avg in beta workspaces" },
  { label: "Warm leads flagged", value: "73%", change: "within 10 minutes" },
  { label: "Campaigns scheduled", value: "120+", change: "per billing cycle" },
  { label: "Manual hours saved", value: "280h", change: "per SME · quarter" },
];

const features = [
  {
    title: "Intent Brain",
    description:
      "TF-IDF + LinearSVC classifies pricing, support, order_status, and more so the right flow fires instantly.",
    detail: "Confusion matrices update automatically after each training job.",
    icon: Sparkles,
  },
  {
    title: "Context RAG Answers",
    description:
      "LangChain + Ollama (Llama 3) serves grounded answers from your pgvector store—no hallucinations.",
    detail: "Answers cite uploaded docs with inline references.",
    icon: MessageSquare,
  },
  {
    title: "Lead Thermometer",
    description:
      "Logistic Regression / XGBoost scores chats as cold, warm, or hot using latency, sentiment, and keyword ratios.",
    detail: "Cold/warm/hot signals show up directly inside Conversations.",
    icon: BarChart3,
  },
  {
    title: "Campaign Studio",
    description:
      "Supabase-authenticated teams build, approve, and launch broadcasts that the gateway schedules via node-cron.",
    detail: "Gateway scheduler keeps WhatsApp-compliant pacing.",
    icon: Send,
  },
  {
    title: "Ops Analytics",
    description:
      "Conversations, leads, templates, and KPIs live in one dashboard with retraining entry points.",
    detail: "Score health + retraining jobs surfaced in-app",
    icon: Users,
  },
  {
    title: "Secure by design",
    description:
      "Caddy-enforced HTTPS, JWT service auth, and audit trails keep customer data safe.",
    detail: "Secrets via Vault · GitHub Actions CI/CD",
    icon: ShieldCheck,
  },
];

const workflow = [
  {
    step: "01",
    title: "Connect sources",
    description:
      "Link WhatsApp Business API, Supabase-authenticated workspaces, and CRM tables through the gateway. Events and leads stream in over HTTPS.",
  },
  {
    step: "02",
    title: "Tune the AI",
    description:
      "Upload business docs, feed vectors, and label intents. Configure auto-reply guardrails plus lead-scoring thresholds per pipeline.",
  },
  {
    step: "03",
    title: "Launch & learn",
    description:
      "Schedule campaigns, monitor analytics, and trigger retraining jobs from the same console. JWT-secured services keep every run auditable.",
  },
];

const testimonials = [
  {
    quote:
      "Intent Brain now handles 82% of WhatsApp questions for our Casablanca showrooms. Agents jump in only when a hot lead is detected.",
    author: "Zakaria Imzilen",
    role: "Lifecycle Lead",
    company: "Atlas Clinics",
  },
  {
    quote:
      "Lead Thermometer feeds HubSpot with cold/warm/hot labels, while RAG answers keep our responses on-brand in Darija and French.",
    author: "Meriem Tarouss",
    role: "Growth Manager",
    company: "MedinaPay",
  },
];

const timelineMessages = [
  {
    channel: "Intent Brain",
    message:
      "Pricing intent detected in Darija. Auto-reply sent with live catalog link and CTA.",
    status: "Latency 680 ms",
  },
  {
    channel: "Lead Thermometer",
    message:
      "Youssef scored 0.72 → warm. Handed off to sales pod with summary of last chat.",
    status: "Synced to CRM · 10:31",
  },
  {
    channel: "Campaign Scheduler",
    message:
      "Holiday nurture broadcast queued for 18:00 WET with 2,300 qualified contacts.",
    status: "node-cron · 10:47",
  },
];

const InlineAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg">
      {initials}
    </div>
  );
};

const HeroIllustration = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-white to-purple-200/50 blur-3xl"></div>
      <div className="relative p-6 md:p-8 bg-white/90 border border-slate-200 rounded-3xl shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Live journey
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Renewal nudges
            </h3>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600">
            On air
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {timelineMessages.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4 flex flex-col gap-2 shadow-inner"
            >
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="font-medium text-slate-700">
                  {item.channel}
                </span>
                <span>{item.status}</span>
              </div>
              <p className="text-slate-900 leading-relaxed">{item.message}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Personalization tokens inserted automatically
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-900 text-white p-4">
            <p className="text-sm text-slate-300">Weekly uplift</p>
            <p className="text-4xl font-semibold mb-1">+23%</p>
            <p className="text-slate-400 text-sm">
              Incremental revenue tracked via UTMs
            </p>
            <div className="mt-4 h-2 bg-slate-800 rounded-full">
              <div className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-blue-400 w-3/4" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-sm text-slate-500">Opt-in quality</p>
            <p className="text-3xl font-semibold text-slate-900">98.4%</p>
            <div className="mt-3 flex items-center -space-x-3">
              {["Maya", "Zoe", "Khalid", "Noah"].map((name) => (
                <div
                  key={name}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-semibold flex items-center justify-center shadow-md"
                >
                  {name.slice(0, 1)}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Double opt-ins verified with WhatsApp Business Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CampAign
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                onClick={() => router.push("/dashboard")}
              >
                Launch console
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-slate-600 hover:text-slate-900"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-slate-600 hover:text-slate-900"
              >
                How it works
              </a>
              <a
                href="#testimonials"
                className="block text-slate-600 hover:text-slate-900"
              >
                Stories
              </a>
              <button
                className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg shadow-lg"
                onClick={() => router.push("/auth/login")}
              >
                Launch console
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">
                AI chat-sales assistant for revenue teams
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Automate every
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                WhatsApp lead
              </span>{" "}
              with confidence
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              CampAign blends intent detection, RAG answers, lead-temperature
              scoring, and a campaign scheduler so growth teams reply in real
              time, qualify faster, and launch broadcasts without extra
              headcount.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                onClick={() => router.push("/auth/login")}
              >
                Start free beta workspace
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Cost-free SaaS · Supabase Auth · WhatsApp Business API
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-slate-950 text-white px-4 sm:px-6 lg:px-8 rounded-t-[3rem]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-3">
                Product fabric
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Built for operators, not just marketers
              </h2>
              <p className="mt-4 text-slate-300 text-lg max-w-2xl">
                Every surface maps to a shipped service—gateway, ML, scheduler,
                analytics. Walk through the same UI high-velocity teams use to
                automate WhatsApp without extra headcount.
              </p>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Sparkles className="w-5 h-5 text-amber-300" />
              Live screenshots from customer workspaces
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ title, description, detail, icon: Icon }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-white/30 hover:bg-white/10 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/40 to-blue-300/30 flex items-center justify-center text-white mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-slate-200">{description}</p>
                <div className="mt-6 text-sm text-emerald-300 font-medium">
                  {detail}
                </div>
                <div className="absolute inset-x-6 bottom-6 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600">
              Flow builder
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mt-3">
              Launch-ready in three concrete steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {workflow.map((item, idx) => (
              <div
                key={item.title}
                className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-semibold text-xl flex items-center justify-center mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
                {idx < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-5 w-10 h-px bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
              >
                <p className="text-lg text-slate-700 leading-relaxed">
                  {item.quote}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <InlineAvatar name={item.author} />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.author}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Ready to let AI reply, qualify, and schedule on WhatsApp for you?
          </h2>
          <p className="text-lg text-white/80">
            Spin up a Supabase-authenticated workspace, plug the gateway into
            WhatsApp Business, and watch Intent Brain + Lead Thermometer go live
            in a single afternoon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition flex items-center gap-2 justify-center"
              onClick={() => router.push("/auth/login")}
            >
              Start free beta
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="px-8 py-4 border border-white/70 rounded-xl font-semibold hover:bg-white/10 transition"
              onClick={() => router.push("/contact")}
            >
              Book a technical deep dive
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CampAign</span>
              </div>
              <p className="text-sm">
                Design, automate, and learn from WhatsApp journeys without
                spreadsheets or guesswork.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition"
                  >
                    Flow builder
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition"
                  >
                    Stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/press" className="hover:text-white transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/help" className="hover:text-white transition">
                    Help center
                  </a>
                </li>
                <li>
                  <a href="/status" className="hover:text-white transition">
                    Status
                  </a>
                </li>
                <li>
                  <a href="/security" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} CampAign. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
