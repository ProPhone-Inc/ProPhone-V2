import React from 'react';
import { Moon, Sun, Monitor, Layout, Palette } from 'lucide-react';

export function AppearanceSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Appearance</h2>
        <span className="px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-medium">
          Beta
        </span>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Palette className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Theme</h3>
              <p className="text-sm text-white/60">Choose your preferred theme</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor }
            ].map(theme => (
              <label
                key={theme.id}
                className="relative flex flex-col items-center p-4 bg-zinc-900/50 rounded-lg border border-[#B38B3F]/20 cursor-pointer hover:border-[#B38B3F]/40 transition-colors"
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  className="sr-only"
                  defaultChecked={theme.id === 'dark'}
                />
                <theme.icon className="w-6 h-6 text-[#FFD700] mb-2" />
                <span className="text-white font-medium">{theme.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Layout Settings */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Layout className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Layout</h3>
              <p className="text-sm text-white/60">Customize your interface layout</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'sidebar', label: 'Sidebar', description: 'Show/hide the sidebar' },
              { id: 'compact', label: 'Compact Mode', description: 'Use a more compact layout' },
              { id: 'animations', label: 'Animations', description: 'Enable interface animations' }
            ].map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-white">{setting.label}</div>
                  <div className="text-sm text-white/60">{setting .description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
              <Palette className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-medium text-white">Custom Colors</h3>
              <p className="text-sm text-white/60">Personalize your color scheme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <label className="block text-white/70 text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  defaultValue="#B38B3F"
                  className="w-8 h-8 rounded bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#B38B3F"
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <label className="block text-white/70 text-sm font-medium mb-2">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  defaultValue="#FFD700"
                  className="w-8 h-8 rounded bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#FFD700"
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}