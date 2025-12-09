import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronLeft, ChevronRight, RotateCw, Loader2 } from 'lucide-react';
import { useFile } from '../context/FileContext';
import { useCache } from '../context/CacheContext';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardComponent = () => {
    const { currentFile } = useFile();
    const { cache, updateCache } = useCache();
    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Load from cache when component mounts
    useEffect(() => {
        if (cache.flashcards) {
            setFlashcards(cache.flashcards);
        }
    }, [cache.flashcards]);

    const generateFlashcards = async () => {
        if (!currentFile) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: currentFile.filename }),
            });
            const data = await response.json();
            const result = data.result || [];
            setFlashcards(result);
            updateCache('flashcards', result);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    if (!currentFile) {
        return (
            <div className="text-center text-gray-500 mt-20">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please upload a file first.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-purple-600" />
                    Flashcard Generator
                </h2>
                <button
                    onClick={generateFlashcards}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <img src="/assets/thinking_logo.png" alt="Processing" className="w-5 h-5 object-contain animate-pulse" />
                            <span>Creating</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </>
                    ) : (
                        'Generate Flashcards'
                    )}
                </button>
            </div>

            {flashcards.length > 0 && (
                <div className="space-y-6">
                    {/* Flashcard */}
                    <div
                        className="relative w-full max-w-2xl h-80 mx-auto cursor-pointer perspective-1000"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <motion.div
                            className="w-full h-full relative preserve-3d"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: 'spring' }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center">
                                <div className="text-xs font-semibold text-purple-600 mb-4 uppercase tracking-wide">Question</div>
                                <p className="text-2xl font-bold text-gray-900 text-center">{flashcards[currentIndex]?.front}</p>
                                <div className="mt-8 text-sm text-gray-500 flex items-center gap-2">
                                    <RotateCw size={14} />
                                    Click to flip
                                </div>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center rotate-y-180">
                                <div className="text-xs font-semibold text-blue-600 mb-4 uppercase tracking-wide">Answer</div>
                                <p className="text-xl text-gray-800 text-center leading-relaxed">{flashcards[currentIndex]?.back}</p>
                                <div className="mt-6 text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                                    {flashcards[currentIndex]?.location}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Card Counter - Centered */}
                    <div className="text-center text-sm text-gray-600 font-medium mb-4">
                        Card {currentIndex + 1} of {flashcards.length}
                    </div>

                    {/* Navigation - Centered */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={prevCard}
                            className="p-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-colors shadow-md"
                            disabled={flashcards.length <= 1}
                        >
                            <ChevronLeft size={24} className="text-gray-700" />
                        </button>
                        <button
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-colors font-medium text-gray-700 flex items-center gap-2 shadow-md"
                        >
                            <RotateCw size={18} />
                            Flip Card
                        </button>
                        <button
                            onClick={nextCard}
                            className="p-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-colors shadow-md"
                            disabled={flashcards.length <= 1}
                        >
                            <ChevronRight size={24} className="text-gray-700" />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
        </div>
    );
};

export default FlashcardComponent;
