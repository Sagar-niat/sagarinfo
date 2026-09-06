import React, { useEffect, useRef, useState } from 'react';
import {
  Settings,
  Shield,
  Fingerprint,
  Smartphone,
  HardDrive,
  Eye,
  Lock,
  Trash2,
  Download,
  Upload,
  Wifi,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Laptop,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const SettingsPage: React.FC = () => {
  const { storageStats, resetAllData, importBackupData, showToast } = useData();
  const { registerWebAuthnPasskey, hasPasskeyRegistered } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'security' | 'phone-sync' | 'appearance' | 'storage' | 'privacy'>('phone-sync');
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [isCleanVaultConfirmOpen, setIsCleanVaultConfirmOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [networkInfo, setNetworkInfo] = useState<{ ip: string; port: number; url: string }>({
    ip: '192.168.0.102',
    port: 5173,
    url: 'http://192.168.0.102:5173',
  });

  useEffect(() => {
    fetch('/api/network-info')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.url) setNetworkInfo(d);
      })
      .catch(() => {
        const host = window.location.hostname;
        const port = window.location.port || '5173';
        setNetworkInfo({
          ip: host,
          port: Number(port),
          url: `http://${host}:${port}`,
        });
      });
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(networkInfo.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
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

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    networkInfo.url
  )}&bgcolor=0B0F17&color=38BDF8&margin=10`;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-500" />
          Settings & Cross-Device Control Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure phone-laptop synchronization, biometric security, clean vault management, and backup data.
        </p>
      </div>

      {/* Tabs Navbar */}
      <div className="glass-panel p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'phone-sync', label: '📱 Phone & Laptop Sync', icon: Smartphone },
          { id: 'security', label: 'Security & Biometrics', icon: Shield },
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

      {/* Phone & Laptop Sync Tab */}
      {activeTab === 'phone-sync' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-500" />
                  Connect Sagar's Smartphone
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Access and manage your private vault from your mobile phone with real-time sync to your laptop.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vite Host Server Online (0.0.0.0)
              </span>
            </div>

            {/* QR Code and Direct URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center sm:items-start gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 inline-flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Same Wi-Fi Access
                </span>

                <div className="w-full space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Phone Browser Link:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={networkInfo.url}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md touch-target"
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedUrl ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Private Local Network Sync
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Any document, certificate, or project you add from your phone saves directly to your laptop's database (`data/vault.json`).
                  </p>
                </div>
              </div>

              {/* Scannable QR Code */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3 text-center">
                <img
                  src={qrCodeUrl}
                  alt="Scan to open on phone"
                  className="w-40 h-40 rounded-2xl border-2 border-cyan-500/40 p-1 bg-[#0B0F17] shadow-lg object-contain"
                />
                <p className="text-xs font-bold text-white">Scan with your phone's camera</p>
                <p className="text-[11px] text-slate-400">Works on all iPhone & Android cameras</p>
              </div>
            </div>

            {/* How to install on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  🍎 Apple iOS (Safari)
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Open Safari, scan the QR code or go to <span className="font-mono text-cyan-400">{networkInfo.url}</span>. Tap the <span className="font-bold text-cyan-400">Share</span> icon at the bottom, then choose <span className="font-bold text-cyan-400">"Add to Home Screen"</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  🤖 Google Android (Chrome)
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Open Chrome, scan the QR code or type <span className="font-mono text-cyan-400">{networkInfo.url}</span>. Tap the <span className="font-bold text-cyan-400">three dots (⋮)</span> in the top right, then select <span className="font-bold text-cyan-400">"Install app"</span> or "Add to Home screen".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
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
                    Protect your private documents using your phone or laptop's built-in biometric sensor.
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
