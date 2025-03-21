import React from 'react';
import { Edit3 } from 'lucide-react';

interface SignatureFieldProps {
  label?: string;
  required?: boolean;
  signed?: boolean;
  onSign?: () => void;
}

export function SignatureField({ label = 'Signature', required = true, signed = false, onSign }: SignatureFieldProps) {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div 
        onClick={onSign}
        className={`
          w-full h-24 rounded-lg border-2 border-dashed 
          flex items-center justify-center cursor-pointer
          transition-all duration-200
          ${signed
            ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }
        `}
      >
        {signed ? (
          <div className="text-center">
            <div className="font-signature text-2xl text-gray-800">John Smith</div>
            <div className="text-sm text-gray-500 mt-1">Signed on March 15, 2025</div>
          </div>
        ) : (
          <div className="text-center">
            <Edit3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Click to sign here</span>
          </div>
        )}
      </div>
    </div>
  );
}