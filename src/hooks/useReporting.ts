import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProcessingTask {
  id: string;
  type: 'audience_upload' | 'campaign_processing' | 'system_report';
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  stage: string;
  message: string;
  startTime: number;
  endTime?: number;
  error?: string;
  result?: any;
}

interface ReportingStore {
  tasks: ProcessingTask[];
  addTask: (task: Omit<ProcessingTask, 'id' | 'startTime'>) => string;
  updateTask: (id: string, updates: Partial<ProcessingTask>) => void;
  removeTask: (id: string) => void;
  clearStuckTasks: () => void;
  cleanupStuckTasks: () => void;
  clearCompletedTasks: () => void;
}

export const useReporting = create<ReportingStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (task) => {
        // Clear any stuck tasks first
        get().clearStuckTasks();
        
        const id = Math.random().toString(36).substr(2, 9);
        const newTask: ProcessingTask = {
          ...task,
          id,
          startTime: Date.now(),
          progress: 0,
          status: task.status || 'queued'
        };
        
        set(state => ({
          tasks: [newTask, ...state.tasks]
        }));
        
        return id;
      },
      
      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id 
              ? { 
                  ...task, 
                  ...updates,
                  endTime: (updates.status === 'completed' || updates.status === 'failed')
                    ? Date.now()
                    : task.endTime
                } 
              : task
          )
        }));
      },
      
      removeTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },
      
      clearStuckTasks: () => {
        // Immediately mark all processing tasks as failed
        set(state => ({
          tasks: state.tasks.map(task => {
            if (task.status === 'processing' || task.status === 'queued') {
              return {
                ...task,
                status: 'failed',
                endTime: Date.now(),
                error: 'Task was stuck and has been cleared'
              };
            }
            return task;
          })
        }));
      },
      
      cleanupStuckTasks: () => {
        const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes
        
        set(state => ({
          tasks: state.tasks.map(task => {
            // Check if task is stuck (processing for too long)
            if (task.status === 'processing' && 
                Date.now() - task.startTime > TIMEOUT_DURATION) {
              return {
                ...task,
                status: 'failed',
                endTime: Date.now(),
                error: 'Task timed out after 5 minutes'
              };
            }
            return task;
          })
        }));
      },
      
      clearCompletedTasks: () => {
        set(state => ({
          tasks: state.tasks.filter(task => 
            task.status !== 'completed' && task.status !== 'failed'
          )
        }));
      }
    }),
    {
      name: 'reporting-store'
    }
  )
);