import React from 'react';
import { Phone, X, Star, Hash, Backpack as Backspace } from 'lucide-react';

interface DialpadProps {
  onClose: () => void;
  onCall: (number: string) => void;
}

export function Dialpad({ onClose, onCall }: DialpadProps) {
  const [number, setNumber] = React.useState('');
  const [error, setError] = React.useState('');
  const [isDialing, setIsDialing] = React.useState(false);

  const handleNumberClick = (digit: string) => {
    if (number.length >= 14) return; // Max length for (XXX) XXX-XXXX
    
    // Get all digits from current number
    let digits = number.replace(/\D/g, '');
    
    // Add new digit
    digits += digit;
    
    // Remove leading 1 if present
    if (digits.startsWith('1')) {
      digits = digits.slice(1);
    }
    
    // Format number
    let newNumber = '';
    if (digits.length <= 3) {
      newNumber = `(${digits}`;
    } else if (digits.length <= 6) {
      newNumber = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      newNumber = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    
    setNumber(newNumber);
    setError('');
  };

  const handleBackspace = () => {
    if (number.length === 0) return;
    
    let newNumber = number;
    // Handle removing formatting
    if (number.endsWith(' ')) {
      newNumber = number.slice(0, -2);
    } else if (number.endsWith('-')) {
      newNumber = number.slice(0, -1);
    } else {
      newNumber = number.slice(0, -1);
    }
    setNumber(newNumber);
    setError('');
  };

  const handleCall = () => {
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(number)) {
      setError('Please enter a complete phone number');
      return;
    }

    setIsDialing(true);
    setError('');
    onCall(number);
    onClose();
  };

  const dialpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-[320px] bg-zinc-900/95 backdrop-blur-md border border-[#B38B3F]/20 rounded-xl shadow-2xl z-50 animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Dialpad</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={number}
            readOnly
            className={`w-full text-center text-2xl py-3 bg-transparent border-b-2 text-white placeholder-white/40 focus:outline-none transition-colors ${
              error ? 'border-red-500' : 'border-[#B38B3F]/20'
            }`}
            placeholder="Enter number"
          />
          {error && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {dialpadButtons.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumberClick(digit)}
                  className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-medium flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>{digit}</span>
                  {digit === '0' && <Star className="w-4 h-4 mt-1" />}
                  {digit === '#' && <Hash className="w-4 h-4 mt-1" />}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Backspace className="w-6 h-6" />
          </button>
          <button
            onClick={handleCall}
            disabled={isDialing}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/20 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}