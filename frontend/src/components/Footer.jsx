import { Link } from 'react-router-dom';
import {
  Globe,
  Share2,
  BadgeCheck,
  Play,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

import logo from '../assets/logo.jpeg';

const socialLinks = [
  {
    icon: Globe,
    href: 'https://www.facebook.com/',
    label: 'Facebook',
  },
  {
    icon: Share2,
    href: 'https://www.instagram.com/',
    label: 'Instagram',
  },
  {
    icon: BadgeCheck,
    href: 'https://www.linkedin.com/',
    label: 'LinkedIn',
  },
  {
    icon: Play,
    href: 'https://www.youtube.com/',
    label: 'YouTube',
  },
];

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Track Order', to: '/orders' },
  { label: 'Services', to: '/services' },
  { label: 'Best Sellers', to: '/best-sellers' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const categories = [
  { label: 'Antibiotics', to: '/products' },
  { label: 'Pain Relief', to: '/products' },
  { label: 'Cardiology', to: '/products' },
  { label: 'Respiratory', to: '/products' },
  { label: 'Vitamins', to: '/products' },
  { label: 'Anti-Allergic', to: '/products' },
];

const payments = ['UPI', 'Cards', 'COD', 'Razorpay'];

const Footer = () => {
  return (
    <footer className="relative mt-24 overflow-hidden bg-[#06130b] text-white">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-lime-400/20 blur-3xl" />

        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/5" />
      </div>

      {/* NEWSLETTER */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-emerald-500 to-lime-400 p-[1px] shadow-[0_20px_80px_rgba(16,185,129,0.25)]">

          <div className="rounded-[40px] bg-[#07170d] p-8 lg:p-12">

            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300 backdrop-blur">
                  <Sparkles size={15} />
                  Licensed Pharmaceutical Distributor
                </div>

                <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                  Trusted Medicines.
                  <span className="block bg-gradient-to-r from-emerald-300 to-lime-300 bg-clip-text text-transparent">
                    Quality Assured Delivery.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                  WHO-GMP certified pharmaceutical products, anti-cancer drugs,
                  life-saving medications, and complete healthcare solutions
                  delivered with excellence across India.
                </p>
              </div>

              <div className="w-full max-w-xl">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-16 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white outline-none backdrop-blur placeholder:text-slate-400 focus:border-emerald-400"
                  />

                  <button className="group flex h-16 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 px-7 text-sm font-black uppercase tracking-[0.15em] text-slate-900 transition hover:scale-105">
                    Subscribe

                    <ArrowUpRight
                      size={18}
                      className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </button>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  Secure & spam-free newsletter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* BRAND */}
        <div>
          <Link to="/" className="group flex items-center gap-4">

            <div className="relative h-20 w-20 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl">
              <img
                src={logo}
                alt="Akshaygun"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-lime-400/10" />
            </div>

            <div>
              <h2 className="bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-4xl font-black text-transparent">
                Akshaygun
              </h2>

              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-300">
                Akshaygun Pharma
              </p>
            </div>
          </Link>

          <p className="mt-7 text-sm leading-8 text-slate-400">
            WHO-GMP certified pharmaceutical distributor providing
            licensed medicines, anti-cancer drugs, and life-saving medications
            with complete product traceability and emergency support.
          </p>

          {/* SOCIAL */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-lime-400 hover:text-slate-900"
                >
                  <Icon
                    size={20}
                    className="transition group-hover:scale-110"
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-lime-300" />

            <h3 className="text-2xl font-black text-white">
              Quick Links
            </h3>
          </div>

          <div className="mt-8 space-y-4">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group flex items-center gap-3 text-sm font-semibold text-slate-400 transition hover:text-emerald-300"
              >
                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />

                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-lime-300" />

            <h3 className="text-2xl font-black text-white">
              Categories
            </h3>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-300 backdrop-blur transition duration-300 hover:border-emerald-400/30 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-lime-400 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* EXTRA CARD */}
          <div className="mt-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900">
                <HeartHandshake size={24} />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  Trusted Pharma Partner
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Licensed pharmaceutical distributor trusted by 500+ hospitals
                  and clinics for quality medicines and emergency orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-lime-300" />

            <h3 className="text-2xl font-black text-white">
              Contact Us
            </h3>
          </div>

          <div className="mt-8 space-y-5">

            {/* PHONE */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-emerald-400/20">

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Phone
                  </p>

                  <a
                    href="tel:+919560686060"
                    className="mt-2 block text-sm font-bold text-white"
                  >
                    +91 9560686060
                  </a>

                  <a
                    href="tel:+919999831636"
                    className="mt-1 block text-sm font-bold text-white"
                  >
                    +91 9999831636
                  </a>
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-emerald-400/20">

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </p>

                  <a
                    href="mailto:shreebhairavint18@gmail.com"
                    className="mt-2 block break-all text-sm font-bold text-white"
                  >
                    shreebhairavint18@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-emerald-400/20">

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Address
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    1712/19, Mangal Building-2,
                    <br />
                    Bhagirath Palace,
                    <br />
                    Delhi - 110006, India
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}
            <button
              onClick={() => openWhatsAppChat('Hello! I have a question about your pharmaceutical products.')}
              className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-sm font-black uppercase tracking-[0.15em] text-slate-900 shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition hover:scale-105"
            >
              <MessageCircle size={20} />

              Chat On WhatsApp

              <ArrowUpRight
                size={18}
                className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>
            <p className="text-base font-black text-white">
              © 2026 Akshaygun Pharmaceuticals. All rights reserved.
            </p>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              Disclaimer: All medications are WHO-GMP certified. 
              Consult healthcare providers before use. Licensed distributor 
              with complete regulatory compliance.
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Secure Payments
            </p>

            <div className="flex flex-wrap gap-3">
              {payments.map((item) => (
                <div
                  key={item}
                  className="flex h-12 min-w-[100px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-xs font-black uppercase tracking-[0.15em] text-slate-300 backdrop-blur transition duration-300 hover:border-emerald-400/30 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-lime-400 hover:text-slate-900"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
