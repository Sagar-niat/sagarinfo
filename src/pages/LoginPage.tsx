import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, ArrowRight, Fingerprint, ScanFace } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginWithBiometrics, hasPasskeyRegistered } = useAuth();
  const [email, setEmail] = useState('sagar@example.com');
  const [password, setPassword] = useState('sagar2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid passcode credentials');
    }
  };

  const handleBiometricClick = async () => {
    setError('');
    setBiometricLoading(true);
    const res = await loginWithBiometrics();
    setBiometricLoading(false);
    if (!res.success) {
      setError(res.error || 'Biometric authentication was cancelled or failed.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl space-y-6 animate-modal-pop">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center font-black text-slate-950 text-xl mx-auto shadow-lg shadow-cyan-600/30">
            S
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">SAGARINFO</h1>
          <p className="text-xs text-slate-400 font-medium">Everything about me. One place.</p>
        </div>

        {/* Real Biometric Fingerprint / Face ID Unlock Button */}
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-2">
          <p className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1.5">
            <ScanFace className="w-4 h-4 text-cyan-400" /> Biometric & Passkey Unlock
          </p>
          <button
            type="button"
            onClick={handleBiometricClick}
            disabled={biometricLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 touch-target"
          >
            <Fingerprint className="w-5 h-5 text-slate-950" />
            <span>{biometricLoading ? 'Verifying Biometrics...' : 'Unlock with Fingerprint / Face ID'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">OR USE PASSCODE</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vault Email ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Master Vault Passcode</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white"
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all touch-target"
          >
            <span>{loading ? 'Authenticating...' : 'Unlock with Passcode'}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
