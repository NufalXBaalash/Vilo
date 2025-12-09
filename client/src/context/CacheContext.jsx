import React, { createContext, useContext, useState } from 'react';

const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
    const [cache, setCache] = useState({
        questions: null,
        flashcards: null,
        summary: null,
        keywords: null,
        chatMessages: [],
    });

    const updateCache = (key, value) => {
        setCache(prev => ({ ...prev, [key]: value }));
    };

    const clearCache = () => {
        setCache({
            questions: null,
            flashcards: null,
            summary: null,
            keywords: null,
            chatMessages: [],
        });
    };

    return (
        <CacheContext.Provider value={{ cache, updateCache, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => useContext(CacheContext);
