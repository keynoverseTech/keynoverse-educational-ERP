import React, { useState } from 'react';
import type { Book, BorrowingRecord, Reservation, BookCategory, LibraryContextValue } from './libraryTypes';
import { LibraryContext } from './libraryContext';

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<BookCategory[]>([
    { id: 'c1', name: 'Computer Science', description: 'Books related to CS, programming, and AI', createdAt: new Date().toISOString() },
    { id: 'c2', name: 'Software Architecture', description: 'System design and patterns', createdAt: new Date().toISOString() },
    { id: 'c3', name: 'History', description: 'Historical events and figures', createdAt: new Date().toISOString() },
    { id: 'c4', name: 'Politics', description: 'Political science and governance', createdAt: new Date().toISOString() }
  ]);

  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Advanced React Patterns',
      isbn: '978-0123456789',
      author: 'Lydia Hallie',
      category: 'Computer Science',
      quantity: 5,
      availableQuantity: 4,
      purchaseDate: '2025-01-15',
      price: 45.99,
      photoUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Modern Software Engineering',
      isbn: '978-9876543210',
      author: 'Dave Farley',
      category: 'Software Architecture',
      quantity: 3,
      availableQuantity: 0,
      purchaseDate: '2025-02-10',
      price: 55.00,
      photoUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    }
  ]);

  const [borrowings, setBorrowings] = useState<BorrowingRecord[]>([
    {
      id: 'b1',
      bookId: '1',
      bookTitle: 'Advanced React Patterns',
      borrowerId: 'S101',
      borrowerName: 'John Doe',
      borrowerType: 'Student',
      issueDate: '2026-02-20',
      dueDate: '2026-03-05',
      status: 'Issued'
    },
    {
      id: 'b2',
      bookId: '2',
      bookTitle: 'Modern Software Engineering',
      borrowerId: 'T202',
      borrowerName: 'Dr. Jane Smith',
      borrowerType: 'Staff',
      issueDate: '2026-02-15',
      dueDate: '2026-02-25',
      status: 'Overdue'
    }
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'r1',
      bookId: '2',
      bookTitle: 'Modern Software Engineering',
      reserverId: 'S102',
      reserverName: 'Alice Green',
      reserverType: 'Student',
      reservationDate: '2026-02-26',
      status: 'Pending'
    }
  ]);

  const addBook = (newBook: Omit<Book, 'id' | 'createdAt' | 'availableQuantity'>) => {
    const book: Book = {
      ...newBook,
      id: Math.random().toString(36).substr(2, 9),
      availableQuantity: newBook.quantity,
      createdAt: new Date().toISOString()
    };
    setBooks(prev => [...prev, book]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => {
      if (book.id === id) {
        const updatedBook = { ...book, ...updates };
        // Recalculate available quantity if quantity changed
        if (updates.quantity !== undefined) {
          const currentlyBorrowed = book.quantity - book.availableQuantity;
          updatedBook.availableQuantity = updates.quantity - currentlyBorrowed;
        }
        return updatedBook;
      }
      return book;
    }));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const addCategory = (newCategory: Omit<BookCategory, 'id' | 'createdAt'>) => {
    const category: BookCategory = {
      ...newCategory,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, category]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const issueBook = (record: Omit<BorrowingRecord, 'id' | 'status'>) => {
    const book = books.find(b => b.id === record.bookId);
    if (!book || book.availableQuantity <= 0) return;

    const newRecord: BorrowingRecord = {
      ...record,
      id: `b${Math.random().toString(36).substr(2, 9)}`,
      status: 'Issued'
    };

    setBorrowings(prev => [...prev, newRecord]);
    updateBook(record.bookId, { availableQuantity: book.availableQuantity - 1 });
  };

  const returnBook = (borrowingId: string) => {
    setBorrowings(prev => prev.map(b => {
      if (b.id === borrowingId) {
        const book = books.find(book => book.id === b.bookId);
        if (book) {
          updateBook(b.bookId, { availableQuantity: book.availableQuantity + 1 });
        }
        return { ...b, status: 'Returned', returnDate: new Date().toISOString() };
      }
      return b;
    }));
  };

  const reserveBook = (reservation: Omit<Reservation, 'id' | 'status' | 'reservationDate'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      reservationDate: new Date().toISOString(),
      status: 'Pending'
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const cancelReservation = (reservationId: string) => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: 'Cancelled' } : r
    ));
  };

  const value: LibraryContextValue = {
    books,
    setBooks,
    categories,
    setCategories,
    borrowings,
    setBorrowings,
    reservations,
    setReservations,
    addBook,
    updateBook,
    deleteBook,
    addCategory,
    deleteCategory,
    issueBook,
    returnBook,
    reserveBook,
    cancelReservation
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};
