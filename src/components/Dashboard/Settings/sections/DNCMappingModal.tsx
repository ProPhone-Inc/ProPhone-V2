import React from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
}

interface DNCMappingModalProps {
  onClose: () => void;
  onConfirm: (mapping: { dncNumber: string }) => void;
  file: File;
}

export function DNCMappingModal({ onClose, onConfirm, file }: DNCMappingModalProps) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>('');
  const [fileColumns, setFileColumns] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = React.useState<ProcessingState>({
    isProcessing: false,
    progress: 0
  });

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Load columns from file
  React.useEffect(() => {
    const readFileColumns = async () => {
      setIsLoading(true);
      try {
        // For Excel files
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const XLSX = await import('xlsx');
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0] as string[];
          setFileColumns(headers);
          setError(null);
        } else {
          // For CSV files
          const text = await file.text();
          const lines = text.split('\n');
          
          if (!lines.length) {
            throw new Error('File appears to be empty');
          }
          
          const firstLine = lines[0].trim();
          let headers: string[];
          
          if (firstLine.includes('\t')) {
            headers = firstLine.split('\t');
          } else if (firstLine.includes(',')) {
            headers = firstLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              .map(header => header.replace(/^"(.*)"$/, '$1').trim());
          } else {
            throw new Error('Invalid file format. Please use CSV or Excel files.');
          }
          
          headers = headers.filter(Boolean);
          if (!headers.length) {
            throw new Error('No valid columns found in file');
          }
          
          setFileColumns(headers);
          setError(null);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to read file';
        setError(error);
        console.error('Error reading file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    readFileColumns();
  }, [file]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessing({ isProcessing: true, progress: 0 });
    
    if (!selectedColumn) {
      setError('Please select a column for DNC numbers');
      setIsProcessing(false);
      setProcessing({ isProcessing: false, progress: 0 });
      return;
    }

    // Show processing state for 3 seconds
    setTimeout(() => {
      setProcessing({ isProcessing: true, progress: 100 });
      onConfirm({ dncNumber: selectedColumn });
      onClose();
    }, 3000);
  };

  if (processing.isProcessing) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div ref={modalRef} className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl p-8 transform animate-fade-in max-w-sm w-full mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#B38B3F]/20" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-[#FFD700] border-t-transparent transform rotate-0"
                style={{ 
                  transform: `rotate(${processing.progress * 3.6}deg)`,
                  transition: 'transform 0.1s linear'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#FFD700] font-bold">{Math.round(processing.progress)}%</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Processing DNC Numbers</h3>
            <p className="text-white/60">Please wait while we process your file...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div ref={modalRef} className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h3 className="text-xl font-bold text-white">Map DNC Numbers</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Select Phone Number Column
                </label>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                >
                  <option value="">Select a column</option>
                  {fileColumns.map((column) => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#FFD700]/20">
                    <Check className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <h4 className="text-[#FFD700] font-medium">Column Requirements</h4>
                    <p className="text-white/70 text-sm mt-1">
                      Select column containing DNC numbers to import
                    </p>
                  </div>
                </div>
              </div>

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
                  className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Import Numbers'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}