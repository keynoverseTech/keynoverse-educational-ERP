import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Plus, 
  X,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useLibrary } from '../../../state/libraryContext';
import type { Reservation } from '../../../state/libraryTypes';

const ReservationSystem: React.FC = () => {
  const { reservations, books, reserveBook, cancelReservation } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bookId: '',
    reserverId: '',
    reserverName: '',
    reserverType: 'Student' as 'Student' | 'Staff'
  });

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.reserverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         res.reserverId.includes(searchTerm);
    return matchesSearch;
  }).sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find(b => b.id === formData.bookId);
    if (!book) return;

    reserveBook({
      ...formData,
      bookTitle: book.title
    });
    
    setIsModalOpen(false);
    setFormData({
      bookId: '',
      reserverId: '',
      reserverName: '',
      reserverType: 'Student'
    });
  };

  const getStatusStyle = (status: Reservation['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Fulfilled': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-amber-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            Reservation System
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage book holds and waiting lists for high-demand titles.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      {/* Info Alert */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">About Reservations</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Staff and students can reserve books that are currently out of stock. When a book is returned, 
            the library staff will notify the first person in the queue.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by book or reserver..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Reservations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Book Title</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Reserver</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Requested On</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-900 dark:text-white">{res.bookTitle}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{res.reserverName}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{res.reserverId} ({res.reserverType})</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {res.reservationDate}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {res.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => cancelReservation(res.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Cancel Reservation"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                    No active reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Place Hold</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Select Book</label>
                <select 
                  required
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                  value={formData.bookId}
                  onChange={e => setFormData({...formData, bookId: e.target.value})}
                >
                  <option value="">Choose a book...</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} {book.availableQuantity <= 0 ? '(Out of Stock)' : `(${book.availableQuantity} available)`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Reserver Type</label>
                  <select 
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                    value={formData.reserverType}
                    onChange={e => setFormData({...formData, reserverType: e.target.value as 'Student' | 'Staff'})}
                  >
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Reserver ID</label>
                  <input 
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData.reserverId}
                    onChange={e => setFormData({...formData, reserverId: e.target.value})}
                    placeholder="e.g. S102"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Reserver Name</label>
                <input 
                  required
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.reserverName}
                  onChange={e => setFormData({...formData, reserverName: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition-all active:scale-95"
                >
                  Place Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationSystem;
