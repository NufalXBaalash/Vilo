import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useFile } from '../context/FileContext';
import { useCache } from '../context/CacheContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const ChatInterface = () => {
    const { currentFile } = useFile();
    const { cache, updateCache } = useCache();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load messages from cache when component mounts
    useEffect(() => {
        if (cache.chatMessages && cache.chatMessages.length > 0) {
            setMessages(cache.chatMessages);
        } else {
            // If no messages in cache, show initial welcome message
            setMessages([
                { role: 'assistant', content: 'Hello! Upload a document to start chatting.' }
            ]);
        }
    }, []); // Only run on mount

    // Save messages to cache whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            updateCache('chatMessages', messages);
        }
    }, [messages]);

    // Reset messages when file changes
    useEffect(() => {
        if (currentFile) {
            const welcomeMessage = {
                role: 'assistant',
                content: `File "${currentFile.filename}" uploaded successfully! Ask me anything about it.`
            };
            setMessages([welcomeMessage]);
            updateCache('chatMessages', [welcomeMessage]);
        }
    }, [currentFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sendMessage = async () => {
            if (!input.trim() || !currentFile) return;

            const userMessage = { role: 'user', content: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: currentFile.filename,
                        message: input, // Send only current message
                    }),
                });

                const data = await response.json();
                const assistantMessage = {
                    role: 'assistant',
                    content: data.response || 'No response received.',
                    sources: data.sources || []
                };

                setMessages(prev => [...prev, assistantMessage]);
            } catch (error) {
                console.error('Error:', error);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, there was an error processing your request.'
                }]);
            } finally {
                setIsLoading(false);
            }
        };
        sendMessage();
    };

    if (!currentFile) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
                <img src="/assets/welcome_logo.png" alt="Welcome" className="w-32 h-32 object-contain mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Document Selected</h3>
                <p className="max-w-md text-gray-500">Please upload a PDF or DOCX file using the upload button in the top right corner to start chatting.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={cn(
                            "flex gap-4",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden",
                            msg.role === 'user'
                                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                                : "bg-white border-2 border-purple-200"
                        )}>
                            {msg.role === 'user' ? (
                                <User size={18} />
                            ) : (
                                <img src="/assets/ai_logo.png" alt="AI" className="w-8 h-8 object-contain" />
                            )}
                        </div>

                        <div className={cn(
                            "max-w-[80%] rounded-2xl p-4 shadow-sm",
                            msg.role === 'user'
                                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                                : "bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900 border-2 border-purple-200"
                        )}>
                            <div className={cn(
                                "prose prose-sm max-w-none",
                                msg.role === 'user' ? "prose-invert" : "prose-purple"
                            )}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>

                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-purple-300/30">
                                    <p className="text-xs font-semibold text-purple-700 mb-2">Sources:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((source, i) => (
                                            <div key={i} className="text-xs bg-white/70 px-2 py-1 rounded border border-purple-300/50 text-purple-700" title={source.text}>
                                                Page {source.page}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src="/assets/thinking_logo.png" alt="Thinking" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                            <img src="/assets/thinking_logo.png" alt="Thinking" className="w-6 h-6 object-contain animate-pulse" />
                            <span className="text-sm text-purple-700 font-medium">Thinking</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your document..."
                        className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-gray-200 transition-all shadow-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
