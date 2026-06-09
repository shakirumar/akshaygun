import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Leaf,
  ShieldCheck,
  HeartPulse,
  Clock3,
} from 'lucide-react';

const blogPosts = [
  {
    icon: Leaf,
    title: 'Wellness Tips',
    description:
      'Daily rituals, balanced nutrition, and guidance to support your natural health goals.',
  },
  {
    icon: ShieldCheck,
    title: 'Pharma Management',
    description:
      'How to choose certified medicines, maintain proper storage, and navigate pharmacy delivery with ease.',
  },
  {
    icon: Sparkles,
    title: 'Natural Immunity',
    description:
      'Effective immune support strategies with time-tested herbs and healthy lifestyle habits.',
  },
  {
    icon: HeartPulse,
    title: 'Skin & Digestion',
    description:
      'Balanced care for glowing skin and gentle digestion using clean wellness formulations.',
  },
];

const Blog = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f9fff8] via-[#f4fbf4] to-[#eef8ef] py-24">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="absolute bottom-[-140px] right-[-120px] h-[340px] w-[340px] rounded-full bg-lime-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="overflow-hidden rounded-[40px] border border-emerald-100 bg-white shadow-[0_20px_80px_rgba(16,185,129,0.08)]">
          
          <div className="grid gap-12 p-8 lg:grid-cols-2 lg:p-14">
            
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm">
                <BookOpen size={18} />
                Health & Wellness Blog
              </div>

              <h1 className="mt-7 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                Insights From The World Of Wellness
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
                Explore trusted wellness articles, wellness guides,
                immunity tips, skincare routines, natural remedies,
                and pharmacy best practices for a healthier lifestyle.
              </p>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-wrap gap-4">
                
                <Link
                  to="/products"
                  className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-7 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  Browse Products

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-7 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  Contact Support
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
                      Weekly Updates
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Fresh Wellness Articles
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Expert Content
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Trusted Wellness Tips
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative">
              
              <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-emerald-400/10 to-lime-300/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 p-8 shadow-sm">
                
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Featured Topic
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-950">
                      Daily Wellness
                    </h3>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700">
                    <Leaf size={30} />
                  </div>
                </div>

                <p className="text-sm leading-8 text-slate-600">
                  Learn how natural ingredients, mindful nutrition,
                  hydration, proper sleep, and mindful routines
                  can naturally improve immunity, digestion,
                  skincare, and overall wellness.
                </p>

                <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Wellness Highlight
                  </p>

                  <p className="mt-3 text-lg font-bold leading-8 text-slate-900">
                    "Healthy living begins with small daily habits
                    powered by natural wellness."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50 px-8 py-6 lg:px-14">
            
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                Read informative articles and discover trusted
                wellness knowledge for a healthier, balanced
                lifestyle.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 transition-all duration-300 hover:gap-3"
              >
                Explore Wellness Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* BLOG CARDS */}
        <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={index}
                className="group overflow-hidden rounded-[32px] border border-emerald-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* ICON */}
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700 transition-all duration-300 group-hover:scale-110">
                  <Icon size={30} />
                </div>

                {/* CONTENT */}
                <h2 className="mt-6 text-2xl font-black text-slate-950">
                  {item.title}
                </h2>

                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {item.description}
                </p>

                {/* BUTTON */}
                <button className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition-all duration-300 hover:gap-3">
                  Read More
                  <ArrowRight size={18} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Blog;
