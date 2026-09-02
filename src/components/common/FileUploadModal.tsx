import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Shield, Lock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CategoryType, FileFormat } from '../../types/sagarinfo';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
  const { addDocument } = useData();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('identity');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Official, Vault');
  const [isPrivate, setIsPrivate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setUploading(true);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 25;
      setProgress(cur);
      if (cur >= 100) {
        clearInterval(interval);

        const ext = selectedFile ? selectedFile.name.split('.').pop()?.toLowerCase() as FileFormat : 'pdf';
        const sizeStr = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';
        const bytes = selectedFile ? selectedFile.size : 1200000;

        addDocument({
          title,
          category,
          fileName: selectedFile ? selectedFile.name : `${title.replace(/\s+/g, '_')}.${ext || 'pdf'}`,
          fileSize: sizeStr,
          fileSizeBytes: bytes,
          fileType: ext || 'pdf',
          fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          previewUrl: selectedFile && selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : undefined,
          description,
          tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
          isFavorite: false,
          isPrivate,
        });

        setUploading(false);
        setProgress(0);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        onClose();
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upload to Vault</h3>
              <p className="text-[11px] text-slate-400">Secure document intake & metadata tagging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-400'
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer block">
              <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2 opacity-80" />
              {selectedFile ? (
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for intake
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span className="text-indigo-500">Click to browse</span> or drag and drop document here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PDF, PNG, JPG, DOCX, PPTX, XLSX (Max 50MB)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Passport Copy 2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vault Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="identity">Identity (Aadhaar, PAN, Passport)</option>
                <option value="education">Education (Marksheets, Degree)</option>
                <option value="career">Career (Resume, Offers)</option>
                <option value="financial">Financial (Passbooks, Tax)</option>
                <option value="other">Other / Custom</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional context or purpose..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tags & Security */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="KYC, Official, 2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="isPrivateCheck"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <label htmlFor="isPrivateCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Keep Private in Vault Only</span>
              </label>
            </div>
          </div>

          {/* Progress bar if uploading */}
          {uploading && (
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-indigo-400">
                <span>Intaking file into encrypted vault...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !title}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
            >
              {uploading ? 'Processing...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
