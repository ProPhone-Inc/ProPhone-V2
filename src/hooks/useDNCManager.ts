import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DNCStore {
  numbers: Array<{
    id: string;
    number: string;
    addedAt: string;
    reason?: string;
  }>;
  addNumber: (number: string, reason?: string) => void;
  removeNumber: (number: string) => void;
  isBlocked: (number: string) => boolean;
  getNumbers: () => Array<{
    id: string;
    number: string;
    addedAt: string;
    reason?: string;
  }>;
}

export const useDNCManager = create<DNCStore>()(
  persist(
    (set, get) => ({
      numbers: [],
      
      addNumber: (number: string, reason?: string) => {
        // Clean the number format
        const cleanNumber = number.replace(/\D/g, '');
        const formattedNumber = `(${cleanNumber.slice(0,3)}) ${cleanNumber.slice(3,6)}-${cleanNumber.slice(6)}`;
        
        // Check if number already exists
        if (get().numbers.some(n => n.number === formattedNumber)) {
          return;
        }
        
        set(state => ({
          numbers: [...state.numbers, {
            id: Math.random().toString(36).substr(2, 9),
            number: formattedNumber,
            addedAt: new Date().toISOString(),
            reason
          }]
        }));
      },
      
      removeNumber: (number: string) => {
        set(state => ({
          numbers: state.numbers.filter(n => n.number !== number)
        }));
      },
      
      isBlocked: (number: string) => {
        // Clean the number format for comparison
        const cleanNumber = number.replace(/\D/g, '');
        const formattedNumber = `(${cleanNumber.slice(0,3)}) ${cleanNumber.slice(3,6)}-${cleanNumber.slice(6)}`;
        
        return get().numbers.some(n => n.number === formattedNumber);
      },
      
      getNumbers: () => get().numbers
    }),
    {
      name: 'dnc-list'
    }
  )
);