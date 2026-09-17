import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  User,
  CheckCircle2,
  Database,
  KeyRound,
  AlertCircle,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../services/supabase';

export const LoginPage: React.FC = () => {
  const { login, signUp, resetPassword } = useAuth();

  // Mode: 'signin' | 'signup' | 'forgot'
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    setIsExistingUser(false);
    setLoading(true);

    if (mode === 'forgot') {
      const res = await resetPassword(email);
      setLoading(false);
      if (res.success) {
        setInfoMsg(res.message || 'Password reset link sent to your email.');
      } else {
        setError(res.error || 'Failed to send password reset email.');
      }
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password entry.');
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, fullName);
      setLoading(false);
      if (res.success) {
        if (res.message) {
          setInfoMsg(res.message);
          setMode('signin');
        } else {
          setInfoMsg('Account created in Supabase! Signing in...');
        }
      } else {
        setError(res.error || 'Registration failed. Please check your details.');
        if (res.isExistingUser) {
          setIsExistingUser(true);
        }
      }
      return;
    }

    // Sign In mode
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid email or password. Please try again.');
    }
  };

  const isConnected = isSupabaseConfigured();
  const currentSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 animate-modal-pop">
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-lg shadow-cyan-600/30">
            S
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">SAGARINFO</h1>
          <p className="text-xs text-slate-400 font-medium">Supabase Cloud Authentication System</p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] text-cyan-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Supabase Auth Enabled
            </span>
            {isConnected ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-emerald-400 font-semibold">
                <Database className="w-3 h-3" /> Cloud Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-400 font-semibold">
                <AlertCircle className="w-3 h-3" /> .env Missing Credentials
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setInfoMsg('');
              setIsExistingUser(false);
            }}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setInfoMsg('');
              setIsExistingUser(false);
            }}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-fade-in space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="font-semibold">{error}</div>
            </div>

            {isExistingUser && (
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setIsExistingUser(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch to Sign In Page Now</span>
              </button>
            )}

            {error.includes('connect to Supabase') && (
              <div className="text-[11px] text-slate-300 pt-1 border-t border-rose-500/20">
                💡 <strong>How to fix:</strong> Make sure your active Supabase project URL & ANON key are pasted in <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-400 font-mono">.env</code> (replace placeholder URL).
              </div>
            )}
          </div>
        )}

        {/* Info Message Alert */}
        {infoMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fade-in flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>{infoMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sagar Kumar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  Password *
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setInfoMsg('');
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setInfoMsg('');
                }}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all touch-target mt-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? 'Create New Account'
                    : mode === 'forgot'
                    ? 'Send Reset Link'
                    : 'Sign In to SAGARINFO'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Active Supabase URL status */}
        <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-400">Target Supabase Project:</span>
            <code className="text-cyan-400 font-mono text-[10px] truncate max-w-[200px]">
              {currentSupabaseUrl.replace('https://', '')}
            </code>
          </div>
          <p className="text-[10px] text-slate-400 text-center pt-1">
            Real Supabase Authentication & Row Level Security (RLS) Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
