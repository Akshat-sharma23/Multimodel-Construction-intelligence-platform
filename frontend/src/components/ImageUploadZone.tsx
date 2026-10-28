import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ImageUploadZoneProps {
  onImageSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  sampleImageUrl?: string;
  sampleLabel?: string;
  label?: string;
  description?: string;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelected,
  selectedFile,
  onClear,
  sampleImageUrl,
  sampleLabel = "Load Verified Sample Image",
  label = "Upload Construction Photograph",
  description = "Supports JPG, PNG, or WebP up to 10MB"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = async () => {
    if (!sampleImageUrl) return;
    try {
      setLoadingSample(true);
      const res = await fetch(sampleImageUrl);
      const blob = await res.blob();
      const filename = sampleImageUrl.split('/').pop() || 'sample.jpg';
      const file = new File([blob], filename, { type: 'image/jpeg' });
      handleFile(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      alert('Could not load sample image.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {previewUrl || selectedFile ? (
        <div className="relative rounded-xl border border-slate-300 bg-slate-900 overflow-hidden shadow-md group">
          <img
            src={previewUrl || undefined}
            alt="Uploaded preview"
            className="w-full h-72 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 justify-between">
            <div className="flex items-center gap-2 text-white text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{selectedFile?.name || 'Selected Photograph'}</span>
              <span className="text-slate-400">
                ({selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''})
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow"
              title="Remove image"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-50'
              : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-slate-800 mb-1">{label}</div>
          <div className="text-xs text-slate-500 max-w-xs mx-auto mb-4">{description}</div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-200"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Browse Files</span>
          </button>
        </div>
      )}

      {sampleImageUrl && !selectedFile && (
        <div className="mt-2.5 flex items-center justify-between text-xs bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-600">No construction image on hand?</span>
          <button
            type="button"
            disabled={loadingSample}
            onClick={handleLoadSample}
            className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1.5 hover:underline disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{loadingSample ? 'Loading...' : sampleLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
