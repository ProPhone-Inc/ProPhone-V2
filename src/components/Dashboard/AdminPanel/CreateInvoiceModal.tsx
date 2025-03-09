import React from 'react';
import { X, Plus, Minus, DollarSign, Search, User, Mail, UserSearch } from 'lucide-react';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: string;
}

interface CreateInvoiceModalProps {
  onClose: () => void;
  onSave: (invoiceData: {
    customer: string;
    email: string;
    items: InvoiceItem[];
    dueDate: string;
    notes: string;
  }) => void;
}

export function CreateInvoiceModal({ onClose, onSave }: CreateInvoiceModalProps) {
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [showUserSearch, setShowUserSearch] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<{
    name: string;
    email: string;
    plan: string;
  } | null>(null);
  const [formData, setFormData] = React.useState({
    customer: '',
    email: '',
    items: [{ description: '', quantity: 1, unitPrice: '' }] as InvoiceItem[],
    dueDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: '' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Mock users data - in a real app, this would come from your user database
  const users = [
    { name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Business Pro' },
    { name: 'Mike Chen', email: 'mike@example.com', plan: 'Business Elite' },
    { name: 'Emma Wilson', email: 'emma@example.com', plan: 'Business Starter' }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const selectUser = (user: { name: string; email: string }) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      customer: user.name,
      email: user.email
    });
    setShowUserSearch(false);
    setUserSearchQuery('');
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const price = parseFloat(item.unitPrice) || 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl transform animate-fade-in max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-[#B38B3F]/20 p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-white">Create New Invoice</h3>
          <p className="text-white/60 text-sm">Create a custom invoice and payment link</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <label className="block text-white/70 text-sm font-medium mb-2">
                  <div className="flex items-center justify-between">
                    <span>Customer</span>
                    <button
                      type="button"
                      onClick={() => setShowUserSearch(true)}
                      className="text-[#635BFF] hover:text-[#635BFF]/80 text-xs font-medium flex items-center"
                    >
                      <UserSearch className="w-3 h-3 mr-1" />
                      Select User
                    </button>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>
                
                {showUserSearch && (
                  <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-[#B38B3F]/20 rounded-lg shadow-lg">
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-zinc-700 border border-[#B38B3F]/20 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredUsers.map((user, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectUser(user)}
                          className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#B38B3F]/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#FFD700]" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-white/60 text-sm">{user.email}</div>
                            <div className="text-[#FFD700] text-xs mt-0.5">{user.plan}</div>
                          </div>
                        </button>
                      ))}
                      {filteredUsers.length === 0 && (
                        <div className="px-4 py-3 text-white/50 text-sm text-center">
                          No users found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Customer Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
            </div>
          </div>
          
          {selectedUser && (
            <div className="bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#635BFF]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#635BFF]" />
                </div>
                <div>
                  <div className="text-white font-medium">{selectedUser.name}</div>
                  <div className="text-white/60 text-sm">{selectedUser.email}</div>
                  <div className="text-[#635BFF] text-xs mt-0.5">{selectedUser.plan}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setFormData({ ...formData, customer: '', email: '' });
                }}
                className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm"
              >
                Clear
              </button>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/70 text-sm font-medium">Invoice Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div className="w-32 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      required
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Total Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635BFF]" />
                <input
                  type="text"
                  value={calculateTotal()}
                  disabled
                  className="w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-[#B38B3F]/20 rounded-lg text-[#635BFF] font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white h-24 resize-none"
              placeholder="Additional notes or payment instructions..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Invoice & Payment Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}