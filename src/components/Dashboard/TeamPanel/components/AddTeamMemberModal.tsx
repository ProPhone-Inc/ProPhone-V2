import React from 'react';
import { X, User, Mail, Shield, Settings, Send } from 'lucide-react';
import { AssignPermissionsModal } from './AssignPermissionsModal';
import { sendTeamInvite } from '../../../../utils/email';

interface AddTeamMemberModalProps {
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  onAdd: (member: {
    name: string;
    email: string;
    role: string;
    status: string;
    permissions: string[];
  }) => void;
}

export function AddTeamMemberModal({ onClose, modalRef, onAdd }: AddTeamMemberModalProps) {
  const [showPermissions, setShowPermissions] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'member' as 'member' | 'manager' | 'admin',
    permissions: ['dashboard'] // Dashboard permission by default
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const memberData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role, // Use selected role
      permissions: formData.permissions,
      status: 'pending', // Start as pending until user completes registration
      joinDate: new Date().toISOString().split('T')[0]
    };

    try {
      // Send invitation email with account creation link
      await sendTeamInvite(
        formData.email,
        `${formData.firstName} ${formData.lastName}`,
        formData.role,
        formData.permissions
      );
      
      onAdd(memberData);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div 
        ref={modalRef}
        className="relative bg-zinc-900/70 backdrop-blur-xl border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Add Team Member</h3>
            <p className="text-white/60 text-sm">Add a new member to your team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
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
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800/80 backdrop-blur-sm border border-[#B38B3F]/20 rounded-lg text-white focus:border-[#B38B3F]/40 transition-colors"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${formData.role === 'manager' ? 'text-[#FFD700]' : 'text-white/40'}`}>
                <Shield className="h-5 w-5" />
              </div>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 bg-zinc-800/80 backdrop-blur-sm border border-[#B38B3F]/20 rounded-lg text-white focus:border-[#B38B3F]/40 transition-colors ${formData.role === 'manager' ? 'text-[#FFD700]' : ''}`}
              >
                <option value="member">Team Member</option>
                <option value="manager">Team Manager</option>
                {currentUser?.role === 'admin' && <option value="admin">Team Admin</option>}
              </select>
              <p className="mt-1 text-xs text-white/50">
                Team managers can add, edit, and remove team members. Admin panel access is restricted.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/70 text-sm font-medium">Permissions</label>
            <button
              type="button"
              onClick={() => setShowPermissions(true)}
              className="text-[#B38B3F] hover:text-[#FFD700] text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            </div>
            <div className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg p-3">
              {formData.permissions.length === 0 ? (
                <p className="text-white/40 text-sm">No permissions assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.permissions.map(permission => (
                    <span
                      key={permission}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 border border-[#B38B3F]/40 text-[#FFD700] text-xs font-medium"
                    >
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-lg transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Sending Invite...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2" />
                  <span>Send Invitation</span>
                </div>
              )}
            </button>
          </div>
        </form>

        {showPermissions && (
          <AssignPermissionsModal
            permissions={formData.permissions}
            onClose={() => setShowPermissions(false)}
            onSave={(permissions) => {
              setFormData(prev => ({ ...prev, permissions }));
              setShowPermissions(false);
            }}
          />
        )}
      </div>
    </div>
  );
}