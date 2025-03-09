import React from 'react';
import { KanbanBoard } from './KanbanBoard';
import { AudienceList } from './AudienceList';

interface CRMDashboardProps {
  activeView: 'kanban' | 'audience';
  onViewChange: (view: 'kanban' | 'audience') => void;
}

export function CRMDashboard({ activeView, onViewChange }: CRMDashboardProps) {
  return (
    <div className="h-full bg-black">
      {activeView === 'kanban' ? (
        <KanbanBoard />
      ) : (
        <AudienceList />
      )}
    </div>
  );
}