import React, { useState } from 'react';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface CreateUserModalProps {
  onClose: () => void;
  onSave: (user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    status: string;
    joinDate: string;
    lastLogin: string;
    role: 'user' | 'super_admin';
  }) => void;
}

export function CreateUserModal({ onClose, onSave }: CreateUserModalProps) {
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const { user: currentUser } = useAuth();
  const canAssignGodMode = currentUser?.role === 'owner';
  const isExecutiveOrSuperAdmin = currentUser?.role === 'executive' || currentUser?.role === 'super_admin';
  const [formData, setFormData] = React.useState({
    role: 'user' as 'user' | 'super_admin' | 'executive',
    firstName: '',
    lastName: '',
    email: '',
    plan: 'starter',
    status: 'inactive', // Default to inactive until first login
    authMethod: {
      type: 'normal' as const,
      verified: false
    }
  });

  const isOwner = currentUser?.role === 'owner';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent unauthorized role assignments
    if (formData.role === 'owner' || (!canAssignGodMode && (formData.role === 'super_admin' || formData.role === 'executive'))) {
      setError(formData.role === 'owner' 
        ? 'Cannot create owner accounts' 
        : 'Only the platform owner can assign super admin or executive roles');
      return;
    }
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      plan: isExecutiveOrSuperAdmin ? formData.plan : (canAssignGodMode && (formData.role === 'super_admin' || formData.role === 'executive') ? 'god_mode' : formData.plan),
      status: formData.status,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      role: formData.role,
      authMethod: formData.authMethod
    };

    setIsGeneratingPassword(true);
    // Simulate password generation and email sending
    setTimeout(() => {
      setIsGeneratingPassword(false);
      onSave(newUser);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Add New User</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                placeholder="Enter first name"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Last Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Plan</label>
            <select
              name="plan"
              value={formData.plan}
              disabled={!isExecutiveOrSuperAdmin && ((formData.role === 'super_admin' && isOwner) || formData.role === 'executive')}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="starter">Business Starter</option>
              <option value="pro">Business Pro</option>
              <option value="enterprise">Business Elite</option>
            </select>
            {formData.role === 'super_admin' && isOwner && !isExecutiveOrSuperAdmin && (
              <p className="text-xs text-[#FFD700] mt-1">Super Admins get unlimited God Mode access with no restrictions</p>
            )}
            {formData.role === 'executive' && !isExecutiveOrSuperAdmin && (
              <p className="text-xs text-[#FFD700] mt-1">Executives get unlimited God Mode access with no restrictions</p>
            )}
          </div>
          
          <p className="text-sm text-white/50 italic">
            User account will be inactive until their first login, which will start their 30-day activity period.
          </p>

          {isOwner && <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${currentUser?.role === 'owner' ? 'text-[#FFD700]' : 'text-[#FFD700]/40'}`}>
                <Shield className="h-5 w-5" />
              </div>
              <select
                name="role"
                value={formData.role}
                disabled={!canAssignGodMode}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value as 'user' | 'super_admin' | 'executive' });
                }}
                className={`w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg ${currentUser?.role === 'owner' ? 'text-white' : 'text-white/40'}`}
              >
                <option value="user">User</option>
                {canAssignGodMode && (
                  <>
                    <option value="executive">Executive</option>
                    <option value="super_admin">Super Admin</option>
                  </>
                )}
              </select>
            </div>
            {!canAssignGodMode && (
              <p className="text-xs text-red-400 mt-1">Only the platform owner can manage super admin accounts</p>
            )}
          </div>}

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="text"
                disabled
                className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-[#B38B3F]/20 rounded-lg text-white/50"
                placeholder="Auto-generated secure password"
              />
            </div>
            <p className="text-xs text-white/50 mt-1">A secure password will be generated and sent to the user's email</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeneratingPassword}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isGeneratingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Creating User...</span>
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}