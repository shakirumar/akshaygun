import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock3,
  ShieldCheck,
} from 'lucide-react';

const Contact = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f9fff8] via-[#f4fbf4] to-[#eef8ef] py-24">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="absolute bottom-[-140px] right-[-120px] h-[340px] w-[340px] rounded-full bg-lime-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-[40px] border border-emerald-100 bg-white shadow-[0_20px_80px_rgba(16,185,129,0.08)]">
          
          {/* TOP SECTION */}
          <div className="grid gap-12 p-8 lg:grid-cols-2 lg:p-14">
            
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm">
                <ShieldCheck size={18} />
                Trusted Wellness Support
              </div>

              <h1 className="mt-7 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                We're Here To Help You
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
                Reach out for product guidance, order support,
                pharmacy solutions, wellness consultations,
                or general questions. Our support team responds quickly
                with reliable assistance.
              </p>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-wrap gap-4">
                
                <a
                  href="https://wa.me/919560686060?text=Hello%20Akshaygun%20team"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-7 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <MessageCircle
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />

                  Chat on WhatsApp
                </a>

                <Link
                  to="/products"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-7 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  Browse Products
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* EXTRA INFO */}
              <div className="mt-10 flex flex-wrap gap-6">
                
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Support Hours
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Mon - Sat : 9AM - 8PM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              
              <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-emerald-400/10 to-lime-300/10 blur-2xl" />

              <div className="relative space-y-6 rounded-[36px] border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 p-7 shadow-sm">
                
                {/* PHONE */}
                <div className="group flex items-start gap-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700">
                    <Phone size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Phone Support
                    </p>

                    <a
                      href="tel:+919560686060"
                      className="mt-3 block text-lg font-black text-slate-900 transition-colors duration-300 hover:text-emerald-600"
                    >
                      +91 9560686060
                    </a>

                    <a
                      href="tel:+919999831636"
                      className="mt-1 block text-base font-semibold text-slate-700 transition-colors duration-300 hover:text-emerald-600"
                    >
                      +91 9999831636
                    </a>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Available for order assistance, delivery help,
                      and wellness consultations.
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="group flex items-start gap-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700">
                    <Mail size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Email Address
                    </p>

                    <a
                      href="mailto:shreebhairavint18@gmail.com"
                      className="mt-3 block break-all text-base font-black leading-8 text-slate-900 transition-colors duration-300 hover:text-emerald-600"
                    >
                      shreebhairavint18@gmail.com
                    </a>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Send product inquiries, support requests,
                      or business partnership discussions anytime.
                    </p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="group flex items-start gap-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Office Address
                    </p>

                    <p className="mt-3 text-base font-semibold leading-8 text-slate-700">
                      1712/19, Mangal Building-2,
                      <br />
                      Bhagirath Palace,
                      <br />
                      Delhi - 110006, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50 px-8 py-6 lg:px-14">
            
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                Our wellness experts are dedicated to providing safe,
                authentic, and reliable support for your health journey.
              </p>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 transition-all duration-300 hover:gap-3"
              >
                Visit Wellness Blog
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
