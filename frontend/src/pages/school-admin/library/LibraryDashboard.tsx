import React from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Clock, 
  TrendingUp, 
  BookMarked,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLibrary } from '../../../state/libraryContext';

const LibraryDashboard: React.FC = () => {
  const { books, borrowings, reservations } = useLibrary();

  // Calculate statistics
  const totalBooks = books.reduce((acc: number, book: any) => acc + book.quantity, 0);
  const activeBorrowings = borrowings.filter((b: any) => b.status === 'Issued' || b.status === 'Overdue').length;
  const overdueBooks = borrowings.filter((b: any) => b.status === 'Overdue').length;
  const pendingReservations = reservations.filter((r: any) => r.status === 'Pending').length;

  // Mock popularity data (top 3 most borrowed)
  const popularityData = books
    .map((book: any) => ({
      title: book.title,
      author: book.author,
      borrowCount: Math.floor(Math.random() * 50) + 10, // Mock count
      category: book.category,
      photoUrl: book.photoUrl
    }))
    .sort((a: any, b: any) => b.borrowCount - a.borrowCount)
    .slice(0, 3);

  const stats = [
    { 
      label: 'Total Books', 
      value: totalBooks.toLocaleString(), 
      icon: BookOpen, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      trend: '+12 this month',
      trendUp: true
    },
    { 
      label: 'Active Loans', 
      value: activeBorrowings.toLocaleString(), 
      icon: BookMarked, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '5 returned today',
      trendUp: true
    },
    { 
      label: 'Overdue', 
      value: overdueBooks.toLocaleString(), 
      icon: Clock, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      trend: '-2 from last week',
      trendUp: false
    },
    { 
      label: 'Reservations', 
      value: pendingReservations.toLocaleString(), 
      icon: Bookmark, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: '3 new requests',
      trendUp: true
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          Library Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Monitor book circulation, inventory health, and reservation queues.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Popular Books */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Most Requested Books
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on borrowing frequency this term.</p>
            </div>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {popularityData.map((book: any, idx: number) => (
              <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img src={book.photoUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    #{idx + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">{book.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                      {book.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <BookMarked className="w-3 h-3" />
                      {book.borrowCount} checkouts
                    </span>
                  </div>
                </div>
                <div className="hidden md:block w-32">
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(book.borrowCount / popularityData[0].borrowCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BookOpen className="w-48 h-48" />
            </div>
            <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
            <p className="text-indigo-100 text-sm mb-6">Common library management tasks.</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-left">
                <div className="p-2 bg-white/20 rounded-lg w-fit mb-3">
                  <BookMarked className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">Issue Book</span>
              </button>
              <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-left">
                <div className="p-2 bg-white/20 rounded-lg w-fit mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">Return Book</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Upcoming Returns</h2>
            <div className="space-y-4">
              {borrowings.filter((b: any) => b.status === 'Issued').slice(0, 3).map((loan: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{loan.bookTitle}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Due: {loan.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
