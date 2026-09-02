import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Grid,
  List,
  Star,
  Download,
  Eye,
  Trash2,
  Lock,
  Globe,
  Filter,
  X,
  Edit,
  ShieldAlert,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DocumentItem } from '../types/sagarinfo';
import { FileUploadZone } from '../components/common/FileUploadZone';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

interface DocumentsPageProps {
  onOpenUploadModal?: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    toggleFavoriteDocument,
    openPreviewFile,
    showToast,
  } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Deletion modal state
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  // Add/Edit Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('identity');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string; url: string } | null>(null);

  const categories = [
    { id: 'All', label: 'All Vault Docs' },
    { id: 'identity', label: 'Identity Documents' },
    { id: 'education', label: 'Education Marksheets' },
    { id: 'career', label: 'Career & Work' },
    { id: 'financial', label: 'Financial Records' },
    { id: 'other', label: 'Other Files' },
  ];

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openAddModal = () => {
    setEditingDoc(null);
    setTitle('');
    setCategory('identity');
    setDescription('');
    setVisibility('private');
    setTagsInput('KYC, Official');
    setSelectedFile(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setCategory(doc.category);
    setDescription(doc.description || '');
    setVisibility(doc.visibility || 'private');
    setTagsInput(doc.tags ? doc.tags.join(', ') : '');
    setSelectedFile({ name: doc.title, size: doc.fileSize, type: doc.fileType, url: doc.fileUrl });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!selectedFile && !editingDoc)) {
      showToast('Please select or upload a document file', 'error');
      return;
    }

    const payload: Omit<DocumentItem, 'id' | 'uploadDate'> = {
      title,
      category,
      fileName: selectedFile?.name || title,
      fileSize: selectedFile?.size || editingDoc?.fileSize || '1.5 MB',
      fileSizeBytes: 1500000,
      fileType: (selectedFile?.type as any) || editingDoc?.fileType || 'pdf',
      fileUrl: selectedFile?.url || editingDoc?.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      previewUrl: selectedFile?.url || editingDoc?.previewUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      visibility,
      isPrivate: visibility === 'private',
      isFavorite: editingDoc ? editingDoc.isFavorite : false,
      description,
    };

    if (editingDoc) {
      updateDocument({ ...payload, id: editingDoc.id, uploadDate: editingDoc.uploadDate });
    } else {
      addDocument(payload);
    }

    setIsAddModalOpen(false);
  };

  const confirmDelete = () => {
    if (docToDelete) {
      deleteDocument(docToDelete.id);
      setDocToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-500" />
            Document Vault & Private Storage
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store identity credentials, academic marksheets, financial docs, and personal files safely.
          </p>
        </div>

        {/* Prominent + Add Document Button */}
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg touch-target"
        >
          <Plus className="w-4 h-4" /> + Add Document
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white border-cyan-500 font-bold shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Document View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 glow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    {doc.category}
                  </span>

                  <div className="flex items-center gap-1">
                    {doc.visibility === 'private' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    )}

                    <button
                      onClick={() => toggleFavoriteDocument(doc.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        doc.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 mt-1">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{doc.fileSize} • Uploaded {doc.uploadDate}</p>
                    {doc.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">{doc.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => openPreviewFile(doc.previewUrl || doc.fileUrl, doc.title, doc.fileType)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-2 rounded-xl text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Document"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDocToDelete(doc)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.category.toUpperCase()} • {doc.fileSize} • {doc.uploadDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPreviewFile(doc.previewUrl || doc.fileUrl, doc.title, doc.fileType)}
                    className="p-2 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => setDocToDelete(doc)}
                    className="p-2 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prominent Add / Edit Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl animate-modal-pop max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingDoc ? 'Edit Document Details' : '+ Add Document to Vault'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Document Name / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aadhaar Card (Official ID)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    <option value="identity">Identity Documents</option>
                    <option value="education">Education Marksheets</option>
                    <option value="career">Career & Work</option>
                    <option value="financial">Financial Records</option>
                    <option value="other">Other Files</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    <option value="private">🔒 Private (Vault Only)</option>
                    <option value="public">🌐 Public (Portfolio Visible)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. KYC, Official, Aadhaar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              {/* Prominent File Upload Component */}
              <FileUploadZone
                label="Upload Document File"
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                onFileRemove={() => setSelectedFile(null)}
                isRequired={!editingDoc}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Document Deletion */}
      <ConfirmationModal
        isOpen={Boolean(docToDelete)}
        title="Delete this document?"
        message={`Are you sure you want to delete "${docToDelete?.title}"? This file will be permanently removed from your private vault.`}
        confirmText="Delete Document"
        onConfirm={confirmDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};
