"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants/brand";
import { Mail, Phone, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot spam trap
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for bots

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FC5A43]">
                Customer Concierge
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Contact Cure-Care Support
              </h1>
              <p className="text-sm text-zinc-500">
                Questions regarding sizing, leather care, or international dispatch? Our studio team is here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Mail className="h-4 w-4 text-[#FC5A43]" />
                <a href={`mailto:${BRAND.contact.email}`} className="hover:underline">
                  {BRAND.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Phone className="h-4 w-4 text-[#FC5A43]" />
                <span>{BRAND.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4 text-[#FC5A43]" />
                <span>{BRAND.origin}</span>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
                <h3 className="font-bold text-lg">Message Received</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Thank you for reaching out. A client support specialist will respond to your inquiry within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field invisible to humans, catches automated form-spammers */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@example.com"
                  />
                </div>

                <Input
                  label="Subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order Inquiry / Product Sizing Advice"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist your carry setup?"
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#FC5A43]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Protected against spam</span>
                  </div>
                  <Button type="submit" isLoading={loading} size="lg">
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
