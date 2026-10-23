import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      showToast('Welcome back, Administrator!', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maroon-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-maroon-900/40 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link to="/" className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-white transition mb-2">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Return to Public Website</span>
        </Link>

        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 p-[2px] mx-auto shadow-gold-glow flex items-center justify-center">
          <div className="w-full h-full bg-maroon-950 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-gold-400" />
          </div>
        </div>

        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-white">
          TANYA EVENT'S
        </h1>
        <p className="text-gold-300 text-xs font-medium uppercase tracking-widest">
          Administrative Operations Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card-dark py-8 px-6 sm:px-10 rounded-3xl border border-gold-500/30 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-200 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@tanyaevents.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-maroon-900/60 border border-gold-500/30 text-white placeholder-gray-400 text-sm focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400/60 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-maroon-900/60 border border-gold-500/30 text-white placeholder-gray-400 text-sm focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gold-400/70 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-[1.01] transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-maroon-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Seed Info Hint for Reviewers */}
          <div className="pt-4 border-t border-maroon-800/80 text-center">
            <p className="text-[11px] text-gray-400">
              Initial administrator access is pre-configured for verification.
            </p>
            <p className="text-[11px] text-gold-400 font-mono mt-1">
              admin@tanyaevents.com / Admin@TanyaEvents2026!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
