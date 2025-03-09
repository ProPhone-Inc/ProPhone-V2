import React from 'react';
import { X, Phone, Users, FileText, GitMerge } from 'lucide-react';

interface AssignPermissionsModalProps {
  permissions: string[];
  onClose: () => void;
  onSave: (permissions: string[]) => void;
}

export function AssignPermissionsModal({ permissions: initialPermissions, onClose, onSave }: AssignPermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = React.useState(() => {
    // Ensure dashboard permission is always included
    return initialPermissions.includes('dashboard') 
      ? initialPermissions 
      : ['dashboard', ...initialPermissions];
  });

  const availablePermissions = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>,
      required: true
    },
    { id: 'phone', label: 'Phone System', icon: <Phone className="w-5 h-5" /> },
    { id: 'crm', label: 'CRM', icon: <Users className="w-5 h-5" /> },
    { id: 'docupro', label: 'DocuPro', icon: <FileText className="w-5 h-5" /> },
    { id: 'proflow', label: 'ProFlow', icon: <GitMerge className="w-5 h-5" /> }
  ];

  const togglePermission = (permissionId: string) => {
    // Prevent toggling the dashboard permission
    if (permissionId === 'dashboard') return;

    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-black/60 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-sm w-full mx-auto backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4">Assign Permissions</h3>
        <p className="text-white/60 text-sm mb-6">Select the features this team member can access</p>

        <div className="space-y-3 mb-6">
          {availablePermissions.map((permission) => (
            <label
              key={permission.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                permission.required ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                selectedPermissions.includes(permission.id)
                  ? 'bg-[#B38B3F]/20 border border-[#B38B3F]/40 backdrop-blur-md'
                  : 'bg-black/60 border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 backdrop-blur-md'
              }`}
              onClick={() => !permission.required && togglePermission(permission.id)}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                selectedPermissions.includes(permission.id)
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-zinc-700'
              }`}>
                {selectedPermissions.includes(permission.id) && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                  {permission.icon}
                </div>
                <div>
                  <span className="text-white">{permission.label}</span>
                  {permission.required && (
                    <span className="text-[#FFD700] text-xs block">Required</span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedPermissions)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}