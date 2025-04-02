import { useAuth } from '../../hooks/useAuth';
import { Shield } from 'lucide-react';
import { AdminPanel } from './AdminPanel';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  // Check if user has permission to access admin panel
  const hasAccess = user?.role === 'owner' || user?.role === 'super_admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-7xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">Super Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {hasAccess ? (
            <AdminPanel />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
              <Shield className="w-16 h-16 text-[#B38B3F]/50 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
              <p className="text-white/60 max-w-md">
                The Super Admin Panel is only available to Super Admins and the Platform Owner.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}