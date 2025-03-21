import React from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

interface ColumnMappingModalProps {
  onClose: () => void;
  onConfirm: (mappings: Record<string, string>) => void;
  file: File;
}

const MAPPABLE_FIELDS = [
  {
    section: 'Contact Info',
    fields: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' }
    ]
  },
  {
    section: 'Phone Numbers',
    fields: [
      { key: 'phone1', label: 'Phone 1' },
      { key: 'phone2', label: 'Phone 2' },
      { key: 'phone3', label: 'Phone 3' },
      { key: 'phone4', label: 'Phone 4' },
      { key: 'phone5', label: 'Phone 5' }
    ]
  },
  {
    section: 'Address',
    fields: [
      { key: 'fullAddress', label: 'Full Address' },
      { key: 'street', label: 'Street' },
      { key: 'address1', label: 'Address Line 1' },
      { key: 'address2', label: 'Address Line 2' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'zipCode', label: 'Zip Code' },
      { key: 'county', label: 'County' }
    ]
  }
];

function ColumnMappingModalComponent({ onClose, onConfirm, file }: ColumnMappingModalProps) {
  const [mappings, setMappings] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string | null>(null);
  const [fileColumns, setFileColumns] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processStatus, setProcessStatus] = React.useState<{
    total: number;
    processed: number;
    duplicates: number;
    blanks: number;
    phoneNumbers: Set<string>;
  }>({
    total: 0,
    processed: 0,
    duplicates: 0,
    blanks: 0,
    phoneNumbers: new Set()
  });
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-map columns when file is loaded
  React.useEffect(() => {
    if (!isLoading && fileColumns.length > 0) {
      const autoMappings: Record<string, string> = {}; 
      
      // Create a map of all possible field keys to their labels
      const fieldMap = MAPPABLE_FIELDS.reduce((acc, section) => {
        section.fields.forEach(({ key, label }) => {
          // Normalize both key and label for matching
          const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]/g, '');
          acc[normalizedKey] = key;
          acc[normalizedLabel] = key;
        });
        return acc;
      }, {} as Record<string, string>);
      
      // Try to match file columns to fields
      fileColumns.forEach(column => {
        // Normalize column name for matching
        const normalizedColumn = column.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Only map if there's an exact match
        if (fieldMap[normalizedColumn]) {
          autoMappings[fieldMap[normalizedColumn]] = column;
        }
      });
      
      setMappings(autoMappings);
    }
  }, [isLoading, fileColumns]);

  React.useEffect(() => {
    const readFileColumns = async () => {
      setIsLoading(true);
      try {
        // For Excel files
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const XLSX = await import('xlsx/xlsx.mjs');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasPhone1Mapping = Object.entries(mappings).some(([field, column]) => 
      field === 'phone1' && column);

    if (!hasPhone1Mapping) {
      setError('Phone 1 field must be mapped');
      return;
    }
    
    // Show processing for 3 seconds then close
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(mappings);
      onClose();
    }, 3000);
  };

  const handleMapping = (field: string, column: string) => {
    setMappings(prev => ({
      ...prev,
      [field]: column
    }));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-3xl transform animate-fade-in max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div>
            <h2 className="text-xl font-bold text-white">Map Columns</h2>
            <p className="text-white/60">Match your file columns to contact fields</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-[#FFD700]/20">
                <Check className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h4 className="text-[#FFD700] font-medium">Required Fields</h4>
                <p className="text-white/70 text-sm mt-1">
                  Phone 1 field must be mapped to import contacts
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Uploaded File Columns</h3>
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
                </div>
              )}
              {!isLoading && fileColumns.length > 0 && (
                <div className="space-y-4">
                {fileColumns.map((column) => (
                  <div key={column} className="flex items-center space-x-4">
                    <div className="flex-1 p-3 bg-zinc-800/50 rounded-lg border border-[#B38B3F]/20">
                      <div className="font-medium text-white">{column}</div>
                    </div>
                    <select
                      value={Object.entries(mappings).find(([_, val]) => val === column)?.[0] || ''}
                      onChange={(e) => handleMapping(e.target.value, column)}
                      className={`w-48 px-3 py-2 bg-zinc-800 border rounded-lg text-white text-sm ${
                        Object.values(mappings).includes(column)
                          ? 'border-[#FFD700] text-[#FFD700]'
                          : 'border-[#B38B3F]/20 text-white/70'
                      }`}
                      style={{
                        boxShadow: Object.values(mappings).includes(column) ? '0 0 0 1px #FFD700' : 'none'
                      }}
                    >
                      <option value="">Do not import</option>
                      {MAPPABLE_FIELDS.map((section) => (
                        <React.Fragment key={section.section}>
                          <optgroup label={section.section}>
                            {section.fields.map(({ key, label }) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </optgroup>
                        </React.Fragment>
                      ))}
                    </select>
                  </div>
                ))}
                </div>
              )}
              {!isLoading && fileColumns.length === 0 && (
                <div className="text-center py-12 text-white/50">
                  No columns found in file
                </div>
              )}
            </div>
            
            <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Field Mapping Guide</h3>
              <p className="text-white/70 text-sm mb-4">
                Map your file columns to the appropriate system fields. Phone 1 field is required.
              </p>
              <div className="space-y-2">
                <div className="text-sm text-white/60">• Phone 1 field is required (*)</div>
                <div className="text-sm text-white/60">• Multiple phone numbers can be mapped</div>
                <div className="text-sm text-white/60">• Unmapped columns will be ignored</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-[#B38B3F]/20">
            {isProcessing && (
              <div className="mt-4 space-y-2">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] transition-all duration-300"
                    style={{ width: `${(processStatus.processed / processStatus.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Processing contacts...</span>
                  <span className="text-white/60">
                    {processStatus.duplicates} duplicates, {processStatus.blanks} blank
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create Audience</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Export a separate component to avoid naming conflicts
export const ColumnMappingModal = ColumnMappingModalComponent;