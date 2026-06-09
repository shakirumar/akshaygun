import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Leaf,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const values = [
  {
    icon: <Leaf size={34} />,
    title: 'FDA Certified',
    description:
      'We supply only FDA and WHO-GMP certified pharmaceutical products for maximum safety and efficacy.'
  },
  {
    icon: <ShieldCheck size={34} />,
    title: 'Quality Assured',
    description:
      'Every medication goes through strict quality checks and authentication to ensure purity and effectiveness.'
  },
  {
    icon: <HeartHandshake size={34} />,
    title: 'Healthcare Partner',
    description:
      'Your trusted pharmaceutical distributor for hospitals, clinics, and healthcare providers.'
  },
  {
    icon: <Sparkles size={34} />,
    title: 'Emergency Support',
    description:
      'Dedicated 24/7 support for urgent medicine orders and emergency pharmaceutical supplies.'
  }
];

const reasons = [
  '100% Authentic Licensed Medications',
  'WHO-GMP Certified Products',
  'Trusted by 500+ Hospitals',
  'Pan-India Emergency Delivery',
  'Affordable Medicine Solutions',
  'Dedicated Pharmaceutical Support'
];

const About = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-5 py-2 text-sm font-medium text-green-100 backdrop-blur">
                Licensed Pharmaceutical Distributor
              </span>

              <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold leading-tight text-white">
                About <span className="text-yellow-300">Akshaygun</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-green-100 max-w-2xl">
                Bringing trusted pharmaceutical solutions to hospitals,
                clinics and healthcare providers with WHO-GMP certified
                medications and life-saving drugs.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-green-950 transition hover:scale-105 hover:bg-yellow-300"
                >
                  Explore Products
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#store"
                  className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Visit Store
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-5 -left-5 h-full w-full rounded-[2rem] bg-yellow-300/20"></div>

              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80"
                alt="Wellness"
                className="relative h-[500px] w-full rounded-[2rem] object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80"
                alt="About Akshaygun"
                className="rounded-[2rem] shadow-2xl"
              />

              <div className="absolute -bottom-8 -right-8 rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-4xl font-extrabold text-green-700">10+</h3>
                <p className="text-gray-600 font-medium">
                  Years of Wellness Experience
                </p>
              </div>
            </div>

            <div>
              <span className="text-green-600 font-bold uppercase tracking-wider">
                Who We Are
              </span>

              <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Professional Pharmaceutical Distribution
              </h2>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Akshaygun is a licensed pharmaceutical distributor providing
                WHO-GMP certified medicines and life-saving drugs to hospitals,
                clinics, and healthcare providers. Our mission is to ensure
                reliable access to quality medications across India.
              </p>

              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                We maintain strict quality standards, authenticity verification,
                and emergency supply capabilities for all pharmaceutical products.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-5">
                {[
                  'WHO-GMP Certified',
                  'FDA Approved Drugs',
                  'Licensed Distributor',
                  'Trusted Hospitals'
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4"
                  >
                    <CheckCircle2 className="text-green-600" size={22} />
                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-gradient-to-b from-green-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-green-600 font-bold uppercase tracking-widest">
              Our Values
            </span>

            <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900">
              Why Hospitals Trust Akshaygun
            </h2>

            <p className="mt-6 text-lg text-gray-600">
              We are committed to delivering authentic pharmaceutical
              medications with quality assurance, reliability, and trust.
            </p>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white">
                  {value.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {value.title}
                </h3>

                <p className="mt-4 leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE SECTION */}
      <section
        id="store"
        className="bg-gradient-to-br from-gray-50 to-green-50 py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-green-600 font-bold uppercase tracking-widest">
              Visit Us
            </span>

            <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900">
              Our Store Information
            </h2>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-10">
            {/* LEFT CARD */}
            <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Akshaygun Store
              </h3>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <MapPin size={26} />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Address
                    </h4>

                    <p className="mt-2 text-gray-600 leading-relaxed">
                      1712/19, Mangal Building - 2
                      <br />
                      Ground Floor, Bhagirath Palace
                      <br />
                      Delhi - 110006, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Phone size={24} />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Phone</h4>

                    <p className="mt-2 text-gray-600">
                       +91 9560686060
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Mail size={24} />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Email</h4>

                    <p className="mt-2 text-gray-600">
                       shreebhairavint18@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Clock size={24} />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Working Hours
                    </h4>

                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Monday - Sunday: 10:00 AM - 8:00 PM
                      <br />
                      Holidays: By Appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.1234567890123!2d77.23456789999999!3d28.654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0000000000%3A0x1234567890123456!2sBhagirath%20Palace%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                className="min-h-[500px]"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-green-600 font-bold uppercase tracking-widest">
              Benefits
            </span>

            <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900">
              Why Choose Akshaygun?
            </h2>

            <p className="mt-6 text-lg text-gray-600">
              Trusted wellness solutions crafted with purity,
              authenticity, and customer satisfaction in mind.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-xl font-bold text-white">
                  {idx + 1}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {reason}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  Experience premium wellness products designed to support
                  healthier living naturally and effectively.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-800 to-green-950 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-yellow-300 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Start Your Natural Wellness Journey Today
          </h2>

          <p className="mt-6 text-xl leading-relaxed text-green-100">
            Discover authentic wellness products crafted to improve your
            lifestyle, health, and overall well-being naturally.
          </p>

          <div className="mt-10">
            <a
              href="/products"
              className="inline-flex items-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-bold text-green-950 transition hover:scale-105 hover:bg-yellow-300"
            >
              Shop Now
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
