import React, { useState, useEffect } from 'react';
import { Brain, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useFile } from '../context/FileContext';
import { useCache } from '../context/CacheContext';
import { motion, AnimatePresence } from 'framer-motion';

const QAComponent = () => {
    const { currentFile } = useFile();
    const { cache, updateCache } = useCache();
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    // Load from cache when component mounts
    useEffect(() => {
        if (cache.questions) {
            setQuestions(cache.questions);
        }
    }, [cache.questions]);

    const generateQuestions = async () => {
        if (!currentFile) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: currentFile.filename }),
            });
            const data = await response.json();
            const result = data.result || [];
            setQuestions(result);
            updateCache('questions', result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentFile) {
        return (
            <div className="text-center text-gray-500 mt-20">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please upload a file first.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Brain className="text-purple-600" />
                    Q&A Generator
                </h2>
                <button
                    onClick={generateQuestions}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <img src="/assets/thinking_logo.png" alt="Processing" className="w-5 h-5 object-contain animate-pulse" />
                            <span>Generating</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </>
                    ) : (
                        'Generate Questions'
                    )}
                </button>
            </div>

            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                        className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-gray-900 pr-8">{q.question}</span>
                            {expandedId === idx ? <ChevronUp size={20} className="text-gray-400 shrink-0" /> : <ChevronDown size={20} className="text-gray-400 shrink-0" />}
                        </button>
                        <AnimatePresence>
                            {expandedId === idx && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4 text-gray-700 border-t border-gray-200 pt-4 bg-gray-50">
                                        <p className="mb-2"><span className="text-purple-600 font-semibold">Answer:</span> {q.answer}</p>
                                        <div className="flex gap-4 text-xs text-gray-500 mt-3">
                                            <span className="bg-white px-2 py-1 rounded border border-gray-200">Type: {q.type}</span>
                                            <span className="bg-white px-2 py-1 rounded border border-gray-200">Location: {q.location}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default QAComponent;
