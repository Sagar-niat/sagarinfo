import React, { useEffect, useState } from 'react';
import { Smartphone, Laptop, Wifi, QrCode, Copy, Check, X, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConnectModal: React.FC<MobileConnectModalProps> = ({ isOpen, onClose }) => {
  const [networkInfo, setNetworkInfo] = useState<{ ip: string; port: number; url: string; hostname?: string }>({
    ip: '192.168.0.102',
    port: 5173,
    url: 'http://192.168.0.102:5173',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/network-info')
        .then((r) => r.json())
        .then((data) => {
          if (data && data.url) {
            setNetworkInfo(data);
          }
        })
        .catch(() => {
          // Fallback to current host if network-info fails
          const host = window.location.hostname;
          const port = window.location.port || '5173';
          setNetworkInfo({
            ip: host,
            port: Number(port),
            url: `http://${host}:${port}`,
          });
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(networkInfo.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    networkInfo.url
  )}&bgcolor=0B0F17&color=38BDF8&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-modal-pop max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Use SAGARINFO on Your Phone
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seamless cross-device access with live laptop sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code & Scan Instructions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="relative group shrink-0">
            <img
              src={qrCodeUrl}
              alt="Scan to open on phone"
              className="w-36 h-36 rounded-2xl border-2 border-cyan-500/40 p-1 bg-[#0B0F17] shadow-lg object-contain"
            />
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <QrCode className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 inline-flex items-center gap-1">
              <Wifi className="w-3 h-3" /> Same Wi-Fi Access
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Scan with your phone's camera
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open your phone camera, scan the code, and tap the notification link to launch your private vault on your mobile device.
            </p>
          </div>
        </div>

        {/* Direct URL with 1-click Copy */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Direct Phone Browser URL:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold truncate">
              {networkInfo.url}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md touch-target shrink-0 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Cross-Device Sync Architecture Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-emerald-600 dark:text-emerald-400">
              100% Private to Sagar — Stored on Your Laptop
            </h5>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              Documents or profile changes you make on your phone are automatically saved directly to your laptop. No third parties can see your documents.
            </p>
          </div>
        </div>

        {/* How to Add to Home Screen (PWA experience) */}
        <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Install as Mobile App (1 Tap)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">🍎 On iPhone (Safari)</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Tap the <span className="font-bold text-cyan-400">Share</span> button at the bottom → tap <span className="font-bold text-cyan-400">"Add to Home Screen"</span>.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">🤖 On Android (Chrome)</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Tap the <span className="font-bold text-cyan-400">Three Dots Menu</span> (⋮) → tap <span className="font-bold text-cyan-400">"Install app"</span> or "Add to Home screen".
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
