import {
  Pill,
  Heart,
  Truck,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
  BadgeCheck,
  Building2,
  Ambulance,
  ArrowRight,
  PhoneCall,
  Mail,
  Sparkles
} from 'lucide-react';

const serviceCards = [
  {
    icon: Pill,
    title: 'Anti-Cancer Drugs',
    description:
      'Certified oncology medications including targeted therapies, chemotherapy agents, and immunotherapy drugs.'
  },
  {
    icon: Heart,
    title: 'Life-Saving Drugs',
    description:
      'Critical cardiac, respiratory, and emergency medicines with complete product traceability.'
  },
  {
    icon: Truck,
    title: 'Pan-India Distribution',
    description:
      'Rapid and reliable supply network covering major cities, clinics, and hospitals.'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description:
      'WHO-GMP aligned sourcing and strict quality control at every stage of fulfillment.'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description:
      'Dedicated round-the-clock support team for urgent orders and emergency requests.'
  },
  {
    icon: TrendingUp,
    title: 'Expert Guidance',
    description:
      'Specialized pharmaceutical consultants to assist with optimal treatment procurement.'
  }
];

const categories = [
  {
    title: 'Oncology (Anti-Cancer)',
    items: [
      'Chemotherapy agents',
      'Targeted therapy drugs',
      'Immunotherapy medications',
      'Supportive care drugs',
      'Hormonal therapy agents'
    ]
  },
  {
    title: 'Cardiovascular & Respiratory',
    items: [
      'Heart disease medications',
      'Hypertension treatments',
      'Respiratory drugs',
      'Asthma medications',
      'Emergency cardiac care'
    ]
  },
  {
    title: 'Infectious Diseases',
    items: [
      'Antibiotics',
      'Antivirals',
      'Anti-tubercular drugs',
      'HIV/AIDS treatments',
      'Antimalarial medications'
    ]
  },
  {
    title: 'Critical Care',
    items: [
      'ICU medications',
      'Sedatives and analgesics',
      'Infection management',
      'Organ support drugs',
      'Emergency medications'
    ]
  }
];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: 'WHO-GMP Certified',
    description:
      'Manufacturing and sourcing follow globally recognized quality benchmarks.'
  },
  {
    icon: Building2,
    title: 'Government Licensed',
    description:
      'Authorized pharmaceutical distribution with required legal certifications.'
  },
  {
    icon: Ambulance,
    title: 'Emergency Response',
    description:
      'High-priority dispatch support for critical life-saving medicine requests.'
  }
];

const stats = [
  { label: 'States Covered', value: '28+' },
  { label: 'Cities Served', value: '200+' },
  { label: 'Hospital Partners', value: '500+' },
  { label: 'Daily Deliveries', value: '1000+' }
];

const orderSteps = [
  {
    step: 1,
    title: 'Browse Catalog',
    description:
      'Select the required medicines from our professional pharmaceutical catalog.'
  },
  {
    step: 2,
    title: 'Confirm Quantity',
    description:
      'Choose quantity and pack size based on hospital or clinic requirement.'
  },
  {
    step: 3,
    title: 'Secure Checkout',
    description:
      'Submit delivery details and payment method through our secure process.'
  },
  {
    step: 4,
    title: 'Tracked Delivery',
    description:
      'Receive medicines with traceable logistics and cold chain handling where needed.'
  }
];

const Services = () => {
  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-800 to-cyan-700" />

        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Pharmaceutical Division
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">
              Trusted Supply Of
              <span className="block bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                Critical Medicines
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
              Reliable pharmaceutical distribution for hospitals, clinics,
              healthcare providers, and emergency care centers across India.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="tel:+919560686060"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-emerald-800 transition hover:scale-105"
              >
                <PhoneCall size={18} />
                Call Now
              </a>

              <a
                href="mailto:shreebhairavint18@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Mail size={18} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              OUR SERVICES
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              Pharmaceutical Solutions
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
              End-to-end healthcare supply solutions designed for reliability,
              speed, compliance, and patient safety.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map(
              ({ icon: IconComponent, title, description }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-100 blur-3xl transition-all duration-500 group-hover:bg-emerald-200" />

                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-white shadow-lg">
                      <IconComponent size={28} />
                    </div>

                    <h3 className="mt-6 text-2xl font-black text-slate-900">
                      {title}
                    </h3>

                    <p className="mt-4 leading-relaxed text-slate-600">
                      {description}
                    </p>

                    <button className="mt-6 inline-flex items-center gap-2 font-bold text-emerald-700 transition hover:gap-3">
                      Learn More
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
              Medicine Categories
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
              >
                <h3 className="text-2xl font-black text-emerald-800">
                  {category.title}
                </h3>

                <div className="mt-6 space-y-4">
                  {category.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                    >
                      <CheckCircle2
                        size={22}
                        className="mt-0.5 text-emerald-600"
                      />

                      <span className="font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
              Why Choose Akshaygun
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {trustPoints.map(
              ({ icon: IconComponent, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl bg-gradient-to-br from-emerald-600 to-cyan-700 p-8 text-white shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <IconComponent size={30} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black">{title}</h3>

                  <p className="mt-4 leading-relaxed text-emerald-50">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md"
              >
                <h3 className="text-5xl font-black text-yellow-300">
                  {stat.value}
                </h3>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER PROCESS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
              Ordering Process
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {orderSteps.map((item) => (
              <div
                key={item.step}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-2xl font-black text-white">
                  {item.step}
                </div>

                <h3 className="mt-6 text-2xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-700 py-24 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] md:text-6xl">
    Need Emergency Pharmaceutical Support?
  </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
            Our dedicated healthcare support team is available 24/7 for urgent
            medicine requests and hospital supply assistance.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="tel:+919560686060"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-black text-emerald-800 shadow-xl transition hover:scale-105"
            >
              <PhoneCall size={18} />
              +91 9560686060
            </a>

            <a
              href="mailto:shreebhairavint18@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <Mail size={18} />
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;