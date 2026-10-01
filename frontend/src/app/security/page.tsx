import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import { Shield, Lock, EyeOff, Server, Key, FileCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security | SnapLinks',
  description: 'Learn how SnapLinks protects your data with enterprise-grade security, encryption, and privacy controls.',
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">Enterprise-Grade Security</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              At SnapLinks, the privacy and security of your data is our highest priority. We use industry-standard encryption to ensure your files and links remain exclusively yours.
            </p>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">End-to-End Encryption</h3>
              <p className="text-gray-600 leading-relaxed">
                All data transmitted to and from SnapLinks is encrypted in transit using TLS 1.3. Your files and sensitive data are encrypted at rest using AES-256 block-level encryption.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <EyeOff className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zero-Knowledge Architecture</h3>
              <p className="text-gray-600 leading-relaxed">
                For SnapBridge Secure File Sharing, we employ strict zero-knowledge protocols. Your decryption keys never touch our servers, meaning even we cannot view your files.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Server className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Infrastructure</h3>
              <p className="text-gray-600 leading-relaxed">
                SnapLinks is hosted on enterprise cloud infrastructure with strict physical and network security. Our databases are isolated in private VPCs with no direct public access.
              </p>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto">
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                  <Key className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Authentication & Access</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  We leverage robust OAuth 2.0 protocols and strict JWT-based authentication. Passwords are salted and hashed using modern bcrypt algorithms.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Google Single Sign-On (SSO) Support</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Strict Session Expirations</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Brute-Force Protection via Rate Limiting</li>
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
  "sub": "user_12345",
  "exp": 1735689600,
  "iat": 1704067200,
  "role": "verified_user"
}
.
[SIGNATURE]`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                  <FileCheck className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Compliance & Data Privacy</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  We process data transparently. We do not sell your personal data. We comply with modern privacy frameworks to ensure your digital rights are respected.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Regular automated security audits</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Data minimization principles</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Right to erasure (Delete your account instantly)</li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">🛡️</div>
                    <div className="flex-1"><div className="h-2 w-24 bg-gray-300 rounded-full mb-2"></div><div className="h-2 w-32 bg-gray-200 rounded-full"></div></div>
                    <div className="text-green-500 font-bold text-sm">Compliant</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">🔒</div>
                    <div className="flex-1"><div className="h-2 w-16 bg-gray-300 rounded-full mb-2"></div><div className="h-2 w-28 bg-gray-200 rounded-full"></div></div>
                    <div className="text-green-500 font-bold text-sm">Encrypted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Have a security concern?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            If you believe you have found a security vulnerability in SnapLinks, please report it to us immediately. We take all reports seriously.
          </p>
          <a href="mailto:security@snaplinks.in" className="inline-flex items-center gap-2 bg-[#1a73e8] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            Contact Security Team
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
