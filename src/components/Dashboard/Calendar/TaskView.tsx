import React from 'react';
import { Clock, Calendar, Plus, GripVertical, Trash2 } from 'lucide-react';

interface TaskViewProps {
  taskStages: string[];
  setTaskStages: (stages: string[]) => void;
  events: any[];
  taskDisplayMode: string;
  selectedDate: Date | null;
  onTaskSelect: (task: any) => void;
}

export function TaskView({
  taskStages,
  setTaskStages,
  events,
  taskDisplayMode,
  selectedDate,
  onTaskSelect
}: TaskViewProps) {
  // Calculate stage width based on container width
  const stageWidth = `${100 / taskStages.length}%`;

  const [stageToDelete, setStageToDelete] = React.useState<string | null>(null);

  const handleDeleteStage = (stage: string) => {
    // Don't allow deleting if there are tasks in this stage
    const tasksInStage = events.filter(event => 
      event.type === 'task' && event.status === stage
    ).length;
    
    if (tasksInStage > 0) {
      alert('Cannot delete stage with active tasks. Please move or delete tasks first.');
      return;
    }
    
    setTaskStages(prev => prev.filter(s => s !== stage));
  };
  const isWithinWeek = (dateString: string) => {
    const date = new Date(dateString);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return date >= startOfWeek && date <= endOfWeek;
  };

  const isWithinMonth = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  return (
    <div 
      className="flex h-[calc(100vh-16rem)] overflow-hidden pb-4 w-full"
    >
      {taskStages.map((stage, index) => (
        <div 
          key={stage} 
          className="bg-zinc-800/50 rounded-xl border border-[#FFD700]/20 p-4 flex flex-col h-full overflow-hidden mx-2"
          style={{ width: stageWidth }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-white/40" />
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-white">{stage}</h3>
                <button
                  onClick={() => handleDeleteStage(stage)}
                  className="p-1 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Stage"
                >
                  <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                </button>
              </div>
            </div>
            <span className="text-sm text-white/50">
              {events.filter(event => event.type === 'task' && event.status === stage).length} tasks
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 min-h-0">
            {events
              .filter(event => 
                event.type === 'task' &&
                event.status === stage && 
                event.date === new Date().toISOString().split('T')[0]
              )
              .map(task => (
                <div
                  key={task.id}
                  className="p-3 bg-zinc-900/50 rounded-lg border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors cursor-pointer"
                  onClick={() => onTaskSelect(task)}
                >
                  <h4 className="font-medium text-white mb-1">{task.title}</h4>
                  <div className="flex items-center space-x-3 text-white/60 text-xs">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(task.date).toLocaleDateString()}</span>
                    </div>
                    {task.time && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{task.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}