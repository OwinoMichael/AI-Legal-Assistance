import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Shield, AlertTriangle, MessageCircle, Upload, CheckCircle, Star, Users, Clock, Mail, Twitter, Github, Linkedin } from 'lucide-react';

export default function LegalMindLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    
    // Simulate upload progress for demo
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev + 1) % 101);
    }, 50);

    // Intersection Observer for How It Works section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'how-it-works' && entry.isIntersecting) {
            setHowItWorksVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      observer.observe(howItWorksSection);
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: FileText, text: "Plain English Summaries", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: AlertTriangle, text: "Risk Detection", color: "text-red-500", bg: "bg-red-50" },
    { icon: Shield, text: "Hidden Clause Alerts", color: "text-green-600", bg: "bg-green-50" },
    { icon: MessageCircle, text: "Ask Questions", color: "text-purple-600", bg: "bg-purple-50" }
  ];

  const painPoints = [
    "Spending hours trying to decode legal jargon?",
    "Worried about missing important clauses?",
    "Paying lawyers for simple document reviews?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden p-0 m-0">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className={`flex items-center gap-3 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">LegalMind</span>
          </div>
          <div className={`flex gap-4 transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Pricing
            </button>
            <Link to="/login">
              <button className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all transform hover:scale-105">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Pain point callout */}
            <div className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-sm font-medium">
                <AlertTriangle size={16} />
                Stop struggling with legal documents
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              <span className={`inline-block transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Understand
              </span>
              <br />
              <span className={`inline-block transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                Legal Documents
              </span>
              <br />
              <span className={`inline-block transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                in Plain English
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl text-slate-600 mb-8 leading-relaxed transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Upload any contract, agreement, or legal document. Get instant summaries, risk warnings, hidden clause alerts, and expert recommendations—no law degree required.
            </p>

            {/* Rotating features */}
            <div className={`mb-10 transition-all duration-1000 delay-1300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 border ${
                        currentFeature === index
                          ? `${feature.bg} border-current ${feature.color} scale-105 shadow-lg`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-1000 delay-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 text-lg font-medium">
                Try Free Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg font-medium">
                <Upload size={20} />
                See Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className={`text-sm text-slate-500 transition-all duration-1000 delay-1700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>No legal background needed</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Secure & confidential</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Demo Visualization */}
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main demo card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Employment Contract</h3>
                    <p className="text-sm text-slate-500">Analyzing document...</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Analysis Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Results preview */}
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <span className="text-sm font-medium text-red-800">Risk Detected</span>
                    </div>
                    <p className="text-xs text-red-700">Non-compete clause extends 24 months post-employment</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-blue-800">Key Summary</span>
                    </div>
                    <p className="text-xs text-blue-700">Standard employment terms with competitive benefits package</p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-green-500" />
                      <span className="text-sm font-medium text-green-800">Recommendation</span>
                    </div>
                    <p className="text-xs text-green-700">Consider negotiating the non-compete duration</p>
                  </div>
                </div>
              </div>

              {/* Floating question bubble */}
              <div className="absolute -right-4 top-4 w-48 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-2xl rounded-tr-sm shadow-xl transform rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={16} />
                  <span className="text-sm font-medium">Ask anything</span>
                </div>
                <p className="text-xs opacity-90">"What happens if I want to work for a competitor?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get instant legal document insights in three simple steps. No legal expertise required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 - Upload */}
            <div className={`text-center group transition-all duration-1000 delay-300 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                {/* Connection line */}
                <div className="hidden md:block absolute top-8 left-[calc(100%+1rem)] w-16 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                </div>
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 font-bold text-sm shadow-lg">
                  1
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Upload Document</h3>
                <p className="text-slate-600">
                  Simply drag and drop your PDF contract or legal document. We support all major document formats.
                </p>
                {/* Upload animation */}
                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center group-hover:border-blue-500 transition-colors">
                    <div className="w-3 h-3 bg-blue-400 rounded-full group-hover:animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Analysis */}
            <div className={`text-center group transition-all duration-1000 delay-500 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <FileText className="w-8 h-8 text-white animate-pulse" />
                </div>
                {/* Connection line */}
                <div className="hidden md:block absolute top-8 left-[calc(100%+1rem)] w-16 h-0.5 bg-gradient-to-r from-purple-300 to-green-300">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping delay-500"></div>
                </div>
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-purple-500 flex items-center justify-center text-purple-600 font-bold text-sm shadow-lg">
                  2
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">AI Analysis</h3>
                <p className="text-slate-600">
                  Our advanced AI powered by LegalBERT analyzes every clause, identifies risks, and extracts key information.
                </p>
                {/* Processing animation */}
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-8 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-6 bg-purple-300 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-10 bg-purple-500 rounded-full animate-pulse delay-300"></div>
                    <div className="w-2 h-4 bg-purple-300 rounded-full animate-pulse delay-450"></div>
                    <div className="w-2 h-7 bg-purple-400 rounded-full animate-pulse delay-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Results */}
            <div className={`text-center group transition-all duration-1000 delay-700 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-green-500 flex items-center justify-center text-green-600 font-bold text-sm shadow-lg">
                  3
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Get Insights</h3>
                <p className="text-slate-600">
                  Receive plain English summaries, risk warnings, recommendations, and ask questions about your document.
                </p>
                {/* Results animation */}
                <div className="mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-full group-hover:animate-pulse`} style={{ animationDelay: `${i * 200}ms`, width: `${70 + i * 10}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements for extra visual appeal */}
          <div className={`absolute top-32 right-20 transition-all duration-1000 delay-1000 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl rotate-12 hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className={`absolute bottom-32 left-20 transition-all duration-1000 delay-1200 ${howItWorksVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl -rotate-12 hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Start free and explore all features. No hidden fees, no complex tiers.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Limited Time - Free Access
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Free Beta Access</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-slate-800">$0</span>
                  <span className="text-slate-600 ml-2">during beta</span>
                </div>
                <p className="text-slate-600">
                  Full access to all features while we're in beta. Help us improve and get lifetime benefits.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Unlimited document uploads</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">AI-powered legal analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Risk detection & warnings</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Plain English summaries</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Ask questions about documents</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Secure & confidential processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Case organization & management</span>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 hover:shadow-lg">
                Start Free Beta Access
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-slate-500">
                  No credit card required • Join 1,000+ beta users
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 bg-slate-50 rounded-full px-6 py-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-slate-600">Beta users get lifetime discounts</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-slate-600">Join our feedback community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">LegalMind</span>
              </div>
              <p className="text-slate-400 mb-6">
                Making legal documents accessible to everyone. No law degree required.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © 2025 LegalMind. All rights reserved. Built with ❤️ for everyone who struggles with legal docs.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="text-slate-500 text-sm">Powered by AI • Secured by encryption</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}