import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface UserEditModalProps {
  user: any;
  onClose: () => void;
  onSave: (user: any) => void;
}

export function UserEditModal({ user, onClose, onSave }: UserEditModalProps) {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const canAssignGodMode = currentUser?.role === 'owner';
  const isExecutiveOrSuperAdmin = currentUser?.role === 'executive' || currentUser?.role === 'super_admin';
  const isEditingOwner = user.role === 'owner';
  const isEditingSuperAdmin = user.role === 'super_admin';
  const isEditingExecutive = user.role === 'executive';

  // Prevent editing if:
  // 1. Editing owner account and not the owner
  // 2. Super admin trying to edit another super admin
  // 3. Non-owner trying to edit super admin or executive
  if ((isEditingOwner && !canAssignGodMode) || 
      (!canAssignGodMode && (isEditingSuperAdmin || isEditingExecutive))) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-zinc-900 border border-red-500/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-white mb-4">Permission Denied</h3>
          
          <p className="text-white/70 mb-6">
            {isEditingOwner 
              ? "Only the platform owner can edit their own account."
              : "Only the platform owner can edit super admin and executive accounts."}
          </p>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent modifying owner role
    if (editedUser.role === 'owner' || (!canAssignGodMode && (editedUser.role === 'super_admin' || editedUser.role === 'executive'))) {
      setError(editedUser.role === 'owner' 
        ? 'Cannot modify owner account' 
        : 'Only the platform owner can assign super admin or executive roles');
      return;
    }
    
    const updatedUser = {
      ...editedUser,
      plan: isExecutiveOrSuperAdmin ? editedUser.plan : (canAssignGodMode && (editedUser.role === 'super_admin' || editedUser.role === 'executive') ? 'god_mode' : editedUser.plan)
    };
    
    onSave(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Edit User</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Plan</label>
            <select
              name="plan"
              value={editedUser.plan}
              disabled={editedUser.role === 'super_admin' || editedUser.role === 'executive'}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="starter">Business Starter</option>
              <option value="pro">Business Pro</option>
              <option value="enterprise">Business Elite</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={editedUser.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            {editedUser.status === 'suspended' && (
              <p className="text-xs text-amber-400/70 mt-1">
                Suspended users cannot access their account until reactivated
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={editedUser.role}
              disabled={user.role === 'owner'}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="user">User</option>
              <option value="executive">Executive</option>
              <option value="super_admin">Super Admin</option>
            </select>
            {user.role === 'owner' && (
              <p className="text-xs text-red-400 mt-1">Owner account role cannot be modified</p>
            )}
          </div>

          {editedUser.role === 'super_admin' && (
            <p className="text-xs text-[#FFD700] mt-1">Super Admins automatically get God Mode access</p>
          )}
          {editedUser.role === 'executive' && (
            <p className="text-xs text-[#FFD700] mt-1">Executives automatically get God Mode access</p>
          )}

          {error && (
            <div className="text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}