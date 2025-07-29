'use client';

import { useSession } from "next-auth/react";
import GoogleAuthenticateButton from "@/components/GoogleAuthenticateButton";
import { Sparkles, Rocket, ShieldCheck, Wand2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-bg text-txt overflow-hidden">
      {/* Minimal Animated Header */}
      <motion.header
        className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${isScrolled ? "bg-sur/80 backdrop-blur-md shadow-sm" : "bg-transparent"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.h1
          className="text-2xl font-bold text-pri tracking-tight flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <Sparkles className="text-acc" size={20} />
          TrendWise
        </motion.h1>

        <GoogleAuthenticateButton />
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pri/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-acc/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri to-acc">
                Stay Ahead
              </span> of Trends
            </motion.h2>

            <motion.p
              className="text-lg text-txt/80 max-w-md mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AI-powered insights for the modern creator
            </motion.p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GoogleAuthenticateButton />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-6 bg-sur/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h3
            className="text-3xl font-bold mb-4 text-mt"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Transform Content Creation
          </motion.h3>
          <motion.p
            className="text-txt/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our AI analyzes trends and generates SEO-optimized content so you can focus on what matters.
          </motion.p>
        </div>

        {/* Core Features */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <TrendingUp className="h-6 w-6 text-pri" />,
              title: "Real-Time Trends",
              description: "Always know what's trending right now",
            },
            {
              icon: <Wand2 className="h-6 w-6 text-pri" />,
              title: "AI Content",
              description: "High-quality articles generated instantly",
            },
            {
              icon: <Rocket className="h-6 w-6 text-pri" />,
              title: "SEO Optimized",
              description: "Content designed to rank well",
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-pri" />,
              title: "Secure & Private",
              description: "Your data stays protected",
            },
          ].map(({ icon, title, description }, i) => (
            <motion.div
              key={i}
              className="p-6 bg-bg/80 backdrop-blur-sm rounded-xl border border-sur shadow-sm flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="p-2 bg-sur rounded-lg">
                {icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-mt mb-1">{title}</h4>
                <p className="text-txt/80 text-sm">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#0f0c29] to-[#24243e]">
        <div className="max-w-3xl mx-auto">
          <motion.h3
            className="text-2xl font-bold text-center mb-12 text-mt"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Trusted by Creators
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Anjali Sharma",
                comment: "Saves me hours of research every week. The AI insights are spot on!",
              },
              {
                name: "Karthik Mehta",
                comment: "My content ranking improved dramatically after switching to TrendWise.",
              },
            ].map(({ name, comment }, idx) => (
              <motion.div
                key={idx}
                className="p-6 bg-sur/80 backdrop-blur-sm rounded-xl border border-pri/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <p className="text-mt/90 mb-4 italic">"{comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="bg-pri/10 rounded-full w-10 h-10 flex items-center justify-center text-pri font-bold">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-mt">{name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-sur">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h3
            className="text-3xl font-bold mb-4 text-mt"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to get started?
          </motion.h3>
          <motion.p
            className="text-txt/80 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of creators using TrendWise today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GoogleAuthenticateButton />
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="text-center text-txt/60 text-sm py-8 border-t border-sur bg-bg">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-lg font-bold text-pri">
              <Sparkles size={18} />
              TrendWise
            </div>
          </div>
          <p>© 2025 TrendWise. Crafted with ❤️ by Gupta Shubham.</p>
        </div>
      </footer>
    </main>
  );
}