import React, { useState, useEffect } from 'react';
import { Shield, Plus, CreditCard, Bell, Mail, Bot, BarChart2 } from 'lucide-react';
import { UserStats } from './UserStats';
import { UserTable } from './UserTable';
import { UserEditModal } from './UserEditModal';
import { BanListModal } from './BanListModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CreateUserModal } from './CreateUserModal';
import { useAuth } from '../../../hooks/useAuth';
import { SuspendUserModal } from './SuspendUserModal';
import { BanUserModal } from './BanUserModal';
import { ReportingModal } from './ReportingModal';
import { ReactivateUserModal } from './ReactivateUserModal';
import { StripeBillingModal } from './StripeBillingModal';
import { NotificationsModal } from './NotificationsModal';
import { CopilotSettingsModal } from './CopilotSettingsModal';
import { AISettingsModal } from './AISettingsModal';
import { sendSuspensionEmail } from '../../../utils/email';
import { mockUsers } from './mockData';
import axios from "axios";

function AdminPanel() {
  const { user: currentUser } = useAuth();
  
  // Redirect if not authorized
  React.useEffect(() => {
    if (currentUser?.role !== 'owner' && currentUser?.role !== 'super_admin') {
      window.location.href = '/dashboard';
    }
  }, [currentUser]);

  // Don't render anything if not authorized
  if (currentUser?.role !== 'owner' && currentUser?.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <Shield className="w-16 h-16 text-[#B38B3F]/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-white/60 max-w-md">
          The Super Admin Panel is only available to Super Admins and the Platform Owner.
        </p>
      </div>
    );
  }

  const [users, setUsers] = useState([]);
  // const [users, setUsers] = useState([...mockUsers]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { login } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showBanList, setShowBanList] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReportingModal, setShowReportingModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<{message: string, type: string} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
  
      // const token = JSON.parse(authUser);
      // const token = parsed?.token;
      if (!token) return;
  
      try {
        const res = await axios.get("/api/auth/fetch-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
        
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
  
    fetchUsers();
  }, []);
  // User statistics
  const userStats = {
    total: users.filter(user => !['owner', 'super_admin'].includes(user.role)).length,
    adsDisabled: users.filter(user => !user.showAds && !['owner', 'super_admin'].includes(user.role)).length,
    subUsers: users.filter(user => user.role === 'sub_user' && !['owner', 'super_admin'].includes(user.role)).length,
    monthlyRevenue: calculateMonthlyRevenue(users),
    admin: users.filter(user => user.role === 'admin' || user.role === 'owner' || user.role === 'super_admin' || user.role === 'executive').length
  };

  // Calculate monthly revenue from subscriptions
  function calculateMonthlyRevenue(users: any[]): number {
    let revenue = 0;
    
    // Add revenue from ad-free subscriptions ($10/month)
    revenue += users.filter(user => 
      user.adFreeSubscription?.active && 
      !['owner', 'super_admin', 'admin'].includes(user.role)
    ).length * 10;
    
    // Add revenue from sub-users ($5/month per sub-user)
    revenue += users.filter(user => 
      user.role === 'sub_user' && 
      !['owner', 'super_admin'].includes(user.role)
    ).length * 5;
    
    return revenue;
  }

  // Apply filters
  useEffect(() => {
    let result = [...users];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    if (planFilter !== 'all') {
      result = result.filter(user => user.plan === planFilter);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchQuery, statusFilter, planFilter]);

  const handleEditUser = (user: any) => {
    if (user.role === 'owner' || 
        (user.role === 'super_admin' && currentUser?.role !== 'owner') ||
        (user.role === 'executive' && currentUser?.role === 'executive')) {
      setActionSuccess({ 
        message: user.role === 'owner' 
          ? 'Cannot modify owner account' 
          : user.role === 'super_admin' 
            ? 'Cannot modify super admin accounts'
            : 'Executives cannot modify other executive accounts',
        type: 'error' 
      });
      return;
    }
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: any) => {
    if (user.role === 'owner' || 
        (user.role === 'super_admin' && currentUser?.role !== 'owner') ||
        (user.role === 'executive' && currentUser?.role === 'executive')) {
      setActionSuccess({ 
        message: user.role === 'owner' 
          ? 'Cannot delete owner account' 
          : user.role === 'super_admin' 
            ? 'Cannot delete super admin accounts'
            : 'Executives cannot delete other executive accounts',
        type: 'error' 
      });
      return;
    }
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSuspendUser = (user: any) => {
    if (user.role === 'owner') {
      setActionSuccess({ 
        message: 'Owner account cannot be suspended',
        type: 'error' 
      });
      return;
    }
    // If suspension is due to failed payment, handle it directly
    if (user.billingStatus === 'failed') {
      const updatedUser = { 
        ...user, 
        status: 'suspended',
        suspensionReason: 'Payment Issue',
        suspendedAt: new Date().toISOString()
      };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      sendSuspensionEmail(user.email, 'Payment Issue')
        .then(() => {
          showSuccessMessage(`User has been suspended due to failed payment and notified via email`, 'suspend');
        })
        .catch(error => {
          console.error('Failed to send suspension email:', error);
          showSuccessMessage(`User has been suspended but email notification failed`, 'error');
        });
      return;
    }
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleBanUser = (user: any) => {
    if (user.role === 'owner') {
      setActionSuccess({ 
        message: 'Owner account cannot be banned',
        type: 'error' 
      });
      return;
    }
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const confirmBanUser = (reason: string) => {
    if (selectedUser) {
      // Remove the user from the list (delete their account)
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowBanModal(false);
      showSuccessMessage(`User has been banned and their account has been deleted`, 'ban');
    }
  };

  const handleReactivateUser = (user: any) => {
    setSelectedUser(user);
    setShowReactivateModal(true);
  };

  const confirmSuspendUser = (reason: string) => {
    if (selectedUser) {
      const updatedUser = { 
        ...selectedUser, 
        status: 'suspended',
        suspensionReason: reason,
        suspendedAt: new Date().toISOString()
      };
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      setShowSuspendModal(false);
      showSuccessMessage(`User has been suspended and notified via email`, 'suspend');
    }
  };

  const confirmReactivateUser = () => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, status: 'active' };
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      setShowReactivateModal(false);
      showSuccessMessage('User has been reactivated', 'update');
    }
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      showSuccessMessage('User deleted successfully', 'delete');
    }
  };

  const saveEditedUser = (editedUser: any) => {
    setUsers(users.map(user => user.id === editedUser.id ? editedUser : user));
    setShowEditModal(false);
    showSuccessMessage('User updated successfully', 'update');
  };

  const saveNewUser = (newUser: any) => {
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    showSuccessMessage('User created successfully', 'create');
  };

  const showSuccessMessage = (message: string, type: string) => {
    setActionSuccess({ message, type });
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleUserLogin = (user: any) => {
    const isOwner = currentUser?.role === 'owner';
    const isSuperAdmin = currentUser?.role === 'super_admin';
    const isExecutive = currentUser?.role === 'executive';
    const isTargetOwner = user.role === 'owner';
    const isTargetSuperAdmin = user.role === 'super_admin';
    const isTargetExecutive = user.role === 'executive';

    // Prevent super admins from logging in as other super admins or owner
    if (isSuperAdmin && (isTargetSuperAdmin || isTargetOwner)) {
      setActionSuccess({ 
        message: 'Super admins cannot login as other super admins or the platform owner', 
        type: 'error' 
      });
      return;
    }

    // Prevent executives from logging in as other executives, super admins, or owner
    if (isExecutive && (isTargetExecutive || isTargetSuperAdmin || isTargetOwner)) {
      setActionSuccess({
        message: 'Executives cannot login as other executives, super admins, or the platform owner',
        type: 'error'
      });
      return;
    }

    // Prevent anyone from logging in as owner
    if (isTargetOwner) {
      setActionSuccess({
        message: 'Cannot login as platform owner',
        type: 'error'
      });
      return;
    }
    
    // Create a session object with reference to the admin user
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan,
      role: 'user',
      originalUser: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        avatar: currentUser.avatar,
        loginOrigin: 'admin_panel'
      }
    };
    
    // Store the session user in localStorage directly
    localStorage.setItem('auth_user', JSON.stringify(sessionUser));
    
    // Set auth token (in a real app this would come from the backend)
    localStorage.setItem('auth_token', 'test-token-' + Math.random().toString(36).substr(2));
    
    // Force redirect to dashboard
    window.location.href = '/dashboard';
    
    showSuccessMessage(`Logged in as ${user.name}`, 'update');
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  // alert(currentUsers)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="space-y-6">
      {showEditModal && selectedUser && (
        <UserEditModal 
          user={selectedUser} 
          onClose={() => setShowEditModal(false)} 
          onSave={saveEditedUser} 
        />
      )}
      
      {showCreateModal && (
        <CreateUserModal 
          onClose={() => setShowCreateModal(false)} 
          onSave={saveNewUser} 
        />
      )}
      
      {showDeleteModal && selectedUser && (
        <DeleteConfirmModal 
          user={selectedUser} 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={confirmDeleteUser} 
        />
      )}

      {showSuspendModal && selectedUser && (
        <SuspendUserModal
          user={selectedUser}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={confirmSuspendUser}
        />
      )}

      {showBanModal && selectedUser && (
        <BanUserModal
          user={selectedUser}
          onClose={() => setShowBanModal(false)}
          onConfirm={confirmBanUser}
        />
      )}

      {showReactivateModal && selectedUser && (
        <ReactivateUserModal
          user={selectedUser}
          onClose={() => setShowReactivateModal(false)}
          onConfirm={confirmReactivateUser}
        />
      )}

      {showBanList && (
        <BanListModal onClose={() => setShowBanList(false)} />
      )}
      
      {showBillingModal && (
        <StripeBillingModal onClose={() => setShowBillingModal(false)} />
      )}
      
      {showBillingModal && (
        <StripeBillingModal onClose={() => setShowBillingModal(false)} />
      )}
      
      {showAISettings && (
        <AISettingsModal onClose={() => setShowAISettings(false)} />
      )}

      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)} 
          onOpenEmailTemplates={() => {
            setShowNotifications(false);
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <Shield className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Platform User Management</h1>
            <p className="text-white/60">Manage all users across the entire ProPhone platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {currentUser?.role === 'owner' && (
                <button 
                  onClick={() => setShowBanList(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/10 text-[#FFD700] px-4 py-2 rounded-xl font-medium border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/20 transition-all duration-300"
                >
                  <Shield className="w-5 h-5" />
                  <span>Ban List</span>
                </button>
              )}
              {currentUser?.role === 'owner' && (
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/10 text-[#FFD700] px-4 py-2 rounded-xl font-medium border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/20 transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
              )}
              {currentUser?.role === 'owner' && (
                <button 
                  onClick={() => setShowReportingModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/10 text-[#FFD700] px-4 py-2 rounded-xl font-medium border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/20 transition-all duration-300"
                >
                  <BarChart2 className="w-5 h-5" />
                  <span>Reports</span>
                </button>
              )}
              {currentUser?.role === 'owner' && (
                <button 
                  onClick={() => setShowBillingModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#635BFF]/20 to-[#635BFF]/10 text-[#635BFF] px-4 py-2 rounded-xl font-medium border border-[#635BFF]/20 hover:border-[#635BFF]/40 hover:shadow-lg hover:shadow-[#635BFF]/20 transition-all duration-300"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Stripe Billing</span>
                </button>
              )}
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-[#B38B3F]/20 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add User</span>
                </button>
              </div>
        </div>
      </div>
      
      {/* User Stats */}
      <UserStats
        totalUsers={userStats.total}
        adsDisabledUsers={userStats.adsDisabled}
        subUserCount={userStats.subUsers}
        monthlyRevenue={userStats.monthlyRevenue}
        adminUsers={userStats.admin}
      />
      
      {/* Success message */}
      {actionSuccess && (
        <div className={`
          p-4 rounded-lg flex items-center justify-between
          ${actionSuccess.type === 'delete' 
            ? 'bg-red-500/20 border border-red-500/30' 
            : actionSuccess.type === 'update' 
              ? 'bg-blue-500/20 border border-blue-500/30'
              : actionSuccess.type === 'error' 
                ? 'bg-red-500/20 border border-red-500/30' 
                : 'bg-emerald-500/20 border border-emerald-500/30'
          }
        `}>
          <span className="text-white/70">{actionSuccess.message}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
        >
          <option value="all">All Plans</option>
          <option value="starter">Starter</option>
          <option value="pro">Professional</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden">
        <UserTable
          users={currentUsers}
          onSuspend={(user) => handleSuspendUser(user)}
          onReactivate={(user) => handleReactivateUser(user)}
          onBan={(user) => handleBanUser(user)}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          login={handleUserLogin}
        />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white/70">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Reporting Modal */}
      {showReportingModal && (
        <ReportingModal onClose={() => setShowReportingModal(false)} />
      )}
    </div>
  );
}

export { AdminPanel };