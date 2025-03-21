import React from 'react';
import { X, FileSpreadsheet, File, AlertTriangle, Check } from 'lucide-react';
import { DNCMappingModal } from './DNCMappingModal';
import { useReporting } from '../../../../hooks/useReporting';
import { useSystemNotifications } from '../../../../hooks/useSystemNotifications';

interface ImportDNCModalProps {
  onClose: () => void;
  onImport: (numbers: string[]) => void;
}

export function ImportDNCModal({ onClose, onImport }: ImportDNCModalProps) {
  const { addTask, updateTask } = useReporting();
  const { addNotification } = useSystemNotifications();
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showDNCMapping, setShowDNCMapping] = React.useState(false);
  const [availableColumns, setAvailableColumns] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
      'text/plain'
    ];
    
    const extension = file.name.toLowerCase().split('.').pop();
    const isValidExtension = ['csv', 'xls', 'xlsx'].includes(extension || '');
    
    if (!isValidExtension && !validTypes.includes(file.type)) {
      setError('Please upload an Excel or CSV file');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }
    
    setIsUploading(true);
    setError(null);

    try {
      // Read file using xlsx library
      const data = await selectedFile.arrayBuffer();
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0] as string[];
      
      if (!headers || headers.length === 0) {
        throw new Error('No valid columns found in file');
      }

      setAvailableColumns(headers);
      setShowDNCMapping(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read file';
      setError(errorMessage);
      console.error('Error reading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmMapping = async (mappings: Record<string, string>) => {
    // Close modals first
    setShowDNCMapping(false);
    onClose();

    // Create background task first
    const taskId = addTask({
      type: 'dnc_import',
      name: 'Processing DNC Numbers',
      status: 'queued',
      progress: 0,
      stage: 'Preparing data',
      message: 'Starting DNC number processing...'
    });

    // Add initial notification
    addNotification({
      title: 'Processing DNC Numbers',
      message: 'Starting to process DNC numbers',
      type: 'announcement',
      priority: 'medium'
    });

    try {
      // Process file data
      const data = await selectedFile!.arrayBuffer();
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet) as Record<string, any>[];
      
      // Update task with total count
      await updateTask(taskId, {
        progress: 5,
        stage: 'Reading file',
        message: `Processing ${rows.length} rows...`
      });

      // Initialize tracking variables
      const uniquePhones = new Set<string>();
      let duplicateCount = 0;
      let blankCount = 0;
      const processedNumbers = [];
      const batchSize = 100;

      // Process in batches
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const batchNumbers = [];

        for (const row of batch) {
          const phoneColumn = mappings['dncNumber'];
          if (!phoneColumn || !row[phoneColumn]) {
            blankCount++;
            continue;
          }

          const phone = row[phoneColumn].toString().trim();
          const cleanPhone = phone.replace(/\D/g, '');

          if (cleanPhone.length === 10) {
            const formattedPhone = `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}`;

            if (uniquePhones.has(formattedPhone)) {
              duplicateCount++;
            } else {
              uniquePhones.add(formattedPhone);
              batchNumbers.push(formattedPhone);
            }
          } else {
            blankCount++;
          }
        }

        // Add batch contacts to processed contacts
        processedNumbers.push(...batchNumbers);

        // Update progress
        const progress = Math.min(((i + batchSize) / rows.length) * 100, 100);
        await updateTask(taskId, {
          progress,
          stage: 'Processing DNC numbers',
          message: `Processed ${Math.min(i + batchSize, rows.length)} of ${rows.length} numbers (${duplicateCount} duplicates, ${blankCount} invalid)`
        });

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Update task as complete
      await updateTask(taskId, {
        status: 'completed',
        progress: 100,
        stage: 'Complete',
        message: `Processed ${processedNumbers.length} DNC numbers (${duplicateCount} duplicates, ${blankCount} invalid)`,
        endTime: Date.now()
      });

      // Send completion notification
      await addNotification({
        title: 'DNC Numbers Import Complete',
        message: `${processedNumbers.length} numbers have been added to your DNC list`,
        type: 'announcement',
        priority: 'low'
      });

      // Pass processed data to parent
      onImport(processedNumbers);
      
      // Close modals
      setShowDNCMapping(false);
      onClose();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
      setError(errorMessage);
      console.error('Error processing file:', error);
      
      // Update task as failed
      await updateTask(taskId, {
        status: 'failed',
        stage: 'Failed',
        message: 'Processing failed',
        error: errorMessage,
        endTime: Date.now()
      });
      
      // Send error notification
      await addNotification({
        title: 'DNC Numbers Import Failed',
        message: errorMessage,
        type: 'announcement',
        priority: 'high'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <FileSpreadsheet className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Import DNC Numbers</h2>
              <p className="text-white/60">Import numbers from Excel or CSV file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-[#FFD700] bg-[#FFD700]/5'
                : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept=".csv,.xls,.xlsx"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-white font-medium mb-1">{selectedFile.name}</p>
                <p className="text-white/60 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="mt-4 text-red-400 hover:text-red-300 text-sm"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-[#FFD700]" />
                </div>
                <p className="text-white font-medium mb-2">
                  Drag & drop your file here
                </p>
                <p className="text-white/60 text-sm mb-4">
                  or click to browse your computer
                </p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
            <h4 className="text-[#FFD700] font-medium mb-2">File Requirements</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center space-x-2">
                <File className="w-4 h-4 text-[#FFD700]" />
                <span>Excel (.xls, .xlsx) or CSV files</span>
              </li>
              <li className="flex items-center space-x-2">
                <File className="w-4 h-4 text-[#FFD700]" />
                <span>Maximum file size: 10MB</span>
              </li>
              <li className="flex items-center space-x-2">
                <File className="w-4 h-4 text-[#FFD700]" />
                <span>Required column: Phone Number</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Import File</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Column Mapping Modal */}
      {showDNCMapping && (
        <DNCMappingModal
          onClose={() => setShowDNCMapping(false)}
          onConfirm={handleConfirmMapping}
          file={selectedFile!}
        />
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#FFD700] font-medium">Checking columns...</p>
          </div>
        </div>
      )}
    </div>
  );
}