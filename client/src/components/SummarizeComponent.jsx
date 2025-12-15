import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useFile } from '../context/FileContext';
import { useCache } from '../context/CacheContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SummarizeComponent = () => {
    const { currentFile } = useFile();
    const { cache, updateCache } = useCache();
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Load from cache when component mounts
    useEffect(() => {
        if (cache.summary) {
            setSummary(cache.summary);
        }
    }, [cache.summary]);

    const generateSummary = async () => {
        if (!currentFile) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: currentFile.filename }),
            });
            const data = await response.json();
            const result = data.response || '';
            setSummary(result);
            updateCache('summary', result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!summary) return;

        // Dynamic import to avoid SSR issues if any, though this is likely CSR
        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.createElement('div');
        element.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="text-align: center; color: #333;">Summary: ${currentFile.filename}</h1>
                <div class="markdown-body">
                    ${document.querySelector('.prose').innerHTML}
                </div>
            </div>
        `;

        const opt = {
            margin: 1,
            filename: `${currentFile.filename}_summary.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (!currentFile) {
        return (
            <div className="text-center text-gray-500 mt-20">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please upload a file first.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-blue-600" />
                    Summarizer
                </h2>
                <div className="flex gap-3">
                    {summary && (
                        <button
                            onClick={downloadPDF}
                            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Download PDF
                        </button>
                    )}
                    <button
                        onClick={generateSummary}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <img src="/assets/thinking_logo.png" alt="Processing" className="w-5 h-5 object-contain animate-pulse" />
                                <span>Summarizing</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </>
                        ) : (
                            'Generate Summary'
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-8 border-2 border-gray-200 overflow-y-auto shadow-sm">
                {summary ? (
                    <div className="prose prose-gray max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {summary}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic">
                        Summary will appear here...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummarizeComponent;
