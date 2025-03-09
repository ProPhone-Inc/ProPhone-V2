import React from 'react';
import { X, Mail, PenSquare, Eye, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  type: 'suspension' | 'ban' | 'reactivation' | 'notification';
}

interface EmailTemplatesModalProps {
  onClose: () => void;
}

export function EmailTemplatesModal({ onClose }: EmailTemplatesModalProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [testResult, setTestResult] = React.useState<'success' | 'error' | null>(null);

  // Mock templates - in a real app, these would come from your database
  const templates: EmailTemplate[] = [
    {
      id: 'suspension',
      name: 'Account Suspension',
      subject: 'Your ProPhone Account Has Been Suspended',
      body: `Dear {{user.name}} ({{user.email}}),

Your ProPhone account has been suspended for the following reason:
{{suspension.reason}}

Account Details:
- Account ID: {{user.id}}
- Suspension Date: {{suspension.date}}
- Plan: {{user.plan}}

{{#if suspension.paymentIssue}}
To reactivate your account:
1. Update your payment method in your billing settings
2. Clear any outstanding balance
   - Outstanding Amount: {{billing.amount}}
   - Due Date: {{billing.dueDate}}
3. Your account will be automatically reactivated once payment is processed

If you need assistance, please contact our billing support at billing@prophone.io.
{{else}}
If you believe this is a mistake or would like to appeal this decision,
please contact our support team at support@prophone.io.

Appeal Reference: {{suspension.referenceId}}
{{/if}}

Best regards,
The ProPhone Team`,
      variables: [
        'user.name',
        'user.email',
        'user.id',
        'user.plan',
        'suspension.reason',
        'suspension.date',
        'suspension.paymentIssue',
        'suspension.referenceId',
        'billing.amount',
        'billing.dueDate'
      ],
      type: 'suspension'
    },
    {
      id: 'ban',
      name: 'Account Ban',
      subject: 'Your ProPhone Account Has Been Permanently Banned',
      body: `Dear {{user.name}} ({{user.email}}),

Your ProPhone account has been permanently banned for the following reason:
{{ban.reason}}

Ban Details:
- Account ID: {{user.id}}
- Ban Date: {{ban.date}}
- Ban Reference: {{ban.referenceId}}

As a result of this ban:
- Your account has been permanently deleted
- You will not be able to create new accounts using this email address
- All associated data has been removed from our platform
- Data deletion will be completed by: {{ban.dataDeletionDate}}

This decision is final and cannot be appealed.

Best regards,
The ProPhone Team`,
      variables: [
        'user.name',
        'user.email',
        'user.id',
        'ban.reason',
        'ban.date',
        'ban.referenceId',
        'ban.dataDeletionDate'
      ],
      type: 'ban'
    },
    {
      id: 'reactivation',
      name: 'Account Reactivation',
      subject: 'Your ProPhone Account Has Been Reactivated',
      body: `Dear {{user.name}} ({{user.email}}),

Great news! Your ProPhone account has been reactivated. You now have full access to all platform features.

Account Details:
- Account ID: {{user.id}}
- Plan: {{user.plan}}
- Reactivation Date: {{reactivation.date}}

Your subscription has been restored with the following details:
- Billing Cycle: {{billing.cycle}}
- Next Payment: {{billing.nextPaymentDate}}
- Amount: {{billing.amount}}

You can log in to your account at any time using your existing credentials.

If you have any questions or need assistance, please don't hesitate to contact our support team at support@prophone.io.

Best regards,
The ProPhone Team`,
      variables: [
        'user.name',
        'user.email',
        'user.id',
        'user.plan',
        'reactivation.date',
        'billing.cycle',
        'billing.nextPaymentDate',
        'billing.amount'
      ],
      type: 'reactivation'
    }
  ];

  const handleTestSend = async () => {
    if (!selectedTemplate || !testEmail) return;
    
    setIsSending(true);
    setTestResult(null);
    
    try {
      // Simulate API call to send test email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTestResult('success');
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    
    setIsSending(true);
    try {
      // Simulate API call to save template
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-4xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Mail className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Email Templates</h2>
              <p className="text-white/60">Manage notification email templates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 h-[calc(100vh-16rem)]">
          {/* Template List */}
          <div className="border-r border-[#B38B3F]/20 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-white/70 text-sm font-medium mb-3">Templates</h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsEditing(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-[#B38B3F]/20 border border-[#B38B3F]/40'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="font-medium text-white">{template.name}</div>
                    <div className="text-sm text-white/60 mt-1">
                      {template.variables.length} variables
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className="col-span-2 overflow-y-auto">
            {selectedTemplate ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{selectedTemplate.name}</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                      <PenSquare className="w-4 h-4" />
                      <span>{isEditing ? 'Preview' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedTemplate.body);
                      }}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={selectedTemplate.subject}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Template</label>
                  <textarea
                    value={selectedTemplate.body}
                    disabled={!isEditing}
                    rows={12}
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Available Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <div
                        key={variable}
                        className="px-2 py-1 rounded-lg bg-[#B38B3F]/10 border border-[#B38B3F]/20 text-[#FFD700] text-sm"
                      >
                        {`{{${variable}}}`}
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSending}
                      className="px-4 py-2 bg-[#B38B3F] hover:bg-[#B38B3F]/90 text-black font-medium rounded-lg transition-colors"
                    >
                      {isSending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Send Test Email</label>
                    <div className="flex space-x-3">
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="Enter test email address"
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      />
                      <button
                        onClick={handleTestSend}
                        disabled={!testEmail || isSending}
                        className="px-4 py-2 bg-[#B38B3F] hover:bg-[#B38B3F]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSending ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Test'
                        )}
                      </button>
                    </div>

                    {testResult && (
                      <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
                        testResult === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {testResult === 'success' ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Test email sent successfully</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5" />
                            <span>Failed to send test email</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-white/40">
                Select a template to view or edit
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}