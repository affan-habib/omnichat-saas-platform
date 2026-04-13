"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Shield, 
  Zap, 
  Globe, 
  Bot, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  Camera,
  Send,
  Code,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              OmniChat
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="#solutions" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Solutions</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/login">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity border-none h-10 px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider uppercase text-blue-400">
              Next-Gen Communications
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
          >
            Unified Chat for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Modern Enterprises
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Connect all your communication channels into one powerful dashboard. WhatsApp, Messenger, Instagram, and more—manage it all with OmniChat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-10 h-14 rounded-full font-bold border-none">
              Start Building Free
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white text-lg px-10 h-14 rounded-full font-bold">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative w-full max-w-5xl group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass p-2 rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
              <Image 
                src="/images/hero.png" 
                alt="OmniChat Dashboard Preview" 
                width={1200} 
                height={800}
                className="rounded-xl w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Active Users", value: "500k+" },
            { label: "Messages Sent", value: "2B+" },
            { label: "App Integrations", value: "100+" },
            { label: "Customer Rating", value: "4.9/5" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <br /> scale support</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Powerful features designed to help your team manage thousands of conversations without breaking a sweat.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Real-time Sync",
                description: "Messages from all platforms arrive in milliseconds. No more refreshing or switching tabs."
              },
              {
                icon: <Bot className="w-6 h-6 text-blue-400" />,
                title: "AI Automations",
                description: "Deploy intelligent bots that handle routine queries and route complex issues to human agents."
              },
              {
                icon: <Shield className="w-6 h-6 text-green-400" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and SOC2 compliance ensure your customer data stays private."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
                title: "Advanced Analytics",
                description: "Track response times, agent performance, and customer satisfaction in real-time."
              },
              {
                icon: <Globe className="w-6 h-6 text-pink-400" />,
                title: "Global Reach",
                description: "Support for 50+ languages with automatic translation features for global teams."
              },
              {
                icon: <MessageCircle className="w-6 h-6 text-cyan-400" />,
                title: "Team Collaboration",
                description: "Internal notes, @mentions, and collision detection to keep your team in sync."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="group p-8 rounded-3xl glass border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] border border-white/10 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to transform your communication?</h2>
          <p className="text-gray-400 text-lg mb-12">Join 10,000+ companies already using OmniChat to deliver world-class support.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-16 rounded-2xl font-bold text-lg group border-none">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white px-10 h-16 rounded-2xl font-bold text-lg">
              Contact Sales
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-50 flex-wrap">
             <div className="flex items-center gap-2 font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-blue-500" /> No credit card required</div>
             <div className="flex items-center gap-2 font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Free 14-day trial</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">OmniChat</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Empowering teams to build better relationships through unified communication.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Code className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Integrations", "Pricing", "Changelog"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Contact"]
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"]
            }
          ].map((column, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-6 italic">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs text-center md:text-left">
            © 2026 OmniChat Inc. All rights reserved. 
          </p>
          <div className="flex gap-8 items-center">
             <span className="text-[10px] text-gray-700 uppercase tracking-widest font-black">Built with Passion</span>
             <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Status: All Green</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
