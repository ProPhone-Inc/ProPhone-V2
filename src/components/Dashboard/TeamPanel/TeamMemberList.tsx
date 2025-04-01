import React from 'react';
import { PenSquare, Trash2, Shield } from 'lucide-react';

interface TeamMemberListProps {
  members: any[];
  onEdit: (member: any) => void;
  onDelete: (member: any) => void;
}

export function TeamMemberList({ members, onEdit, onDelete }: TeamMemberListProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">Admin</span>;
      case 'manager':
        return <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Manager</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">Member</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Active</span>;
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
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Edit Member"
                  >
                    <PenSquare className="w-4 h-4 text-white/70 group-hover:text-white" />
                  </button>
                  <button
                    onClick={() => onDelete(member)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4 text-red-400/70 group-hover:text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}