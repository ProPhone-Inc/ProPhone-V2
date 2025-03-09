import React from 'react';

interface ExportProgressProps {
  progress: number;
  total: number;
  type: 'export' | 'download';
}

export function ExportProgress({ progress, total, type }: ExportProgressProps) {
  if (progress === 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#B38B3F"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              className="animate-[progress_1s_ease-out_forwards]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[#FFD700] font-bold">
            {Math.round(progress)}%
          </div>
        </div>
        <p className="text-white font-medium">
          {type === 'export' ? 'Generating Report' : 'Downloading'}
        </p>
        <p className="text-white/60 text-sm">
          Processing {total} {total === 1 ? 'invoice' : 'invoices'}
        </p>
      </div>
    </div>
  );
}