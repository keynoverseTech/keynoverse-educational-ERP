import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  User, 
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useLibrary } from '../../../state/libraryContext';
import type { Book, BookCategory } from '../../../state/libraryTypes';

const StudentBookCatalog: React.FC = () => {
  const { books, categories, reserveBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock student info (in a real app, this would come from auth context)
  const currentStudent = {
    id: 'ST-2024-001',
    name: 'John Doe',
    type: 'Student' as const
  };

  const categoryOptions = ['All', ...categories.map((c: BookCategory) => c.name)];

  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBorrowRequest = (book: Book) => {
    if (window.confirm(`Do you want to request to borrow "${book.title}"?`)) {
      reserveBook({
        bookId: book.id,
        bookTitle: book.title,
        reserverId: currentStudent.id,
        reserverName: currentStudent.name,
        reserverType: currentStudent.type,
      });
      alert('Reservation request sent successfully! Please collect your book from the library.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            Library Catalog
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Browse books and request to borrow.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
          {categoryOptions.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book: Book) => (
            <div key={book.id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={book.photoUrl || 'https://images.unsplash.com/photo-1543005124-8198f567096e?q=80&w=1974&auto=format&fit=crop'} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    book.availableQuantity > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {book.availableQuantity > 0 ? `${book.availableQuantity} Available` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white line-clamp-1" title={book.title}>{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> {book.author}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">
                      {book.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      ISBN: {book.isbn}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">
                    {book.description || 'No description available.'}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => handleBorrowRequest(book)}
                    disabled={book.availableQuantity === 0}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                      book.availableQuantity > 0 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {book.availableQuantity > 0 ? 'Borrow Book' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-4">
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">No books found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">
            {searchTerm || selectedCategory !== 'All' 
              ? "We couldn't find any books matching your search. Try adjusting your filters." 
              : "The library catalog is currently empty."}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentBookCatalog;
