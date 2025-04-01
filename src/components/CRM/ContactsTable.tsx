import React from 'react';
import { Search, Filter, ChevronDown, Plus, MoreHorizontal, ArrowUpRight, Mail, Phone, Tag, MapPin } from 'lucide-react';
import { ContactModal } from './ContactModal';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  tags: string[];
  notes: string;
  leadStatus: 'hot' | 'warm' | 'cold';
}

export function ContactsTable() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedContacts, setSelectedContacts] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);

  const [contacts] = React.useState<Contact[]>([
    {
      id: '1',
      firstName: 'Camila',
      lastName: 'Deoliveira',
      phone: '(561) 502-9344',
      propertyAddress: '135 Overcrest Ct',
      city: 'Clarksville',
      state: 'Tn',
      zip: '37043',
      email: '',
      tags: ['Seller'],
      notes: '3.5 | Maybe',
      leadStatus: 'hot'
    },
    {
      id: '2',
      firstName: 'Cendy',
      lastName: 'Romero',
      phone: '(931) 572-4997',
      propertyAddress: '326 Old Dunbar Cave Rd',
      city: 'Clarksville',
      state: 'Tn',
      zip: '37043',
      email: '',
      tags: ['Seller'],
      notes: '3.5 | Late May or Early June',
      leadStatus: 'warm'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Minor',
      phone: '(931) 279-0198',
      propertyAddress: '2825 Lylewood Rd',
      city: 'Woodlawn',
      state: 'Tn',
      zip: '37191',
      email: '',
      tags: ['Seller'],
      notes: '3.5 | Early May or June',
      leadStatus: 'cold'
    }
  ]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (id: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(id)) {
        return prev.filter(contactId => contactId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <ArrowUpRight className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Contacts</h1>
              <p className="text-white/60">Manage and track your contacts</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr className="border-b border-[#B38B3F]/20">
              <th className="py-4 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length}
                  onChange={handleSelectAll}
                  className="rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                />
              </th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">First Name</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">Last Name</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">Phone</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">Property Address</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">City</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">State</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">ZIP</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">Tags</th>
              <th className="py-4 px-4 text-left text-white/70 font-medium">Notes</th>
              <th className="py-4 px-4 text-right text-white/70 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr 
                key={contact.id} 
                onClick={() => setSelectedContact(contact)}
                className="border-b border-[#B38B3F]/10 hover:bg-white/5 cursor-pointer"
              >
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectContact(contact.id);
                    }}
                    className="rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-white">{contact.firstName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-white">{contact.lastName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-white">{contact.phone}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-white">{contact.propertyAddress}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white">{contact.city}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white">{contact.state}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white">{contact.zip}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white/70">{contact.notes}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle email action
                      }}
                    >
                      <Mail className="w-4 h-4 text-[#FFD700]" />
                    </button>
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle phone action
                      }}
                    >
                      <Phone className="w-4 h-4 text-[#FFD700]" />
                    </button>
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#B38B3F]/20 bg-zinc-900/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
            <span className="text-white/60">
              Showing {Math.min((currentPage - 1) * rowsPerPage + 1, contacts.length)} to{' '}
              {Math.min(currentPage * rowsPerPage, contacts.length)} of {contacts.length} entries
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * rowsPerPage >= contacts.length}
              className="px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {selectedContact && (
        <ContactModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  );
}