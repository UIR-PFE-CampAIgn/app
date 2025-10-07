'use client'
import React, { useState } from 'react';
import { MessageSquare, Send, Users, BarChart3, Zap, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CampAign
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition">How it Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</a>
             
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg" onClick={() => router.push('/auth/login')}>
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-slate-600 hover:text-slate-900">Features</a>
              <a href="#how-it-works" className="block text-slate-600 hover:text-slate-900">How it Works</a>
              <a href="#pricing" className="block text-slate-600 hover:text-slate-900">Pricing</a>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg" onClick={() => router.push('/auth/login')}>
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">WhatsApp Campaign Management</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Automate Your WhatsApp
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Campaigns</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Create, schedule, and manage WhatsApp broadcast campaigns with ease. 
              Reach your leads with personalized messages at the perfect time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-xl flex items-center justify-center gap-2 group" onClick={() => router.push('/auth/login')}>
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <button className="px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition">
                Watch Demo
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-8 shadow-2xl">
              <div className="aspect-video bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                <MessageSquare className="w-24 h-24 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features to manage your WhatsApp campaigns effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Message Templates",
                description: "Create reusable templates with dynamic variables for personalized messaging"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Smart Scheduling",
                description: "Schedule campaigns or set up recurring broadcasts with cron expressions"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Lead Management",
                description: "Organize and segment your leads for targeted campaign delivery"
              },
              {
                icon: <Send className="w-6 h-6" />,
                title: "Automated Sending",
                description: "Set it and forget it - campaigns run automatically at scheduled times"
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Campaign Analytics",
                description: "Track sent, failed, and pending messages with detailed logs"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Delivery Tracking",
                description: "Monitor message status and campaign performance in real-time"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get started in minutes with our simple workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Templates",
                description: "Design message templates with personalized variables like {{name}} and {{discount}}"
              },
              {
                step: "2",
                title: "Schedule Campaigns",
                description: "Select your template, choose target leads, and set the send time"
              },
              {
                step: "3",
                title: "Track Results",
                description: "Monitor campaign performance with real-time analytics and delivery logs"
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Scale Your WhatsApp Outreach?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of businesses automating their campaigns with CampAign
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition shadow-xl font-semibold flex items-center gap-2 mx-auto group">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
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
                Automate your WhatsApp campaigns with ease
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 CampAign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
