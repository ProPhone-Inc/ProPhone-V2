import React, { useState, useRef } from 'react';
import { UserCog, Plus, Search, Filter, PenSquare } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { TeamMemberList } from './components/TeamMemberList';
import { TeamNamePromptModal } from './components/TeamNamePromptModal';
import { AddTeamMemberModal } from './components/AddTeamMemberModal';
import { EditTeamMemberModal } from './components/EditTeamMemberModal';
import { DeleteTeamMemberModal } from './components/DeleteTeamMemberModal';
import { SuspendUserModal } from '../AdminPanel/SuspendUserModal';
import { ReactivateUserModal } from '../AdminPanel/ReactivateUserModal';

interface TeamPanelProps {
  onClose: () => void;
}

export function TeamPanel({ onClose }: TeamPanelProps) {
  const { user, login } = useAuth();
  const [teamName, setTeamName] = useState('My Team');
  const [hasSetTeamName, setHasSetTeamName] = useState(() => {
    const savedTeamName = localStorage.getItem(`teamName_${user?.id}`);
    if (savedTeamName) {
      setTeamName(savedTeamName);
      return true;
    }
    return false;
  });
  
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Team roles
  const isAdmin = user?.role === 'admin' || user?.role === 'owner' || user?.role === 'super_admin';
  const isManager = user?.role === 'manager';
  const canManageTeam = isAdmin || isManager;
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => {
    if (showAddModal) setShowAddModal(false);
    if (showEditModal) setShowEditModal(false);
    if (showDeleteModal) setShowDeleteModal(false);
    if (showSuspendModal) setShowSuspendModal(false);
    if (showReactivateModal) setShowReactivateModal(false);
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: user?.name || 'Team Owner',
      email: user?.email || 'owner@example.com',
      role: 'admin',
      status: 'active',
      permissions: ['phone', 'crm', 'docupro', 'proflow'],
      joinDate: '2025-01-01',
      avatar: user?.avatar
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'member',
      status: 'active', 
      permissions: ['phone', 'crm', 'docupro', 'proflow'],
      joinDate: '2025-03-01'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      role: 'member',
      status: 'active',
      permissions: ['phone', 'crm', 'docupro', 'proflow'],
      joinDate: '2025-03-15'
    }
  ]);

  const handleAddMember = (newMember) => {
    if (!canManageTeam) return;
    
    // Ensure all permissions are set
    const member = {
      ...newMember, 
      id: Math.random().toString(36).substr(2, 9),
      permissions: ['phone', 'crm', 'docupro', 'proflow']
    };
    setTeamMembers([...teamMembers, member]);
    setShowAddModal(false);
  };

  const handleEditMember = (updatedMember) => {
    if (!canManageTeam || updatedMember.role === 'admin') return;
    
    setTeamMembers(teamMembers.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    ));
    setShowEditModal(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = () => {
    if (!canManageTeam || selectedMember?.role === 'admin') return;
    
    setTeamMembers(teamMembers.filter(member => member.id !== selectedMember.id));
    setShowDeleteModal(false);
    setSelectedMember(null);
  };

  const handleUserLogin = (member: any) => {
    if (member.role === 'admin') {
      console.log('Cannot login as team admin');
      return; // Prevent logging in as admin
    }
    
    // Check if current user has permission to login as this member
    if (currentUser?.role === 'manager' && member.role === 'manager') {
      console.log('Managers cannot login as other managers');
      return;
    }
    
    // Create a session object with reference to the admin user
    const sessionUser = {
      id: member.id,
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      role: 'user', // Always set role to user when logging in as member
      originalUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    };
    
    login(sessionUser);
  };

  const confirmSuspendUser = (reason: string) => {
    if (selectedMember) {
      const updatedMember = { 
        ...selectedMember, 
        status: 'suspended',
        suspensionReason: reason,
        suspendedAt: new Date().toISOString()
      };
      setTeamMembers(teamMembers.map(member => 
        member.id === selectedMember.id ? updatedMember : member
      ));
      setShowSuspendModal(false);
      setSelectedMember(null);
    }
  };

  const confirmReactivateUser = () => {
    if (selectedMember) {
      const updatedMember = { ...selectedMember, status: 'active' };
      setTeamMembers(teamMembers.map(member => 
        member.id === selectedMember.id ? updatedMember : member
      ));
      setShowReactivateModal(false);
      setSelectedMember(null);
    }
  };

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {!hasSetTeamName && isAdmin && (
        <TeamNamePromptModal
          onClose={onClose}
          onSubmit={(name) => {
            setTeamName(name);
            localStorage.setItem(`teamName_${user?.id}`, name);
            setHasSetTeamName(true);
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <UserCog className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      onBlur={() => {
                        setIsEditingName(false);
                        localStorage.setItem('teamName', teamName);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditingName(false);
                          localStorage.setItem('teamName', teamName);
                        }
                      }}
                      className="text-2xl font-bold bg-transparent border-b-2 border-[#B38B3F] text-white focus:outline-none focus:border-[#FFD700]"
                      autoFocus
                    />
                  )}
                </div>
              ) : (
                <h1 
                  className="text-2xl font-bold text-white cursor-pointer hover:text-[#B38B3F] transition-colors flex items-center space-x-2"
                  onClick={() => isAdmin && setIsEditingName(true)}
                  title={isAdmin ? "Click to edit team name" : undefined}
                >
                  <span className="group relative">
                    {teamName}
                    {isAdmin && (
                      <PenSquare className="w-4 h-4 ml-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </span>
                </h1>
              )}
            </div>
            <p className="text-white/60">Manage your team members ({teamMembers.length} total) and their permissions</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          disabled={!canManageTeam}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            canManageTeam 
              ? 'bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black hover:shadow-lg hover:shadow-[#B38B3F]/20' 
              : 'bg-white/5 text-white/50 cursor-not-allowed'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-white/40" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2 min-w-[140px]"
          >
            <option value="all">All Roles</option>
            <option value="owner">Team Admin</option>
            <option value="manager">Team Manager</option>
            <option value="member">Member</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Team Member List */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden">
        <TeamMemberList
          members={filteredMembers}
          canManageTeam={canManageTeam}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          onSuspend={(member) => {
            if (member.role === 'owner') return;
            setSelectedMember(member);
            setShowSuspendModal(true);
          }}
          onLogin={handleUserLogin}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTeamMemberModal
          onClose={() => setShowAddModal(false)}
          modalRef={modalRef}
          onAdd={handleAddMember}
        />
      )}

      {showEditModal && selectedMember && (
        <EditTeamMemberModal
          member={selectedMember}
          modalRef={modalRef}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          onSave={handleEditMember}
        />
      )}

      {showDeleteModal && selectedMember && (
        <DeleteTeamMemberModal
          member={selectedMember}
          modalRef={modalRef}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedMember(null);
          }}
          onConfirm={handleDeleteMember}
        />
      )}

      {showSuspendModal && selectedMember && (
        <SuspendUserModal
          user={selectedMember}
          modalRef={modalRef}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={confirmSuspendUser}
        />
      )}

      {showReactivateModal && selectedMember && (
        <ReactivateUserModal
          user={selectedMember}
          modalRef={modalRef}
          onClose={() => setShowReactivateModal(false)}
          onConfirm={confirmReactivateUser}
        />
      )}
    </div>
  );
}