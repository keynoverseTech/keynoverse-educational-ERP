import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Search, 
  Layers,
  FileText
} from 'lucide-react';
import { useLibrary } from '../../../state/libraryContext';
import type { BookCategory } from '../../../state/libraryTypes';

const BookCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, books } = useLibrary();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const searchLower = searchTerm.toLowerCase();
  const filteredCategories = categories.filter((cat: BookCategory) => 
    cat.name.toLowerCase().includes(searchLower) ||
    cat.description?.toLowerCase().includes(searchLower)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    addCategory({
      name: newCategory.name,
      description: newCategory.description
    });
    setNewCategory({ name: '', description: '' });
  };

  const handleDelete = (id: string) => {
    const category = categories.find((c: BookCategory) => c.id === id);
    const hasBooks = books.some((b) => b.category === category?.name);
    
    if (hasBooks) {
      alert('Cannot delete this category because it contains books.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-pink-600 rounded-xl shadow-lg shadow-pink-500/20">
              <Tag className="w-6 h-6 text-white" />
            </div>
            Book Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Organize your library collection by defining clear categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm sticky top-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-600" />
              Add New Category
            </h2>
            
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Category Name</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                    value={newCategory.name}
                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="e.g. Science Fiction"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                  value={newCategory.description}
                  onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Optional description..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 transition-all active:scale-95"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((category: BookCategory) => {
              const bookCount = books.filter((b) => b.category === category.name).length;
              
              return (
                <div key={category.id} className="group bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                    {category.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-xl w-fit">
                    <FileText className="w-3 h-3" />
                    {bookCount} Books Linked
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCategories;
