import React from 'react';
import { X, Plus, PenSquare, Trash2, Check } from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  stages: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface PipelineModalProps {
  onClose: () => void;
  onSave: (pipeline: Pipeline) => void;
  currentPipeline?: Pipeline;
}

export function PipelineModal({ onClose, onSave, currentPipeline }: PipelineModalProps) {
  const [pipelineName, setPipelineName] = React.useState(currentPipeline?.name || '');
  const [stages, setStages] = React.useState(currentPipeline?.stages || [
    { id: 'new', name: 'New Leads', color: '#4285f4' },
    { id: 'hot', name: 'Hot', color: '#ea4335' },
    { id: 'warm', name: 'Warm', color: '#fbbc05' },
    { id: 'follow-up', name: 'Follow Up', color: '#9334ea' },
    { id: 'prospecting', name: 'Prospecting', color: '#2196f3' }
  ]);
  const [editingStageId, setEditingStageId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pipelineName.trim()) {
      setError('Pipeline name is required');
      return;
    }

    if (stages.length < 2) {
      setError('Pipeline must have at least 2 stages');
      return;
    }

    const pipeline: Pipeline = {
      id: currentPipeline?.id || Math.random().toString(36).substring(7),
      name: pipelineName.trim(),
      stages
    };

    onSave(pipeline);
  };

  const handleAddStage = () => {
    const newStage = {
      id: Math.random().toString(36).substring(7),
      name: 'New Stage',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setStages([...stages, newStage]);
    setEditingStageId(newStage.id);
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const handleStageNameChange = (stageId: string, newName: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, name: newName } : stage
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h2 className="text-xl font-bold text-white">
            {currentPipeline ? 'Edit Pipeline' : 'Create Pipeline'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Pipeline Name
            </label>
            <input
              type="text"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              placeholder="Enter pipeline name"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-white/70 text-sm font-medium">Pipeline Stages</label>
              <button
                type="button"
                onClick={handleAddStage}
                className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stage</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {stages.map((stage) => (
                <div 
                  key={stage.id}
                  className="flex items-center space-x-3 p-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg group"
                >
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: stage.color }}
                  />
                  {editingStageId === stage.id ? (
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) => handleStageNameChange(stage.id, e.target.value)}
                      onBlur={() => setEditingStageId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingStageId(null);
                        }
                      }}
                      className="flex-1 bg-transparent border-b border-[#FFD700] text-white focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 text-white">{stage.name}</div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingStageId(stage.id)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStage(stage.id)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{currentPipeline ? 'Save Changes' : 'Create Pipeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}