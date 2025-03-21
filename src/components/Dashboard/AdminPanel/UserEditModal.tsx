import React from 'react';
import { X, User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface UserEditModalProps {
  member: any;
  onClose: () => void;
  onSave: (member: any) => void;
}

export function UserEditModal({ member, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = React.useState({
    ...member
  });
  const [error, setError] = React.useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const canAssignGodMode = currentUser?.role === 'owner';
  const isExecutiveOrSuperAdmin = currentUser?.role === 'executive' || currentUser?.role === 'super_admin';
  const isEditingOwner = member.role === 'owner';
  const isEditingSuperAdmin = member.role === 'super_admin';
  const isEditingExecutive = member.role === 'executive';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate role changes
    if (formData.role === 'owner' || (!canAssignGodMode && (formData.role === 'super_admin' || formData.role === 'executive'))) {
      setError(formData.role === 'owner' 
        ? 'Cannot modify owner account' 
        : 'Only the platform owner can assign super admin or executive roles');
      return;
    }
    
    // Set plan based on role
    let plan = formData.plan;
    if (formData.role === 'owner' || formData.role === 'super_admin' || formData.role === 'executive') {
      plan = 'god_mode';
    }
    
    const updatedUser = {
      ...formData,
      plan
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                required
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
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-white/40" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              >
                <option value="sub_user">Sub User</option>
                <option value="user">User</option>
                {canAssignGodMode && (
                  <>
                    <option value="executive">Executive</option>
                    <option value="super_admin">Super Admin</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Plan</label>
            <select
              name="plan"
              value={formData.plan}
              disabled={formData.role === 'owner' || formData.role === 'super_admin' || formData.role === 'executive'}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="starter">Business Starter</option>
              <option value="pro">Business Pro</option>
              <option value="enterprise">Business Elite</option>
              {(formData.role === 'owner' || formData.role === 'super_admin' || formData.role === 'executive') && (
                <option value="god_mode">God Mode</option>
              )}
            </select>
            {(formData.role === 'owner' || formData.role === 'super_admin' || formData.role === 'executive') && (
              <p className="text-xs text-[#FFD700] mt-1">
                {formData.role === 'owner' ? 'Platform Owner' : formData.role === 'super_admin' ? 'Super Admin' : 'Executive'} accounts automatically get God Mode access
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

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