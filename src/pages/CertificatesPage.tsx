import React, { useState } from 'react';
import {
  Award,
  Search,
  Plus,
  ExternalLink,
  Eye,
  Trash2,
  Edit,
  CheckCircle2,
  Calendar,
  Building,
  Star,
  X,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { CertificateItem } from '../types/sagarinfo';
import { FileUploadZone } from '../components/common/FileUploadZone';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const CertificatesPage: React.FC = () => {
  const {
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    toggleFavoriteCertificate,
    openPreviewFile,
    showToast,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [certToDelete, setCertToDelete] = useState<CertificateItem | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);

  const [title, setTitle] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string; url: string } | null>(null);

  const filteredCerts = certificates.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.issuingOrganization.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const openAddModal = () => {
    setEditingCert(null);
    setTitle('');
    setIssuingOrganization('');
    setIssueDate('');
    setCredentialId('');
    setCredentialUrl('');
    setSkillsInput('AWS, Cloud, Architecture');
    setDescription('');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuingOrganization(cert.issuingOrganization);
    setIssueDate(cert.issueDate);
    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setSkillsInput(cert.skills ? cert.skills.join(', ') : '');
    setDescription(cert.description || '');
    setSelectedFile(cert.certificateUrl ? { name: `${cert.title}_Proof.pdf`, size: '1.4 MB', type: 'pdf', url: cert.certificateUrl } : null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuingOrganization) return;

    const payload: Omit<CertificateItem, 'id'> = {
      title,
      issuingOrganization,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      credentialId,
      credentialUrl,
      fileUrl: selectedFile?.url || editingCert?.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      certificateUrl: selectedFile?.url || editingCert?.certificateUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      tags: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      isFavorite: editingCert ? editingCert.isFavorite : false,
      description,
    };

    if (editingCert) {
      updateCertificate({ ...payload, id: editingCert.id });
    } else {
      addCertificate(payload);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (certToDelete) {
      deleteCertificate(certToDelete.id);
      setCertToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Verified Certificates & Cloud Credentials
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store professional certifications, AWS/Google/Meta badges, and digital credential verification links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg touch-target"
        >
          <Plus className="w-4 h-4" /> + Add Certificate
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates or skills..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Certificate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 glow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {cert.issuingOrganization}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavoriteCertificate(cert.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      cert.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 text-slate-400 hover:text-cyan-500"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCertToDelete(cert)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{cert.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Issued: {cert.issueDate}
              </p>

              {cert.credentialId && (
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
                  ID: {cert.credentialId}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 mt-3">
                {cert.skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {cert.certificateUrl && (
                <button
                  onClick={() => openPreviewFile(cert.certificateUrl!, cert.title, 'pdf')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-500" /> Certificate File
                </button>
              )}

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  Verify Online <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Add / Edit Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl animate-modal-pop max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingCert ? 'Edit Certificate' : '+ Add Certificate Credential'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Issuing Body / Organization *</label>
                  <input
                    type="text"
                    required
                    value={issuingOrganization}
                    onChange={(e) => setIssuingOrganization(e.target.value)}
                    placeholder="e.g. Amazon Web Services / Meta"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. AWS-8923412"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Verification URL</label>
                  <input
                    type="url"
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    placeholder="https://credly.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Associated Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="AWS, Cloud, Microservices"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              {/* Prominent File Upload */}
              <FileUploadZone
                label="Upload Certificate Proof File"
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                onFileRemove={() => setSelectedFile(null)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(certToDelete)}
        title="Delete this certificate?"
        message={`Are you sure you want to delete "${certToDelete?.title}"? This credential proof will be removed.`}
        confirmText="Delete Certificate"
        onConfirm={confirmDelete}
        onCancel={() => setCertToDelete(null)}
      />
    </div>
  );
};
