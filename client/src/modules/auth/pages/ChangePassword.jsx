import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../state/auth-store';
import { changePassword as apiChangePassword } from '../services/auth.services';

const ChangePassword = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Field visibilities
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // If not logged in, redirect to login page
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // If user does not need to change password, redirect to dashboard
  if (!user.mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  const isPasswordValid = newPassword.length >= 8;
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword !== '';
  const canSubmit = isPasswordValid && doPasswordsMatch && currentPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      await apiChangePassword({
        currentPassword,
        newPassword,
      });

      toast.success('Password updated successfully!');
      
      // Update state in Zustand store
      useAuthStore.setState({
        user: {
          ...user,
          mustChangePassword: false,
        },
      });

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 
        'Failed to change password. Please check your current password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck size={36} className="stroke-[1.5]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Secure Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          Welcome! You are logging in for the first time. Please update your temporary password to secure your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Temporary Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Temporary Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  newPassword.length === 0 
                    ? 'bg-gray-200' 
                    : newPassword.length < 8 
                    ? 'bg-red-400' 
                    : 'bg-emerald-500'
                }`} />
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="mt-1 text-xs text-red-500 font-medium">Password must be at least 8 characters long.</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">Passwords do not match.</p>
              )}
              {confirmPassword.length > 0 && doPasswordsMatch && (
                <p className="mt-1.5 text-xs text-emerald-600 font-medium flex items-center gap-1">
                  ✓ Passwords match!
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Change Password</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
