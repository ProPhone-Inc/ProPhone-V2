import React from 'react';
import { MoreHorizontal, PenSquare, Trash2, Ban, UserCheck, LogIn, ShieldBan } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth.ts';
import { isUserInactive } from '../../../utils/user';

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onSuspend: (user: any) => void;
  onBan: (user: any) => void;
  onReactivate: (user: any) => void;
  login: (user: any) => void;
}

export function UserTable({ users, onEdit, onDelete, onSuspend, onBan, onReactivate, login }: UserTableProps) {
  const { user: currentUser } = useAuth();
  
  // Check if user has permission to edit
  const canEditUser = React.useCallback((targetUser: any) => {
    if (!currentUser) return false;
    
    const isOwner = currentUser.role === 'owner';
    const isSuperAdmin = currentUser.role === 'super_admin';
    const isExecutive = currentUser.role === 'executive';
    const isEditingOwner = targetUser.role === 'owner';
    const isEditingSuperAdmin = targetUser.role === 'super_admin';
    const isEditingExecutive = targetUser.role === 'executive';

    // Owner can edit anyone except themselves
    if (isOwner) return !isEditingOwner;
    
    // Super admins can't edit owner or other super admins
    if (isSuperAdmin && (isEditingOwner || isEditingSuperAdmin)) return false;

    // Executives can't edit owner, super admins, or other executives
    if (isExecutive && (isEditingOwner || isEditingSuperAdmin || isEditingExecutive)) return false;
    
    return true;
  }, [currentUser]);

  // Check if user should be marked as inactive
  React.useEffect(() => {
    const updatedUsers = users.map(user => {
      if (isUserInactive(user.lastLogin) && user.status === 'active') {
        return { ...user, status: 'inactive' };
      }
      return user;
    });
    
    // Only update if there are changes
    if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
      onEdit(updatedUsers.find(u => isUserInactive(u.lastLogin) && u.status === 'active'));
    }
  }, [users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner': 
        return (
          <div className="relative">
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#FFD700]/20 via-[#FFD700]/40 to-[#FFD700]/20 text-[#FFD700] text-xs font-medium animate-pulse">
              Platform Owner
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/10 to-[#B38B3F]/0 blur-sm animate-pulse" />
          </div>
        );
      case 'super_admin':
        return (
          <div className="relative">
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#B38B3F]/20 via-[#FFD700]/20 to-[#B38B3F]/20 text-[#FFD700] text-xs font-medium">
              Super Admin
            </span>
          </div>
        );
      case 'executive':
        return <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">Executive</span>;
      case 'user':
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">User</span>;
      case 'sub_user':
        return <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-medium">Sub User</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-zinc-500/20 text-zinc-400 text-xs font-medium">{role}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Active</span>;
      case 'suspended':
        return <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium animate-pulse">Suspended</span>;
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
          <tr className="border-b border-[#B38B3F]/20">
            <th className="text-left py-4 px-4 text-white/70 font-medium">User</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Role</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Status</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Plan</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Join Date</th>
            <th className="text-left py-4 px-4 text-white/70 font-medium">Last Login</th>
            <th className="text-right py-4 px-4 text-white/70 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[#B38B3F]/10 hover:bg-white/5">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=B38B3F&color=fff`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-white/60">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                {getRoleBadge(user.role)}
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(user.status)}
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.plan === 'enterprise' 
                    ? 'bg-purple-500/20 text-purple-400'
                    : user.plan === 'pro'
                    ? 'bg-blue-500/20 text-blue-400'
                    : user.plan === 'team'
                    ? 'bg-gray-500/20 text-gray-400'
                    : user.plan === 'god_mode'
                    ? 'bg-[#FFD700]/20 text-[#FFD700]'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {user.plan === 'god_mode'
                    ? 'God Mode'
                    : user.plan === 'enterprise' 
                    ? 'Business Elite'
                    : user.plan === 'pro'
                    ? 'Business Pro' 
                    : user.plan === 'team'
                    ? 'Team'
                    : 'Business Starter'}
                </span>
              </td>
              <td className="py-4 px-4 text-white/70">{user.joinDate}</td>
              <td className="py-4 px-4 text-white/70">{new Date(user.lastLogin).toLocaleDateString()}</td>
              <td className="py-4 px-4">
                {user.role !== 'owner' && user.role !== 'super_admin' && (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      disabled={!canEditUser(user)}
                      onClick={() => onEdit(user)}
                      className={`p-2 ${canEditUser(user) ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'} rounded-lg transition-colors group`}
                      title="Edit Member"
                    >
                      <PenSquare className="w-4 h-4 text-white/70 group-hover:text-white" />
                    </button>
                    <button
                      disabled={!canEditUser(user)}
                      onClick={() => onDelete(user)}
                      className={`p-2 ${canEditUser(user) ? 'hover:bg-red-500/20' : 'opacity-50 cursor-not-allowed'} rounded-lg transition-colors group`}
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4 text-red-400/70 group-hover:text-red-400" />
                    </button>
                    {user.status !== 'suspended' ? (
                      <button
                        onClick={() => onBan(user)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                        title="Ban User"
                      >
                        <ShieldBan className="w-4 h-4 text-red-400/70 group-hover:text-red-400" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onReactivate(user)}
                        className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors group"
                        title="Reactivate User"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400" />
                      </button>
                    )}
                    <button
                      onClick={() => login(user)}
                      disabled={user.role === 'super_admin' && currentUser?.role !== 'owner'}
                      className="p-2 hover:bg-[#B38B3F]/20 rounded-lg transition-colors group"
                      title="Login as User"
                    >
                      <LogIn className={`w-4 h-4 ${user.role === 'super_admin' && currentUser?.role !== 'owner' ? 'text-[#B38B3F]/40' : 'text-[#B38B3F] group-hover:text-[#FFD700]'}`} />
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