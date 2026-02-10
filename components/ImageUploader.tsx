
import React, { useState } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  label: string;
  description: string;
  onImageSelect: (data: ImageData) => void;
  icon: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, description, onImageSelect, icon }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelect({
          base64: base64,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{label}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      
      <label className={`relative flex flex-col items-center justify-center h-64 w-full border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group ${
        preview ? 'border-indigo-500/50' : 'border-gray-700 hover:border-indigo-500/50 hover:bg-white/5'
      }`}>
        {preview ? (
          <img 
            src={preview} 
            className="h-full w-full object-cover rounded-2xl" 
            alt="Upload Preview" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or WebP (Max 10MB)</p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        {preview && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
            <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">Replace Image</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
