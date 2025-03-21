import React from 'react';
import { X, BarChart2, FileSpreadsheet, ArrowRight, Loader2, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { useReporting } from '../../../hooks/useReporting';
import { useSystemNotifications } from '../../../hooks/useSystemNotifications';

interface ReportingModalProps {
  onClose: () => void;
}

export function ReportingModal({ onClose }: ReportingModalProps) {
  const { tasks, clearCompletedTasks, updateTask } = useReporting();
  const { addNotification } = useSystemNotifications();
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearAllTasks = async () => {
    setIsClearing(true);
    try {
      // Clear all tasks
      tasks.forEach(task => {
        if (task.status === 'processing' || task.status === 'queued') {
          updateTask(task.id, {
            status: 'failed',
            endTime: Date.now(),
            error: 'Task was manually cleared'
          });
        }
      });

      // Send notification
      addNotification({
        title: 'Tasks Cleared',
        message: 'All processing tasks have been cleared',
        type: 'announcement',
        priority: 'low'
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Group tasks by status
  const groupedTasks = React.useMemo(() => {
    const groups = {
      active: tasks.filter(t => t.status === 'processing' || t.status === 'queued'),
      completed: tasks.filter(t => t.status === 'completed'),
      failed: tasks.filter(t => t.status === 'failed')
    };
    return groups;
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-[#FFD700]';
      case 'completed':
        return 'text-emerald-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-4xl transform animate-fade-in max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <BarChart2 className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Processing</h2>
              <p className="text-white/60">Monitor background tasks and system processes</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {(groupedTasks.completed.length > 0 || groupedTasks.failed.length > 0) && (
              <button
                onClick={() => clearCompletedTasks()}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Completed</span>
              </button>
            )}
            {groupedTasks.active.length > 0 && (
              <button
                onClick={handleClearAllTasks}
                disabled={isClearing}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center space-x-2 text-sm disabled:opacity-50"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Clear Processing</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {/* Active Tasks */}
          {groupedTasks.active.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Active Processes</h3>
              <div className="space-y-4">
                {groupedTasks.active.map(task => (
                  <div 
                    key={task.id}
                    className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{task.name}</div>
                          <div className="text-sm text-white/60">
                            {new Date(task.startTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-white/40">
                        {new Date(task.startTime).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] transition-all duration-300"
                          style={{ width: `${Math.min(task.progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{task.stage}</span>
                        <span className="text-white/60">{Math.min(task.progress, 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {groupedTasks.completed.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Completed</h3>
              <div className="space-y-4">
                {groupedTasks.completed.map(task => (
                  <div 
                    key={task.id}
                    className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{task.name}</div>
                          <div className="text-sm text-white/60">
                            Completed in {Math.round((task.endTime! - task.startTime) / 1000)}s
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-white/40">
                        {new Date(task.endTime!).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Tasks */}
          {groupedTasks.failed.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Failed</h3>
              <div className="space-y-4">
                {groupedTasks.failed.map(task => (
                  <div 
                    key={task.id}
                    className="bg-zinc-800/50 rounded-xl border border-red-500/20 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-red-400">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{task.name}</div>
                          <div className="text-sm text-red-400">{task.error}</div>
                        </div>
                      </div>
                      <div className="text-sm text-white/40">
                        {new Date(task.endTime!).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#B38B3F]/20 flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-medium text-white">No Active Processes</h3>
              <p className="text-white/60 mt-2">Background tasks will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}