import React, { useState } from 'react';
import { Upload, Check, Loader2, AlertCircle } from 'lucide-react';
import { useFile } from '../context/FileContext';
import { cn } from '../lib/utils';

const FileUpload = () => {
    const { currentFile, setCurrentFile } = useFile();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setCurrentFile({ filename: data.filename, path: data.path });
        } catch (err) {
            console.error(err);
            setError('Failed to upload');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {currentFile && (
                <div className="hidden md:flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full border-2 border-green-200">
                    <Check size={14} />
                    <span className="truncate max-w-[150px] font-medium">{currentFile.filename}</span>
                </div>
            )}

            {error && (
                <div className="hidden md:flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-full border-2 border-red-200">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}

            <label className={cn(
                "cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl transition-all border-2 font-medium shadow-md",
                isUploading
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-transparent"
            )}>
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
};

export default FileUpload;
