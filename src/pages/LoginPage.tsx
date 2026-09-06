import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Fingerprint, ScanFace, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginWithBiometrics, hasPasskeyRegistered } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login('sagar@sagarinfo.dev', password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Incorrect passcode. Please try again.');
    }
  };

  const handleBiometricClick = async () => {
    setError('');
    setBiometricLoading(true);
    const res = await loginWithBiometrics();
    setBiometricLoading(false);
    if (!res.success) {
      setError(res.error || 'Biometric verification was cancelled or not recognized.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl space-y-6 animate-modal-pop">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-lg shadow-cyan-600/30">
            S
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">SAGARINFO</h1>
          <p className="text-xs text-slate-400 font-medium">Private Personal Vault & Operating System</p>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] text-cyan-400 font-bold">
            <Lock className="w-3 h-3" /> Mandatory Authentication Required
          </div>
        </div>

        {/* Biometric Unlock */}
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <ScanFace className="w-4 h-4 text-cyan-400" /> Device Biometrics
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Hardware Sensor
            </span>
          </div>
          <button
            type="button"
            onClick={handleBiometricClick}
            disabled={biometricLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 touch-target transition-all active:scale-[0.98]"
          >
            <Fingerprint className="w-5 h-5 text-slate-950" />
            <span>{biometricLoading ? 'Touch Sensor / Scanning Face...' : 'Unlock with Fingerprint / Face ID'}</span>
          </button>
          <p className="text-[10px] text-slate-400">
            Uses your laptop's Windows Hello, Mac Touch ID, or phone's fingerprint sensor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">OR ENTER PASSCODE</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Master Vault Passcode *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode (Default: sagar2026)"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all touch-target"
          >
            <span>{loading ? 'Verifying Passcode...' : 'Unlock Sagar Vault'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500">
          This digital hub is private and protected. Default passcode: <code className="text-cyan-400 font-mono">sagar2026</code>
        </p>
      </div>
    </div>
  );
};
