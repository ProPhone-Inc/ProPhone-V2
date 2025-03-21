import React from 'react';
import { PenSquare, Trash2, Shield, Ban, LogIn, UserCheck } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';

interface TeamMemberListProps {
  members: any[];
  canManageTeam: boolean;
  onEdit: (member: any) => void;
  onDelete: (member: any) => void;
  onSuspend: (member: any) => void;
  onLogin: (member: any) => void;
}

export function TeamMemberList({ members, canManageTeam, onEdit, onDelete, onSuspend, onLogin }: TeamMemberListProps) {
  const { user: currentUser } = useAuth();
  
  // Check if user has permission to edit
  const canEditMember = React.useCallback((targetMember: any) => {
    if (!currentUser) return false;
    
    // Team admin can edit everyone except themselves
    if (currentUser.role === 'owner' || currentUser.role === 'admin') {
      return targetMember.id !== currentUser.id;
    }
    
    // Team manager can edit regular members but not admin or other managers
    if (currentUser.role === 'manager') {
      return targetMember.role === 'member' && targetMember.role !== 'admin' && targetMember.role !== 'manager';
    }
    
    return false;
  }, [currentUser]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <div className="relative">
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#B38B3F]/20 via-[#FFD700]/20 to-[#B38B3F]/20 text-[#FFD700] text-xs font-medium animate-pulse">
              Admin
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 blur-sm animate-pulse" />
          </div>
        );
      case 'manager':
        return <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Manager</span>;
      case 'member':
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">Member</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-medium">{role}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Active</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium animate-pulse">Pending Activation</span>;
      case 'inactive':
        return <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">Inactive</span>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-4 px-4 text-white/70 font-medium">Member</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Role</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Status</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Permissions</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Join Date</th>
            <th className="text-right py-4 px-4 text-white/70 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-zinc-800/50 hover:bg-white/5">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366F1&color=fff`} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">{member.name}</div>
                    <div className="text-sm text-white/60">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                {getRoleBadge(member.role)}
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(member.status)}
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-2">
                  {member.permissions.map((permission: string) => (
                    <span 
                      key={permission}
                      className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-4 text-white/70">
                {new Date(member.joinDate).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                {member.role !== 'owner' && member.role !== 'super_admin' && (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      disabled={!canEditMember(member)}
                      onClick={() => canEditMember(member) && onEdit(member)}
                      className={`p-2 ${canEditMember(member) ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'} rounded-lg transition-colors group`}
                      title="Edit Member"
                    >
                      <PenSquare className="w-4 h-4 text-white/70 group-hover:text-white" />
                    </button>
                    <button
                      disabled={!canEditMember(member)}
                      onClick={() => canEditMember(member) && onDelete(member)}
                      className={`p-2 ${canEditMember(member) ? 'hover:bg-red-500/20' : 'opacity-50 cursor-not-allowed'} rounded-lg transition-colors group`}
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4 text-red-400/70 group-hover:text-red-400" />
                    </button>
                    {member.status !== 'suspended' && (
                      <button
                        disabled={!canEditMember(member)}
                        onClick={() => canEditMember(member) && onSuspend(member)}
                        className={`p-2 ${canEditMember(member) ? 'hover:bg-amber-500/20' : 'opacity-50 cursor-not-allowed'} rounded-lg transition-colors group`}
                        title="Suspend Member"
                      >
                        <Ban className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400" />
                      </button>
                    )}
                    <button
                      disabled={!canEditMember(member)}
                      onClick={() => canEditMember(member) && onLogin(member)}
                      className={`p-2 ${canEditMember(member) ? 'hover:bg-[#B38B3F]/20' : 'opacity-50 cursor-not-allowed'} rounded-lg transition-colors group`}
                      title="Login as Member"
                    >
                      <LogIn className={`w-4 h-4 ${canEditMember(member) ? 'text-[#B38B3F] group-hover:text-[#FFD700]' : 'text-[#B38B3F]/40'}`} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}