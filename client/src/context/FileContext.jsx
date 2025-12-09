import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [currentFile, setCurrentFile] = useState(null); // { filename: '...', path: '...' }

    return (
        <FileContext.Provider value={{ currentFile, setCurrentFile }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFile = () => useContext(FileContext);
