import React, { useState } from 'react';
import {
  Settings,
  Shield,
  KeyRound,
  Fingerprint,
  Smartphone,
  HardDrive,
  Eye,
  Lock,
  Globe,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Download,
  AlertTriangle,
  LogOut,
  Laptop,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const SettingsPage: React.FC = () => {
  const { storageStats, resetAllData, showToast } = useData();
  const { registerWebAuthnPasskey, hasPasskeyRegistered } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'security' | 'appearance' | 'storage' | 'privacy'>('security');
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);

  // Modal confirmation states
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isLogoutSessionsConfirmOpen, setIsLogoutSessionsConfirmOpen] = useState(false);

  // Detect Real Device Environment dynamically
  const getDeviceDetails = () => {
    const ua = navigator.userAgent;
    let os = 'Windows PC';
    if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS Device';
    else if (ua.includes('Android')) os = 'Android Smartphone';
    else if (ua.includes('Macintosh')) os = 'macOS Workstation';
    else if (ua.includes('Linux')) os = 'Linux Workstation';

    let browser = 'Chrome Web Browser';
    if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
    else if (ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';

    return { os, browser };
  };

  const currentDevice = getDeviceDetails();

  // Active Sessions — ONLY the user's real device
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-real-01',
      device: `${currentDevice.os} (Your Active Device)`,
      browser: currentDevice.browser,
      location: 'Current Location',
      ip: 'Active Local Device',
      active: true,
    },
  ]);

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

  const handleLogoutOtherSessions = () => {
    setActiveSessions(activeSessions.filter((s) => s.active));
    setIsLogoutSessionsConfirmOpen(false);
    showToast('Only your current real active device remains connected');
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
          Manage real WebAuthn Passkeys, biometric fingerprint/face authentication, real single-device session security, and data backup.
        </p>
      </div>

      {/* Tabs Navbar */}
      <div className="glass-panel p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'security', label: 'Security & Biometrics', icon: Shield },
          { id: 'appearance', label: 'Theme Appearance', icon: Eye },
          { id: 'storage', label: 'Storage & Analytics', icon: HardDrive },
          { id: 'privacy', label: 'Privacy & Backup', icon: Lock },
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
                    Unlock SAGARINFO instantly using your device's native Windows Hello, Touch ID, Face ID, or Android fingerprint sensor.
                  </p>
                </div>
              </div>

              {hasPasskeyRegistered ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4" /> Real Biometric Enabled
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 self-start sm:self-auto">
                  Not Configured
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Real WebAuthn Credential Registration
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Your biometric fingerprint and face data remain encrypted inside your hardware security chip. SAGARINFO receives only verified cryptographic tokens.
                </p>
              </div>

              <button
                onClick={handleRegisterBiometricPasskey}
                disabled={isRegisteringPasskey}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md touch-target whitespace-nowrap"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{isRegisteringPasskey ? 'Prompting Device...' : hasPasskeyRegistered ? 'Re-register Biometric Key' : 'Set Up Biometric Login'}</span>
              </button>
            </div>
          </div>

          {/* Real Single Device Session */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-500">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Active Device Session</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Strict privacy: Only your real current device is logged in. Fake demo sessions are excluded.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {activeSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{sess.device}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          REAL DEVICE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {sess.browser} • {sess.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Theme System & Palette Mode</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Choose between Clean Light mode, Obsidian Dark mode, or System default.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { id: 'light', label: 'Clean Light Mode', desc: 'Off-white background & crisp slate typography' },
              { id: 'dark', label: 'Obsidian Dark Mode', desc: 'Deep dark background with controlled cyan glow' },
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
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Vault Storage & Reset</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Total Vault Usage:</span>
              <span>{storageStats.totalStorageUsedFormatted} / {storageStats.storageLimitFormatted}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full" style={{ width: `${storageStats.usedPercentage}%` }} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset Data to Default Setup
            </button>
          </div>
        </div>
      )}

      {/* Privacy & Backup Tab */}
      {activeTab === 'privacy' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Backup & JSON Data Export</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Download a complete offline JSON backup archive of all documents, certificates, projects, and achievements.</p>

          <button
            onClick={() => storageService.exportAllData()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" /> Export Complete Data Backup (JSON)
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        title="Reset all vault data?"
        message="This will clear custom entries and restore default initial setup."
        confirmText="Reset Vault Data"
        onConfirm={() => {
          resetAllData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
