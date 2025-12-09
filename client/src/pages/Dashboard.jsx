import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Brain, Search, CreditCard, LogOut, Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useCache } from '../context/CacheContext';
import ChatInterface from '../components/ChatInterface';
import QAComponent from '../components/QAComponent';
import SummarizeComponent from '../components/SummarizeComponent';
import KeywordComponent from '../components/KeywordComponent';
import FlashcardComponent from '../components/FlashcardComponent';
import FileUpload from '../components/FileUpload';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { clearCache } = useCache();

    const handleLogout = () => {
        clearCache();
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: <MessageSquare size={20} />, label: 'Chat', color: 'text-purple-600' },
        { path: '/dashboard/qa', icon: <Brain size={20} />, label: 'Q&A Generator', color: 'text-blue-600' },
        { path: '/dashboard/flashcards', icon: <CreditCard size={20} />, label: 'Flashcards', color: 'text-indigo-600' },
        { path: '/dashboard/summarize', icon: <FileText size={20} />, label: 'Summarizer', color: 'text-cyan-600' },
        { path: '/dashboard/keyword', icon: <Search size={20} />, label: 'Keywords', color: 'text-blue-500' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-white border-r border-gray-200 flex flex-col shadow-sm z-20"
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-200">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3">
                            <img src="/assets/standing-logo.png" alt="Vilo" className="h-10 w-auto" />
                            <span className="font-bold text-gray-900 text-xl">Vilo</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                location.pathname === item.path
                                    ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 shadow-sm border border-purple-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <span className={location.pathname === item.path ? item.color : ''}>{item.icon}</span>
                            {isSidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    {isSidebarOpen ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-gray-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.username || 'admin'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors font-medium text-sm"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
                {/* Header */}
                <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <FileUpload />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <Routes>
                        <Route path="/" element={<ChatInterface />} />
                        <Route path="/qa" element={<QAComponent />} />
                        <Route path="/flashcards" element={<FlashcardComponent />} />
                        <Route path="/summarize" element={<SummarizeComponent />} />
                        <Route path="/keyword" element={<KeywordComponent />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
