import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

const TEAM = [
  { name: 'Arjun Sharma', role: 'CEO & Founder', bio: 'With 15+ years in travel tech, Arjun founded Travel Sparsh to democratize flight booking in India.', initials: 'AS', bg: 'bg-primary-600' },
  { name: 'Priya Patel', role: 'Chief Technology Officer', bio: 'Former tech lead at a leading OTA, Priya architected our platform for scale and reliability.', initials: 'PP', bg: 'bg-purple-600' },
  { name: 'Ravi Kumar', role: 'Head of Partnerships', bio: 'Ravi manages our relationship with Adivaha and 50+ airline partners across the globe.', initials: 'RK', bg: 'bg-green-600' },
  { name: 'Meera Nair', role: 'Customer Success Lead', bio: 'Meera ensures every traveller has a seamless experience from booking to landing.', initials: 'MN', bg: 'bg-accent-500' },
];

const VALUES = [
  { icon: '🎯', title: 'Transparency', desc: 'No hidden fees. No surprises. Just honest pricing and clear information.' },
  { icon: '🤝', title: 'Trust', desc: 'We build lasting relationships with our travellers based on reliability and integrity.' },
  { icon: '⚡', title: 'Innovation', desc: 'Constantly improving our technology to make your booking experience better.' },
  { icon: '💚', title: 'Sustainability', desc: 'We partner with airlines committed to reducing their environmental footprint.' },
];

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white/80 text-sm mb-6 border border-white/20">
            ✈ About Travel Sparsh
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Connecting India,{' '}
            <span className="text-accent-400">One Flight at a Time</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            We're on a mission to provide personalized travel expertise and the best flight deals for every Indian traveller through dedicated consultancy.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-4">Our Story</span>
              <h2 className="section-title mb-6">Born from a Traveller's Frustration</h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Travel Sparsh was born in 2020 when our founder Arjun missed a critical business meeting because flight booking platforms were confusing, expensive, and unreliable. He knew there had to be a better way.
                </p>
                <p>
                  We partnered with <strong className="text-primary-600 dark:text-primary-400">Adivaha</strong>, India's most trusted white-label booking engine, to build a platform that puts the traveller first. Adivaha's powerful GDS connections give our users access to the best fares across all major airlines.
                </p>
                <p>
                  Today, Travel Sparsh serves over 2 million travellers across India, providing them with expert guidance and the best market rates on every flight. We're not just a platform — we're your dedicated travel companion.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/register" className="btn-primary">Join Us Today</Link>
                <Link to="/contact" className="btn-outline">Get in Touch</Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Founded', value: '2020', icon: '📅' },
                  { label: 'Team Members', value: '50+', icon: '👥' },
                  { label: 'Cities Served', value: '100+', icon: '🌆' },
                  { label: 'Airline Partners', value: '100+', icon: '✈' },
                ].map((item) => (
                  <div key={item.label} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-2xl font-black text-primary-600 dark:text-primary-400">{item.value}</div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8 border-l-4 border-primary-600">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To democratize air travel in India by providing every traveller with access to the best flight deals, powered by cutting-edge technology and unmatched customer service. We believe everyone deserves to fly without financial stress.
              </p>
            </div>
            <div className="card p-8 border-l-4 border-accent-500">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To become India's most trusted travel consultancy, where 10 million travellers find their perfect journeys with expert confidence. We envision a world where planning a flight is as personal as a conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Core <span className="gradient-text">Values</span></h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-card transition-all duration-300 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{val.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{val.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Our Impact in Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { target: 2000000, suffix: '+', label: 'Enquiries Handled' },
              { target: 12000, suffix: '+', label: 'Expert Consultations' },
              { target: 100, suffix: '+', label: 'Airline Partners' },
              { target: 500, suffix: '+', label: 'Global Destinations' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <p className="text-primary-200 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Meet Our <span className="gradient-text">Team</span></h2>
            <p className="section-subtitle">The passionate people behind Travel Sparsh</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, idx) => (
              <div key={idx} className="card p-6 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className={`w-20 h-20 ${member.bg} rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-2 mt-4">
                  {['in', 'tw'].map((social) => (
                    <a key={social} href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {social.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adivaha Partnership */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
            Our experts use the Adivaha toolkit — India's premier travel technology infrastructure — to access real-time Global Distribution System (GDS) data. This allows us to find and secure the most competitive fares across global markets, providing you with elite travel planning. 
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🌐', title: 'Global GDS Access', desc: 'Direct connection to Amadeus, Sabre, and Galileo for best fares' },
              { icon: '⚡', title: 'Real-time Inventory', desc: 'Live seat availability and instant booking confirmation' },
              { icon: '🔐', title: 'Secure Payments', desc: 'PCI-DSS compliant payment processing with fraud protection' },
            ].map((item, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Start Your Journey Today</h2>
          <p className="section-subtitle mb-8">Join millions of travellers who trust Travel Sparsh for expert travel planning.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">Create Free Account</Link>
            <Link to="/contact" className="btn-outline">Enquire Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
