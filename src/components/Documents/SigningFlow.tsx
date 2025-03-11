import React from 'react';
import { ChevronLeft, Download, Share2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SignatureField } from './SignatureField';

interface SigningFlowProps {
  document: {
    id: string;
    name: string;
    sender: {
      name: string;
      email: string;
    };
    content: string;
    fields: Array<{
      id: string;
      type: 'signature' | 'date' | 'text';
      required: boolean;
      label: string;
      value?: string;
    }>;
  };
  onBack: () => void;
  onComplete: () => void;
}

export function SigningFlow({ document, onBack, onComplete }: SigningFlowProps) {
  const [signed, setSigned] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSign = async () => {
    try {
      // Simulate signing process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSigned(true);
      setTimeout(onComplete, 2000);
    } catch (err) {
      setError('Failed to sign document. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-lg font-medium text-white">{document.name}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Document Preview */}
        <div className="flex-1 p-8 bg-zinc-900/50 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <div className="prose prose-sm max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{document.name}</h1>
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: document.content }} />
              
              <div className="mt-8 space-y-6">
                {document.fields.map(field => (
                  <SignatureField
                    key={field.id}
                    label={field.label}
                    required={field.required}
                    signed={signed}
                    onSign={handleSign}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Signing Panel */}
        <div className="w-80 border-l border-[#B38B3F]/20 bg-zinc-900/70 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Document Status</h3>
              <div className="p-4 rounded-lg bg-zinc-800 border border-[#B38B3F]/20">
                {signed ? (
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Successfully Signed</div>
                      <div className="text-sm text-emerald-400/70">
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Awaiting Your Signature</div>
                      <div className="text-sm text-amber-400/70">
                        Please review and sign the document
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Document Details</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-zinc-800 border border-[#B38B3F]/20">
                  <div className="text-sm text-white/60 mb-1">Sender</div>
                  <div className="text-white">{document.sender.name}</div>
                  <div className="text-sm text-white/60">{document.sender.email}</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800 border border-[#B38B3F]/20">
                  <div className="text-sm text-white/60 mb-1">Required Fields</div>
                  <div className="text-white">
                    {document.fields.filter(f => f.required).length} fields require your attention
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}