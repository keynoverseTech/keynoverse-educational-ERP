import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Calendar, 
  History,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useLibrary } from '../../../state/libraryContext';
import type { BorrowingRecord } from '../../../state/libraryTypes';

const StudentBorrowingHistory: React.FC = () => {
  const { borrowings } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Mock student info (in a real app, this would come from auth context)
  const currentStudent = {
    id: 'ST-2024-001',
    name: 'John Doe',
    type: 'Student' as const
  };

  const myBorrowings = borrowings.filter(record => record.borrowerId === currentStudent.id);

  const filteredBorrowings = myBorrowings.filter((record: BorrowingRecord) => {
    const matchesSearch = record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'active' 
      ? (record.status === 'Issued' || record.status === 'Overdue')
      : record.status === 'Returned';

    return matchesSearch && matchesTab;
  }).sort((a: BorrowingRecord, b: BorrowingRecord) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const getStatusColor = (status: BorrowingRecord['status']) => {
    switch (status) {
      case 'Issued': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Returned': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
      default: return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: BorrowingRecord['status']) => {
    switch (status) {
      case 'Issued': return <Clock className="w-3 h-3" />;
      case 'Returned': return <CheckCircle2 className="w-3 h-3" />;
      case 'Overdue': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            My Borrows
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track your current loans and borrowing history.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Active Loans
            <span className={`px-2 py-0.5 rounded-full text-[10px] ml-2 ${
              activeTab === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {myBorrowings.filter((b: BorrowingRecord) => b.status === 'Issued' || b.status === 'Overdue').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by book title..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Borrowing List */}
      {filteredBorrowings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBorrowings.map((record: BorrowingRecord) => (
            <div key={record.id} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <BookMarked className="w-6 h-6" />
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(record.status)}`}>
                  {getStatusIcon(record.status)}
                  {record.status}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 line-clamp-2">
                {record.bookTitle}
              </h3>
              
              <div className="mt-6 space-y-3 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Issue Date
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{record.issueDate}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Due Date
                  </span>
                  <span className={`font-bold ${
                    new Date(record.dueDate) < new Date() && record.status !== 'Returned' 
                      ? 'text-rose-600' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {record.dueDate}
                  </span>
                </div>

                {record.returnDate && (
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Returned On</span>
                    <span className="font-bold text-emerald-600">{record.returnDate}</span>
                  </div>
                )}
              </div>

              {record.status === 'Overdue' && (
                <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800">
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    This book is overdue. Please return it to the library as soon as possible.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-4">
            <History className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">No borrowing records</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">
            {searchTerm 
              ? "We couldn't find any borrowing records matching your search." 
              : activeTab === 'active' 
                ? "You don't have any books currently checked out." 
                : "You haven't borrowed any books yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentBorrowingHistory;
