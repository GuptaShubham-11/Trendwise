'use client';

import { useSession } from "next-auth/react";
import GoogleAuthenticateButton from "@/components/GoogleAuthenticateButton";
import { Sparkles, Rocket, Globe2, ShieldCheck, Wand2, TrendingUp } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-bg text-txt flex flex-col">
      {/* Header */}
      <header className="px-6 flex justify-between items-center bg-sur shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-pri tracking-tight">TrendWise</h1>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Stay Ahead of the Curve
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Discover trending topics, AI-generated insights, and SEO-ready articles—all in one platform.
        </p>

        <div className="flex justify-center">
          <GoogleAuthenticateButton />
        </div>

        {!session && (
          <p className="text-sm text-gray-400 mt-3">
            Sign in with Google to unlock personalized content.
          </p>
        )}
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-bg text-txt">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose TrendWise?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <TrendingUp className="h-6 w-6 text-pri" />,
              title: "Real-Time Trends",
              description: "Our AI monitors the web 24/7 to bring you the most relevant and trending topics as they happen.",
            },
            {
              icon: <Wand2 className="h-6 w-6 text-pri" />,
              title: "AI-Generated Content",
              description: "Articles are written using advanced AI models like Gemini for high-quality, informative results.",
            },
            {
              icon: <Rocket className="h-6 w-6 text-pri" />,
              title: "SEO Optimized",
              description: "All articles are structured with keywords and meta data to improve discoverability on search engines.",
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-pri" />,
              title: "Secure & Private",
              description: "We protect your data with modern security practices and never share it without your permission.",
            },
            {
              icon: <Sparkles className="h-6 w-6 text-pri" />,
              title: "Elegant UI",
              description: "Enjoy a minimal and aesthetic UI experience with easy navigation and dark mode support.",
            },
            {
              icon: <Globe2 className="h-6 w-6 text-pri" />,
              title: "Global Reach",
              description: "Our engine pulls trends from multiple geographies and languages for a truly global perspective.",
            },
          ].map(({ icon, title, description }, i) => (
            <div key={i} className="p-6 bg-sur rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                {icon}
                <h4 className="text-xl font-semibold">{title}</h4>
              </div>
              <p className="text-sm text-sec">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sur py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-10 text-pri">What People Are Saying</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Anjali Sharma",
              comment: "TrendWise is my go-to tool for learning about the latest trends. It's user-friendly and informative.",
            },
            {
              name: "Karthik Mehta",
              comment: "The AI-generated blogs save me hours of work every week. It's a game changer!",
            },
            {
              name: "Reena Roy",
              comment: "Super clean interface and the topics are always relevant. Love it!",
            },
          ].map(({ name, comment }, idx) => (
            <div key={idx} className="bg-bg p-6 rounded-xl shadow border border-border">
              <p className="italic mb-3 text-mt">“{comment}”</p>
              <h4 className="text-sm font-semibold text-pri">— {name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-mt text-sm py-6 border-t border-border bg-bg">
        © 2025 TrendWise. Crafted with ❤️ by Gupta Shubham.
      </footer>
    </main>
  );
}
