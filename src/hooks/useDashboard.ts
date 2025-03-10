import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Widget {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
  x: number;
  y: number;
  w: number;
  h: number;
  component: string;
  fixed?: boolean;
}

interface DashboardStore {
  widgets: Widget[];
  updateWidgets: (widgets: Widget[]) => void;
  resetLayout: () => void;
}

const defaultWidgets: Widget[] = [
  {
    id: 'stats',
    title: 'Status Overview',
    description: 'Track key metrics and performance indicators',
    visible: true,
    order: 1,
    size: 'medium',
    x: 0,
    y: 0,
    w: 4,
    h: 1,
    component: 'StatsCards'
  },
  {
    id: 'unread-messages',
    title: 'Unread Messages',
    description: 'Track unread messages and notifications',
    visible: true,
    order: 2,
    size: 'small',
    x: 0,
    y: 1,
    w: 1,
    h: 1,
    component: 'UnreadMessages'
  },
  {
    id: 'missed-calls',
    title: 'Missed Calls',
    description: 'Track missed calls and voicemails',
    visible: true,
    order: 3,
    size: 'small',
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    component: 'MissedCalls'
  },
  {
    id: 'voicemails',
    title: 'Voicemails',
    description: 'Track new and unheard voicemails',
    visible: true,
    order: 4,
    size: 'small',
    x: 2,
    y: 1,
    w: 1,
    h: 1,
    component: 'Voicemails'
  },
  {
    id: 'unread-emails',
    title: 'Unread Emails',
    description: 'Track unread emails and responses',
    visible: true,
    order: 5,
    size: 'small',
    x: 3,
    y: 1,
    w: 1,
    h: 1,
    component: 'UnreadEmails'
  },
  {
    id: 'status-tracking',
    title: 'Status Tracking',
    description: 'Track lead and contact statuses',
    visible: true,
    order: 6,
    size: 'large',
    x: 0,
    y: 2,
    w: 4,
    h: 2,
    component: 'StatusTracking'
  },
  {
    id: 'campaign-performance',
    title: 'Campaign Performance',
    description: 'Track campaign metrics and analytics',
    visible: true,
    order: 7,
    size: 'large',
    x: 0,
    y: 4,
    w: 4,
    h: 2,
    component: 'CampaignPerformance'
  }
];

export const useDashboard = create<DashboardStore>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      updateWidgets: (widgets) => set({ widgets }),
      resetLayout: () => set({ widgets: defaultWidgets })
    }),
    {
      name: 'dashboard-layout'
    }
  )
);