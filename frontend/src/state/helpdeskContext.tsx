import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
}

export interface Ticket {
  id: string;
  ticketId: string;
  categoryId: string;
  categoryName: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  isAnonymous: boolean;
  hasAttachment: boolean;
  dateCreated: string;
  lastUpdated: string;
}

interface HelpDeskContextValue {
  categories: TicketCategory[];
  tickets: Ticket[];
  addCategory: (category: Omit<TicketCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
  createTicket: (ticket: Omit<Ticket, 'id' | 'ticketId' | 'status' | 'dateCreated' | 'lastUpdated' | 'categoryName'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
}

const HelpDeskContext = createContext<HelpDeskContextValue | undefined>(undefined);

const initialCategories: TicketCategory[] = [
  { id: '1', name: 'Academic Issues', description: 'Issues related to courses, grades, and transcripts' },
  { id: '2', name: 'Examination Issues', description: 'Problems with exam schedules, results, or venues' },
  { id: '3', name: 'Finance Issues', description: 'Tuition fees, payments, and invoices' },
  { id: '4', name: 'IT Support', description: 'Portal access, email issues, and technical support' },
];

const initialTickets: Ticket[] = [
  {
    id: '1',
    ticketId: 'TKT-2024-001',
    categoryId: '1',
    categoryName: 'Academic Issues',
    subject: 'Missing Grade in CSC 301',
    description: 'I cannot see my grade for Operating Systems despite sitting for the exam.',
    priority: 'High',
    status: 'In Progress',
    isAnonymous: false,
    hasAttachment: false,
    dateCreated: '2024-03-15',
    lastUpdated: '2024-03-16'
  }
];

export const HelpDeskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<TicketCategory[]>(initialCategories);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const addCategory = (categoryData: Omit<TicketCategory, 'id'>) => {
    const newCategory: TicketCategory = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories([newCategory, ...categories]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'ticketId' | 'status' | 'dateCreated' | 'lastUpdated' | 'categoryName'>) => {
    const category = categories.find(c => c.id === ticketData.categoryId);
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      ticketId: `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryName: category ? category.name : 'Unknown',
      status: 'Open',
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTickets([newTicket, ...tickets]);
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets(tickets.map(t => 
      t.id === id ? { ...t, status, lastUpdated: new Date().toISOString().split('T')[0] } : t
    ));
  };

  return (
    <HelpDeskContext.Provider value={{
      categories,
      tickets,
      addCategory,
      deleteCategory,
      createTicket,
      updateTicketStatus
    }}>
      {children}
    </HelpDeskContext.Provider>
  );
};

export const useHelpDesk = () => {
  const context = useContext(HelpDeskContext);
  if (!context) {
    throw new Error('useHelpDesk must be used within HelpDeskProvider');
  }
  return context;
};
