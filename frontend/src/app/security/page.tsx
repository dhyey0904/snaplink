import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import { Shield, Lock, Server, Key, FileCheck, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security | SnapLinks',
  description: 'Learn how SnapLinks handles your data with standard web security and privacy practices.',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] font-sans">
      <Navbar />

      <main className="flex-1 w-full relative z-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white pt-24 pb-32 px-6 sm:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/20">
              <Shield className="w-10 h-10 text-blue-300" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">Security & Privacy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed sm:text-center">
              At SnapLinks, we prioritize the protection of your digital workspace. We employ standard web security practices to keep your URLs, files, and accounts safe while being transparent about our capabilities as an independent platform.
            </p>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="max-w-5xl mx-auto -mt-10 relative z-30 px-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl shadow-md flex gap-4">
            <Info className="w-6 h-6 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">
              <strong>Transparency Notice:</strong> SnapLinks is an independent, unregistered startup project. We do not claim to offer military-grade or enterprise-level compliance frameworks (such as HIPAA or SOC2). We provide standard, reliable web security and rely on trusted third-party cloud providers (Render, Neon) to host our infrastructure securely.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Encryption in Transit</h3>
              <p className="text-gray-600 leading-relaxed">
                All data transmitted between your browser and our servers is secured using standard HTTPS/TLS encryption. This prevents intermediaries from intercepting your data or file uploads while they are traveling across the internet.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Server className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud Infrastructure</h3>
              <p className="text-gray-600 leading-relaxed">
                Our application backend and PostgreSQL database are hosted on reputable modern cloud providers. We rely on their built-in data center security and physical hardware protections to keep your stored data safe.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Key className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
              <p className="text-gray-600 leading-relaxed">
                We use secure, industry-standard JSON Web Tokens (JWT) for session management. All user passwords are computationally hashed and salted using robust algorithms before being stored in our database.
              </p>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-12 px-6 sm:px-12 max-w-5xl mx-auto">
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                  <Key className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Account Protection</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  To protect your account from unauthorized access, we provide multiple layers of standard web security and authentication integrations.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> <strong>Google OAuth:</strong> Sign in securely without needing a password.</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> <strong>Hashed Passwords:</strong> We never store plain-text passwords.</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> <strong>Session Limits:</strong> Expiring JWT tokens prevent indefinite access.</li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 bg-gray-900 rounded-3xl p-8 shadow-lg">
                <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                  <code>
{`{
  "alg": "HS256",
  "typ": "JWT"
}
.
{
  "sub": "user_id",
  "exp": 1735689600,
  "iat": 1704067200
}
.
[SECURE_SIGNATURE]`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                  <FileCheck className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Data Privacy</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  We collect only the information necessary to provide our services. As an independent platform, we are committed to being transparent about how your data is handled.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div> <strong>No Data Selling:</strong> We do not sell your personal information.</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div> <strong>Transparency:</strong> Real, honest statements about our capabilities.</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div> <strong>Right to Delete:</strong> You can request full account deletion at any time.</li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">🛡️</div>
                    <div className="flex-1"><div className="h-2 w-24 bg-gray-300 rounded-full mb-2"></div><div className="h-2 w-32 bg-gray-200 rounded-full"></div></div>
                    <div className="text-green-500 font-bold text-sm">Honest Security</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">🔒</div>
                    <div className="flex-1"><div className="h-2 w-16 bg-gray-300 rounded-full mb-2"></div><div className="h-2 w-28 bg-gray-200 rounded-full"></div></div>
                    <div className="text-green-500 font-bold text-sm">HTTPS Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Have a security concern?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto sm:text-center">
            If you have any questions about our data practices or believe you have found a vulnerability, please reach out. We value feedback that helps keep our users safe.
          </p>
          <a href="mailto:hello.snaplinks@gmail.com" className="inline-flex items-center gap-2 bg-[#1a73e8] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            Contact: hello.snaplinks@gmail.com
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
