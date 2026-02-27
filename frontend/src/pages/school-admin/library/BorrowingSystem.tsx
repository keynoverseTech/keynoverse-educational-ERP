import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  CheckCircle,
  X,
  History,
  BookOpen
} from 'lucide-react';
import { useLibrary } from '../../../state/libraryContext';
import type { BorrowingRecord, Book } from '../../../state/libraryTypes';

const BorrowingSystem: React.FC = () => {
  const { borrowings, books, issueBook, returnBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bookId: '',
    borrowerId: '',
    borrowerName: '',
    borrowerType: 'Student' as 'Student' | 'Staff',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days default
  });

  const filteredBorrowings = borrowings.filter((record: BorrowingRecord) => {
    const matchesSearch = record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.borrowerId.includes(searchTerm);
    
    const matchesTab = activeTab === 'active' 
      ? (record.status === 'Issued' || record.status === 'Overdue')
      : record.status === 'Returned';

    return matchesSearch && matchesTab;
  }).sort((a: BorrowingRecord, b: BorrowingRecord) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find(b => b.id === formData.bookId);
    if (!book) return;

    issueBook({
      ...formData,
      bookTitle: book.title,
      issueDate: new Date().toISOString().split('T')[0]
    });
    
    setIsModalOpen(false);
    setFormData({
      bookId: '',
      borrowerId: '',
      borrowerName: '',
      borrowerType: 'Student',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const getStatusStyle = (status: BorrowingRecord['status']) => {
    switch (status) {
      case 'Issued': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Returned': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            Circulations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Issue books to students and staff, track returns, and manage overdue loans.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Issue New Book
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Active Loans
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {borrowings.filter((b: BorrowingRecord) => b.status === 'Issued' || b.status === 'Overdue').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <History className="w-4 h-4" />
            Borrowing History
          </button>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by book, borrower name or ID..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Borrowing List */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredBorrowings.map((record: BorrowingRecord) => (
                <tr key={record.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <BookMarked className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{record.bookTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{record.borrowerName}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" /> {record.borrowerId} ({record.borrowerType})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                    {record.issueDate}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white">
                    {record.dueDate}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {record.status !== 'Returned' ? (
                      <button 
                        onClick={() => returnBook(record.id)}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"
                        title="Return Book"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Returned on {record.returnDate}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBorrowings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-3xl">
                        <Search className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No borrowing records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Issue Book</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Select Book</label>
                <select 
                  required
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                  value={formData.bookId}
                  onChange={e => setFormData({...formData, bookId: e.target.value})}
                >
                  <option value="">Choose a book...</option>
                  {books.filter((b: Book) => b.availableQuantity > 0).map((book: Book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.availableQuantity} left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Borrower Type</label>
                  <select 
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                    value={formData.borrowerType}
                    onChange={e => setFormData({...formData, borrowerType: e.target.value as 'Student' | 'Staff'})}
                  >
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Borrower ID</label>
                  <input 
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.borrowerId}
                    onChange={e => setFormData({...formData, borrowerId: e.target.value})}
                    placeholder="e.g. S101"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Borrower Name</label>
                <input 
                  required
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.borrowerName}
                  onChange={e => setFormData({...formData, borrowerName: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
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
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingSystem;
