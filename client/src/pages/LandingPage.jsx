import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, FileText, MessageSquare, Search, Sparkles, Shield, Zap,
    CreditCard, BookOpen, Brain, CheckCircle, Clock, Target, Users,
    ChevronDown, ChevronUp, Mail
} from 'lucide-react';

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-white text-gray-900 overflow-hidden font-sans">
            {/* Sticky Header */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/assets/standing-logo.png" alt="Vilo" className="h-10 w-auto" />
                        <span className="text-2xl font-bold text-gray-900">Vilo</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-purple-600 transition font-medium">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition font-medium">How It Works</a>
                        <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition font-medium">Pricing</a>
                    </div>
                    <Link
                        to="/login"
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all font-medium"
                    >
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-200/20 rounded-full blur-[150px] -z-10" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                                <Sparkles className="w-4 h-4" />
                                AI-Powered Study Platform
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Your AI-Powered
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                                    Study Companion
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Learn smarter, not harder – get personalized insights, summaries,
                                and practice tools instantly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/login"
                                    className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                                >
                                    Get Started for Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-lg transition-all border-2 border-gray-200 hover:border-purple-300 shadow-lg flex items-center justify-center gap-2"
                                >
                                    See It in Action
                                </a>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <img
                                src="/assets/welcome_logo.png"
                                alt="Vilo AI Assistant"
                                className="w-full max-w-md mx-auto drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Powerful AI Study Tools</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to study smarter and retain more knowledge
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MessageSquare className="w-8 h-8 text-purple-600" />}
                            title="RAG Chat"
                            description="Instantly get accurate answers from your course materials, notes, or PDFs."
                            gradient="from-purple-500 to-indigo-500"
                        />
                        <FeatureCard
                            icon={<Brain className="w-8 h-8 text-blue-600" />}
                            title="Q&A Generation"
                            description="Automatically generate practice questions to test your knowledge."
                            gradient="from-blue-500 to-cyan-500"
                        />
                        <FeatureCard
                            icon={<CreditCard className="w-8 h-8 text-indigo-600" />}
                            title="Flashcard Generator"
                            description="Turn your notes into interactive flashcards for efficient memorization."
                            gradient="from-indigo-500 to-purple-500"
                        />
                        <FeatureCard
                            icon={<FileText className="w-8 h-8 text-cyan-600" />}
                            title="Smart Summarization"
                            description="Condense long chapters into clear, bite-sized summaries."
                            gradient="from-cyan-500 to-blue-500"
                        />
                        <FeatureCard
                            icon={<Search className="w-8 h-8 text-purple-600" />}
                            title="Keyword Extraction"
                            description="Identify key concepts and terms for faster review and study."
                            gradient="from-purple-500 to-pink-500"
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-8 h-8 text-blue-600" />}
                            title="Document Analysis"
                            description="Upload PDFs, DOCX, and notes for instant AI processing."
                            gradient="from-blue-500 to-indigo-500"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        <StepCard
                            number="1"
                            title="Upload Materials"
                            description="Upload notes, PDFs, or textbooks to the platform."
                            icon={<FileText className="w-12 h-12 text-purple-600" />}
                        />
                        <StepCard
                            number="2"
                            title="AI Processes"
                            description="Our AI reads, extracts, and summarizes the content."
                            icon={<Brain className="w-12 h-12 text-purple-600" />}
                        />
                        <StepCard
                            number="3"
                            title="Interact with Tools"
                            description="Generate flashcards, Q&A, and summaries instantly."
                            icon={<Sparkles className="w-12 h-12 text-blue-600" />}
                        />
                        <StepCard
                            number="4"
                            title="Learn Efficiently"
                            description="Study smarter with personalized AI guidance."
                            logo="/assets/done_logo.png"
                        />
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Choose Vilo?</h2>
                        <p className="text-xl text-gray-600">More than just study tools</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <BenefitCard
                            icon={<Clock className="w-8 h-8 text-purple-600" />}
                            title="Save Time"
                            description="Focus on learning, not manual note-taking."
                        />
                        <BenefitCard
                            icon={<Target className="w-8 h-8 text-blue-600" />}
                            title="Stay Organized"
                            description="All your study materials in one place, intelligently summarized."
                        />
                        <BenefitCard
                            icon={<Brain className="w-8 h-8 text-indigo-600" />}
                            title="Boost Retention"
                            description="Flashcards and Q&A help reinforce knowledge."
                        />
                        <BenefitCard
                            icon={<Sparkles className="w-8 h-8 text-cyan-600" />}
                            title="AI-Powered"
                            description="Smart suggestions and adaptive tools to match your learning style."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Loved by Students</h2>
                        <p className="text-xl text-gray-600">See what learners are saying</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="This AI assistant made studying so much faster! I can generate practice questions in seconds."
                            author="Sarah M."
                            role="University Student"
                        />
                        <TestimonialCard
                            quote="Finally, a tool that organizes all my notes for exams. The summaries are incredibly accurate."
                            author="James K."
                            role="College Learner"
                        />
                        <TestimonialCard
                            quote="The flashcard feature is a game-changer. I've improved my retention significantly!"
                            author="Emily R."
                            role="Graduate Student"
                        />
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <PricingCard
                            name="Free"
                            price="$0"
                            period="forever"
                            features={[
                                "10 AI interactions/month",
                                "All basic tools",
                                "PDF & DOCX support",
                                "Community support"
                            ]}
                            cta="Start Free"
                            highlighted={false}
                        />
                        <PricingCard
                            name="Pro"
                            price="$9"
                            period="per month"
                            features={[
                                "Unlimited AI interactions",
                                "All advanced tools",
                                "Priority processing",
                                "Email support",
                                "Export features"
                            ]}
                            cta="Upgrade to Pro"
                            highlighted={true}
                        />
                        <PricingCard
                            name="Premium"
                            price="$19"
                            period="per month"
                            features={[
                                "Everything in Pro",
                                "Custom AI training",
                                "Team collaboration",
                                "Priority support",
                                "Advanced analytics"
                            ]}
                            cta="Go Premium"
                            highlighted={false}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        <FAQItem
                            question="Can I upload PDFs and notes?"
                            answer="Yes! Vilo supports PDF and DOCX files. Simply upload your documents and our AI will process them instantly."
                            isOpen={openFaq === 0}
                            onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                        />
                        <FAQItem
                            question="How accurate are the AI-generated flashcards?"
                            answer="Our AI uses advanced language models to extract key concepts with high accuracy. The flashcards are designed to capture the most important information from your materials."
                            isOpen={openFaq === 1}
                            onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                        />
                        <FAQItem
                            question="Is my data secure?"
                            answer="Absolutely. We use industry-standard encryption and never store your documents permanently. Your privacy and security are our top priorities."
                            isOpen={openFaq === 2}
                            onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                        />
                        <FAQItem
                            question="Can I try it before paying?"
                            answer="Yes! Our free plan gives you 10 AI interactions per month with access to all basic tools. No credit card required."
                            isOpen={openFaq === 3}
                            onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <img src="/assets/welcome_logo.png" alt="Start Learning" className="w-32 h-32 mx-auto mb-8" />
                    <h2 className="text-4xl font-bold mb-6">Ready to Study Smarter?</h2>
                    <p className="text-xl mb-8 opacity-90">Join thousands of students already learning with Vilo</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl"
                    >
                        Start Studying Smarter
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/assets/standing-logo.png" alt="Vilo" className="h-10 w-auto" />
                                <span className="text-xl font-bold text-white">Vilo</span>
                            </div>
                            <p className="text-sm text-gray-400">Your friendly AI study companion</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
                            <p className="text-sm mb-4">Get updates on new AI study tools</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
                                />
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>© 2025 Vilo. All rights reserved. Built with ❤️ for students everywhere.</p>
                    </div>
                </div>
            </footer>

            {/* Floating CTA */}
            <Link
                to="/login"
                className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-2xl hover:scale-105 transition-all flex items-center gap-2 z-50"
            >
                Start Free
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
};

// Component definitions
const FeatureCard = ({ icon, title, description, gradient }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="group p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all"
    >
        <div className={`mb-6 p-4 bg-gradient-to-br ${gradient} bg-opacity-10 rounded-xl w-fit group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

const StepCard = ({ number, title, description, icon, logo }) => (
    <div className="text-center">
        <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-purple-100">
                {logo ? (
                    <img src={logo} alt={title} className="w-12 h-12 object-contain" />
                ) : (
                    icon
                )}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {number}
            </div>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const BenefitCard = ({ icon, title, description }) => (
    <div className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all">
        <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl w-fit mx-auto">
            {icon}
        </div>
        <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

const TestimonialCard = ({ quote, author, role }) => (
    <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="mb-4 text-purple-600">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
        </div>
        <p className="text-gray-700 mb-6 italic">"{quote}"</p>
        <div>
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </div>
);

const PricingCard = ({ name, price, period, features, cta, highlighted }) => (
    <div className={`p-8 rounded-2xl border-2 ${highlighted ? 'border-purple-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'} bg-white relative`}>
        {highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                Most Popular
            </div>
        )}
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
        <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-gray-500">/{period}</span>
        </div>
        <ul className="space-y-3 mb-8">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                </li>
            ))}
        </ul>
        <Link
            to="/login"
            className={`block text-center px-6 py-3 rounded-xl font-semibold transition-all ${highlighted
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
        >
            {cta}
        </Link>
    </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
            onClick={onClick}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
        >
            <span className="font-semibold text-gray-900">{question}</span>
            {isOpen ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {isOpen && (
            <div className="px-6 pb-4 text-gray-600">
                {answer}
            </div>
        )}
    </div>
);

export default LandingPage;
