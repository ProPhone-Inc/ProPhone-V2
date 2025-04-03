import React from 'react';
import { User, Mail, Phone, Camera, Lock, Facebook } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';

interface ProfileSectionProps {
  userData: any;
  setUserData: (data: any) => void;
}

export function ProfileSection({ userData, setUserData }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: userData?.name?.split(' ')[0] || '',
    lastName: userData?.name?.split(' ')[1] || '',
    email: userData?.email || '',
    phone: userData?.phone || ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone format (optional)
      if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUserData = {
        ...userData,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      };

      setUserData(updatedUserData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsEditing(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-[#FFD700]" />
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#B38B3F] text-black flex items-center justify-center hover:bg-[#FFD700] transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{userData?.name}</h3>
            <p className="text-white/60">{userData?.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                required
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
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Profile updated successfully!
          </div>
        )}

        {/* Form Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </form>

      {/* Security Section */}
      <div className="border-t border-[#B38B3F]/20 pt-8">
        <h3 className="text-lg font-bold text-white mb-6">Security</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">Password</div>
                <div className="text-sm text-white/60">Last changed 3 months ago</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              Change Password
            </button>
          </div>
          
          <h4 className="text-white/70 text-sm font-medium mt-6 mb-3">Connected Accounts</h4>
          
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <div className="w-5 h-5 relative">
                  <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-medium text-white">Google</div>
                <div className="text-sm text-white/60">
                  {userData?.googleConnected ? 'Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              {userData?.googleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
              </div>
              <div>
                <div className="font-medium text-white">Facebook</div>
                <div className="text-sm text-white/60">
                  {userData?.facebookConnected ? 'Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              {userData?.facebookConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}