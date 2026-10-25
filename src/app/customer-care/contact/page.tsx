"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants/brand";
import { Mail, Phone, MapPin, CheckCircle2, ShieldCheck, MessageCircle, Clock, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("Product & Wellness Advice");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot spam trap
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for bots

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          topic,
          orderNumber,
          message,
          botField: honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketId(data.ticketId);
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to submit message. Please reach us via WhatsApp.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Network connection issue. Please connect with us directly on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = BRAND.contact.phone.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container size="md">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-12 space-y-8 shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6857]">
                Customer Concierge & Support
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Contact Cure-Care Studio
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Need guidance choosing the right herbal balm, verifying product authenticity, or tracking your express delivery? Our concierge team is ready to assist.
              </p>
            </div>

            {/* Direct Instant Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone.startsWith("0") ? "88" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                  "Hello Cure-Care Concierge, I would like to inquire about your products and remedies."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors group"
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-emerald-900 dark:text-emerald-200">WhatsApp Concierge</span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400">Instant Chat & Orders</span>
                </div>
              </a>

              <a
                href={`tel:${BRAND.contact.phone}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-2 rounded-xl bg-[#005A64] text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-zinc-900 dark:text-zinc-100">Hotline Phone</span>
                  <span className="text-[11px] text-zinc-500 font-mono">{BRAND.contact.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${BRAND.contact.email}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-2 rounded-xl bg-[#FF6857] text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-zinc-900 dark:text-zinc-100">Direct Email</span>
                  <span className="text-[11px] text-zinc-500 truncate block">{BRAND.contact.email}</span>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>Support Hours: {BRAND.contact.hours} | Dhaka, Bangladesh</span>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-center space-y-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-xl">Inquiry Successfully Received!</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                    Reference Ticket ID: <span className="font-bold text-sm bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-lg">{ticketId}</span>
                  </p>
                </div>
                <p className="text-xs max-w-md mx-auto text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                  Thank you for contacting Cure-Care. Our customer care specialist has received your message and will review it promptly.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="border-emerald-400 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100"
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

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
                    placeholder="e.g. Tanvir Ahmed"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone / WhatsApp Number (Optional)"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Topic / Reason
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#FF6857]"
                    >
                      <option value="Product & Wellness Advice">Product & Wellness Advice</option>
                      <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                      <option value="Wholesale & Bulk Inquiries">Wholesale & Bulk Inquiries</option>
                      <option value="Authenticity Verification">Authenticity Verification</option>
                      <option value="Other Assistance">Other Assistance</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Order Number (Optional)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. CC-1042"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Your Message / Question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can assist you with your remedy selection or order..."
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#FF6857]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Secure encrypted submission & spam-protected</span>
                  </div>
                  <Button type="submit" isLoading={loading} size="lg" className="sm:w-auto w-full">
                    Send Customer Inquiry
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
