import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, X, RefreshCw, Camera } from 'lucide-react';

interface FileUploadZoneProps {
  label?: string;
  acceptedTypes?: string;
  selectedFile?: { name: string; size: string; type?: string; url?: string } | null;
  onFileSelect: (file: { name: string; size: string; type: string; url: string }) => void;
  onFileRemove: () => void;
  isRequired?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label = 'Upload Document or File',
  acceptedTypes = 'image/*,application/pdf,.doc,.docx,.ppt,.pptx',
  selectedFile,
  onFileSelect,
  onFileRemove,
  isRequired = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const processFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size >= 1024 * 1024 ? `${sizeInMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const fileType = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? 'image' : ext === 'pdf' ? 'pdf' : 'document';

    setUploadProgress(10);
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    reader.onload = () => {
      const realDataUrl = reader.result as string;
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 300);
      onFileSelect({
        name: file.name,
        size: sizeStr,
        type: fileType,
        url: realDataUrl,
      });
    };

    reader.onerror = () => {
      setUploadProgress(null);
      alert('Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
        {label} {isRequired && <span className="text-rose-500">*</span>}
      </label>

      {selectedFile ? (
        /* Selected Real File Card */
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-cyan-500/30 flex items-center justify-between gap-3 animate-modal-pop">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              {selectedFile.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[280px]">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Real File Loaded
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedFile.size}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Replace File"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onFileRemove}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Real Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-500/5'
          }`}
        >
          <div className="p-3.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 mb-1">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Drag & drop your file here, or browse from device
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Supports real PDF, PNG, JPG, DOCX, PPTX files
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md touch-target flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Select File
            </button>

            {/* Camera capture trigger for mobile devices */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-3.5 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-sm touch-target flex items-center gap-1.5 sm:hidden"
              title="Capture Photo"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-500" /> Photo
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {uploadProgress !== null && (
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <span>Reading file data...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Real File Input for device selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera Capture Input for Mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
