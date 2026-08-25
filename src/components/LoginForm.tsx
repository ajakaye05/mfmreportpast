import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const logo = '/mountain-of-fire-and-miracles-ministry-seeklogo.png';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/reports");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/configuration-not-found') {
        setError("Firebase Auth is starting up or Email/Password is not enabled yet in console.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        setError(err.message || "Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Animated Orbs & Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 to-violet-500/20 rounded-full blur-[120px] pointer-events-none animate-glow" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-glow" style={{ animationDelay: '6s' }} />

      <div className="relative w-full max-w-md">
        
        {/* Glassmorphic Form Card */}
        <form
          onSubmit={handleSubmit}
          className="glass-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10 transition-all duration-300 hover:border-white/20"
        >
          {/* Logo & Header Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="relative mb-4 p-3 bg-white/10 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md">
              <img src={logo} alt="MFM Logo" className="h-16 w-auto object-contain filter drop-shadow-md" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Secure Administrator Portal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Sign in to manage church services & reports
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-pulse-subtle">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="victorpelumi003@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Mountain of Fire and Miracles Ministries &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

