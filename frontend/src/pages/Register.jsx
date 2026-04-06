import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => clearError();
  }, [isAuthenticated]);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (name === 'password') setPasswordStrength(getPasswordStrength(value));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(form.name, form.email, form.password, form.phone);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow">
              <span className="text-white text-2xl">✈</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join Travel Sparsh for free — no credit card required</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-5 text-red-600 dark:text-red-400 text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                autoComplete="name"
                className={`input-field ${errors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`input-field ${errors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone Number <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className={`input-field pr-11 ${errors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                >
                  {showPass ? '👁' : '🙈'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              {/* Strength indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-500', 'text-emerald-500'][passwordStrength]}`}>
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`input-field pr-11 ${errors.confirmPassword ? 'border-red-400 ring-1 ring-red-400' : form.confirmPassword && form.confirmPassword === form.password ? 'border-green-400 ring-1 ring-green-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                >
                  {showConfirmPass ? '👁' : '🙈'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              {!errors.confirmPassword && form.confirmPassword && form.confirmPassword === form.password && (
                <p className="text-green-500 text-xs mt-1">✓ Passwords match</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500 flex-shrink-0"
                />
                <label htmlFor="agreeTerms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">What you get for free:</p>
            <div className="grid grid-cols-2 gap-2">
              {['✓ Track travel enquiries', '✓ Exclusive expert quotes', '✓ Manage your travel profile', '✓ 24/7 expert support'].map((b) => (
                <div key={b} className="text-xs text-slate-600 dark:text-slate-400 font-medium">{b}</div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in →
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
