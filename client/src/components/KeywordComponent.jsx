import React, { useState, useEffect } from 'react';
import { Search, Loader2, Tag, Sparkles, BookOpen } from 'lucide-react';
import { useFile } from '../context/FileContext';
import { useCache } from '../context/CacheContext';

const KeywordComponent = () => {
    const { currentFile } = useFile();
    const { cache, updateCache } = useCache();
    const [keywords, setKeywords] = useState('');
    const [parsedCategories, setParsedCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load from cache when component mounts
    useEffect(() => {
        if (cache.keywords) {
            setKeywords(cache.keywords);
            parseKeywords(cache.keywords);
        }
    }, [cache.keywords]);

    const parseKeywords = (text) => {
        const categories = [];
        const lines = text.split('\n');
        let currentCategory = null;
        let currentItems = [];

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Check for main category headers (## Header)
            if (trimmedLine.startsWith('## ')) {
                // Save previous category
                if (currentCategory && currentItems.length > 0) {
                    categories.push({
                        name: currentCategory,
                        items: currentItems.filter(item => item.trim())
                    });
                }
                // Start new category
                currentCategory = trimmedLine.replace(/^##\s*/, '').trim();
                currentItems = [];
            }
            // Check for subheadings (### Item) - treat as keyword items
            else if (trimmedLine.startsWith('### ')) {
                const item = trimmedLine.replace(/^###\s*/, '').trim();
                if (item && item.length > 1) {
                    currentItems.push(item);
                }
            }
            // Check for list items (- item, * item, or numbered 1. item)
            else if (trimmedLine.match(/^[-*]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
                const item = trimmedLine
                    .replace(/^[-*]\s+/, '')
                    .replace(/^\d+\.\s+/, '')
                    .trim();
                if (item && item.length > 1) {
                    currentItems.push(item);
                }
            }
            // Also capture non-empty lines that aren't headers (for cases without list markers)
            else if (trimmedLine && !trimmedLine.startsWith('#') && currentCategory) {
                // Skip very short lines or lines that look like markdown formatting
                if (trimmedLine.length > 2 && !trimmedLine.match(/^[*_-]+$/)) {
                    currentItems.push(trimmedLine);
                }
            }
        });

        // Add last category
        if (currentCategory && currentItems.length > 0) {
            categories.push({
                name: currentCategory,
                items: currentItems.filter(item => item.trim())
            });
        }

        console.log('Parsed categories:', categories); // Debug log
        setParsedCategories(categories);
    };

    const generateKeywords = async () => {
        if (!currentFile) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/keyword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: currentFile.filename }),
            });
            const data = await response.json();
            const result = data.response || '';
            setKeywords(result);
            updateCache('keywords', result);
            parseKeywords(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('main') || name.includes('topic')) {
            return <BookOpen className="w-5 h-5" />;
        } else if (name.includes('technical') || name.includes('term')) {
            return <Sparkles className="w-5 h-5" />;
        }
        return <Tag className="w-5 h-5" />;
    };

    const getCategoryColor = (index) => {
        const colors = [
            { bg: 'from-purple-500 to-indigo-500', text: 'text-purple-700', border: 'border-purple-200', lightBg: 'bg-purple-50' },
            { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700', border: 'border-blue-200', lightBg: 'bg-blue-50' },
            { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-700', border: 'border-indigo-200', lightBg: 'bg-indigo-50' },
        ];
        return colors[index % colors.length];
    };

    if (!currentFile) {
        return (
            <div className="text-center text-gray-500 mt-20">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please upload a file first.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Search className="text-indigo-600" />
                    Keyword Extractor
                </h2>
                <button
                    onClick={generateKeywords}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <img src="/assets/thinking_logo.png" alt="Processing" className="w-5 h-5 object-contain animate-pulse" />
                            <span>Extracting</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </>
                    ) : (
                        'Extract Keywords'
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {parsedCategories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {parsedCategories.map((category, idx) => {
                            const colors = getCategoryColor(idx);
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    {/* Category Header */}
                                    <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(category.name)}
                                            <h3 className="font-bold text-lg">{category.name}</h3>
                                        </div>
                                    </div>

                                    {/* Keywords List */}
                                    <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                                        {category.items.map((item, itemIdx) => (
                                            <div
                                                key={itemIdx}
                                                className={`${colors.lightBg} ${colors.border} border px-3 py-2 rounded-lg ${colors.text} text-sm font-medium hover:scale-105 transition-transform cursor-default`}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : keywords ? (
                    // Fallback: show raw text if parsing failed
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm">
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            <strong>Note:</strong> Showing raw output. The AI response might not be in the expected format.
                        </div>
                        <div className="prose prose-indigo max-w-none whitespace-pre-wrap">
                            {keywords}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
                        <div className="text-center text-gray-400">
                            <Search className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg italic">Extract keywords to see categorized results</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeywordComponent;
