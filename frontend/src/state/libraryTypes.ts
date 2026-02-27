import type React from 'react';

export interface Book {
  id: string;
  title: string;
  isbn: string;
  author: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  purchaseDate: string;
  price: number;
  photoUrl?: string;
  description?: string;
  createdAt: string;
}

export interface BorrowingRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerType: 'Student' | 'Staff';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount?: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  reserverId: string;
  reserverName: string;
  reserverType: 'Student' | 'Staff';
  reservationDate: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled';
}

export interface BookCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface LibraryContextValue {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  categories: BookCategory[];
  setCategories: React.Dispatch<React.SetStateAction<BookCategory[]>>;
  borrowings: BorrowingRecord[];
  setBorrowings: React.Dispatch<React.SetStateAction<BorrowingRecord[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  
  // Helper methods
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'availableQuantity'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addCategory: (category: Omit<BookCategory, 'id' | 'createdAt'>) => void;
  deleteCategory: (id: string) => void;
  issueBook: (record: Omit<BorrowingRecord, 'id' | 'status'>) => void;
  returnBook: (borrowingId: string) => void;
  reserveBook: (reservation: Omit<Reservation, 'id' | 'status' | 'reservationDate'>) => void;
  cancelReservation: (reservationId: string) => void;
}
