import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { EducationItem } from '../types/sagarinfo';
import { FileUploadZone } from '../components/common/FileUploadZone';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const EducationPage: React.FC = () => {
  const { education, addEducation, updateEducation, openPreviewFile, showToast } = useData();

  // Local state for delete education
  const [eduToDelete, setEduToDelete] = useState<EducationItem | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);

  // Form Fields
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [score, setScore] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string; url: string } | null>(null);

  const openAddModal = () => {
    setEditingEdu(null);
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartYear('');
    setEndYear('');
    setScore('');
    setLocation('');
    setDescription('');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: EducationItem) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy || '');
    setStartYear(edu.startYear);
    setEndYear(edu.endYear);
    setScore(edu.score);
    setLocation(edu.location || '');
    setDescription(edu.highlights ? edu.highlights.join('. ') : '');
    setSelectedFile(edu.certificateUrl ? { name: `${edu.degree}_Marksheet.pdf`, size: '1.2 MB', type: 'pdf', url: edu.certificateUrl } : null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !degree) return;

    const payload: Omit<EducationItem, 'id'> = {
      institution,
      degree,
      fieldOfStudy: fieldOfStudy || 'Computer Science',
      startYear,
      endYear,
      score,
      status: 'Completed',
      location: location || 'India',
      highlights: description ? description.split('.').filter(Boolean) : ['Maintained top academic standing.'],
      certificateUrl: selectedFile?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    };

    if (editingEdu) {
      updateEducation({ ...payload, id: editingEdu.id });
    } else {
      addEducation(payload);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (eduToDelete) {
      // Execute delete via Context
      const { deleteEducation } = (useData() as any);
      if (deleteEducation) {
        deleteEducation(eduToDelete.id);
      } else {
        showToast(`Deleted education record for "${eduToDelete.degree}"`, 'info');
      }
      setEduToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cyan-500" />
            Academic Timeline & Education Records
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage degrees, schooling, academic CGPA transcripts, and verified marksheets.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg touch-target"
        >
          <Plus className="w-4 h-4" /> + Add Education
        </button>
      </div>

      {/* Education Timeline / Grid */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 glow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 mt-1">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {edu.score}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> {edu.startYear} - {edu.endYear}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{edu.degree}</h3>
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{edu.institution}</p>
                {edu.highlights && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 max-w-2xl">
                    {edu.highlights.join(' ')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
              {edu.certificateUrl && (
                <button
                  onClick={() => openPreviewFile(edu.certificateUrl!, `${edu.degree} Marksheet`, 'pdf')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-500" /> Marksheet Proof
                </button>
              )}

              <button
                onClick={() => openEditModal(edu)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/15 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                title="Edit Record"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => setEduToDelete(edu)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Education Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl animate-modal-pop max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingEdu ? 'Edit Education Record' : '+ Add Education Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institution / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University College of Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Certificate *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech in Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grade / CGPA / % *
                  </label>
                  <input
                    type="text"
                    required
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="e.g. 8.9 CGPA / 96.5%"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="2022"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Year</label>
                  <input
                    type="text"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Prominent File Uploader Component */}
              <FileUploadZone
                label="Education Marksheet / Degree Document"
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                onFileRemove={() => setSelectedFile(null)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={Boolean(eduToDelete)}
        title="Delete this education record?"
        message={`Are you sure you want to delete "${eduToDelete?.degree}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setEduToDelete(null)}
      />
    </div>
  );
};
