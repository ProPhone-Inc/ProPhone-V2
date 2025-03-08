import React from 'react';
import { Save, Download, Share2, Users, Settings, ChevronLeft, Plus } from 'lucide-react';

interface DocumentEditorProps {
  onBack: () => void;
  onSave: () => void;
}

export function DocumentEditor({ onBack, onSave }: DocumentEditorProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <input
              type="text"
              defaultValue="Untitled Document"
              className="bg-transparent text-white text-lg font-medium focus:outline-none focus:border-b-2 focus:border-[#FFD700]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Editor Area */}
        <div className="flex-1 p-8 bg-zinc-900/50">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl min-h-[1000px] p-8">
            {/* Document content goes here */}
            <div className="space-y-4">
              <h1 contentEditable className="text-3xl font-bold text-gray-900 outline-none border-b-2 border-transparent focus:border-[#FFD700] transition-colors">
                Document Title
              </h1>
              <p contentEditable className="text-gray-700 outline-none">
                Start typing your document content here...
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-[#B38B3F]/20 bg-zinc-900/70 p-4">
          <div className="space-y-6">
            {/* Recipients */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Recipients</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-[#B38B3F]/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#B38B3F]/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">John Smith</div>
                      <div className="text-xs text-white/60">john@example.com</div>
                    </div>
                  </div>
                  <button className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                    Edit
                  </button>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-zinc-800 rounded-lg border border-[#B38B3F]/20 hover:bg-zinc-700 transition-colors text-white/70 hover:text-white">
                  <Plus className="w-4 h-4" />
                  <span>Add Recipient</span>
                </button>
              </div>
            </div>

            {/* Document Settings */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Settings</h3>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-800 rounded-lg border border-[#B38B3F]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white">Require all signatures</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                    </label>
                  </div>
                </div>
                <div className="p-3 bg-zinc-800 rounded-lg border border-[#B38B3F]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white">Send email notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}