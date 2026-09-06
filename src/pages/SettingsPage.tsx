import React, { useRef, useState } from 'react';
import {
  Settings,
  Shield,
  Fingerprint,
  HardDrive,
  Eye,
  Lock,
  Trash2,
  Download,
  Upload,
  KeyRound,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const SettingsPage: React.FC = () => {
  const { storageStats, resetAllData, importBackupData, showToast } = useData();
  const { registerWebAuthnPasskey, hasPasskeyRegistered, updatePasscode, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'security' | 'appearance' | 'storage' | 'privacy'>('security');
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [isCleanVaultConfirmOpen, setIsCleanVaultConfirmOpen] = useState(false);

  // Passcode state
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.length < 4) {
      showToast('Passcode must be at least 4 characters long', 'error');
      return;
    }
    if (passcode !== confirmPasscode) {
      showToast('Passcodes do not match', 'error');
      return;
    }
    updatePasscode(passcode);
    setPasscodeSuccess(true);
    setPasscode('');
    setConfirmPasscode('');
    showToast('Master Vault Passcode updated successfully!', 'success');
    setTimeout(() => setPasscodeSuccess(false), 3000);
  };

  // Real WebAuthn Passkey / Biometric Registration
  const handleRegisterBiometricPasskey = async () => {
    setIsRegisteringPasskey(true);
    const res = await registerWebAuthnPasskey();
    setIsRegisteringPasskey(false);

    if (res.success) {
      showToast(res.message);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importBackupData(json);
      } catch (err) {
        showToast('Invalid JSON backup file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-500" />
          Settings & Security Control Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage master passcode protection, biometric security, clean vault reset, and backup exports.
        </p>
      </div>

      {/* Tabs Navbar */}
      <div className="glass-panel p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'security', label: 'Security & Passcode', icon: Shield },
          { id: 'appearance', label: 'Theme Appearance', icon: Eye },
          { id: 'storage', label: 'Storage & Clean Slate', icon: HardDrive },
          { id: 'privacy', label: 'Backup & Restore', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Master Passcode Section */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-500">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Change Master Vault Passcode
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update the password required to unlock your vault (Default: <code className="text-cyan-400">sagar2026</code>).
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePasscode} className="space-y-3 max-w-md pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">New Passcode</label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter at least 4 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Passcode</label>
                <input
                  type="password"
                  required
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Re-enter new passcode"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {passcodeSuccess && (
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Passcode successfully updated!
                </p>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all touch-target"
              >
                Save New Passcode
              </button>
            </form>
          </div>

          {/* Biometric & Passkey Section */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-500">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Device Fingerprint & Face ID Biometrics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fast one-touch biometric unlock using your laptop or smartphone sensor.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRegisterBiometricPasskey}
                disabled={isRegisteringPasskey}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all touch-target"
              >
                {isRegisteringPasskey
                  ? 'Verifying...'
                  : hasPasskeyRegistered
                  ? 'Update Biometric Key'
                  : 'Register Biometric Key'}
              </button>
            </div>
          </div>

          {/* Lock Vault Immediately */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <LogOut className="w-4 h-4 text-rose-500" />
                Lock Vault Session
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immediately lock your vault and return to the mandatory authentication screen.
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition-all"
            >
              Lock Vault Now
            </button>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Theme System & Palette Mode</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose between Clean Light mode, Obsidian Dark mode, or System default.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { id: 'light', label: 'Clean Light Mode', desc: 'Crisp light background with sharp contrast' },
              { id: 'dark', label: 'Obsidian Dark Mode', desc: 'Deep dark background with subtle cyan highlights' },
              { id: 'system', label: 'System Automatic', desc: 'Matches device preference automatically' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeMode(t.id as any)}
                className={`p-5 rounded-2xl border text-left transition-all space-y-2 ${
                  themeMode === t.id
                    ? 'border-cyan-500 bg-cyan-500/10 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage Tab */}
      {activeTab === 'storage' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Vault Storage Status & Clean Slate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your vault is set up for your real documents. You can clear and start fresh at any time.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Total Vault Usage:</span>
              <span>
                {storageStats.totalStorageUsedFormatted} / {storageStats.storageLimitFormatted}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full" style={{ width: `${storageStats.usedPercentage}%` }} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsCleanVaultConfirmOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md touch-target transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Wipe All Records to Clean Slate (0 Items)
            </button>
          </div>
        </div>
      )}

      {/* Privacy & Backup Tab */}
      {activeTab === 'privacy' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Complete Vault Backup & Restore
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Export your entire private vault to an encrypted offline JSON archive, or import an existing backup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => storageService.exportAllData()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all touch-target"
            >
              <Download className="w-4 h-4" /> Export Complete Backup (JSON)
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 shadow-md transition-all touch-target"
            >
              <Upload className="w-4 h-4" /> Import Backup File (JSON)
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCleanVaultConfirmOpen}
        title="Wipe Vault to 100% Clean Slate?"
        message="This will clear all documents, certificates, and projects so you have a completely clean vault with 0 items."
        confirmText="Confirm Clean Slate"
        onConfirm={() => {
          resetAllData();
          setIsCleanVaultConfirmOpen(false);
        }}
        onCancel={() => setIsCleanVaultConfirmOpen(false)}
      />
    </div>
  );
};
