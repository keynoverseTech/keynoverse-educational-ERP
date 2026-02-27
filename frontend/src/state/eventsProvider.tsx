import React, { useState, useEffect, useMemo } from 'react';
import type { Event, EventCategory } from './eventsTypes';
import { EventsContext } from './eventsContext';

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<EventCategory[]>([
    { id: '1', name: 'Examination', description: 'Academic exams and assessments' },
    { id: '2', name: 'Holiday', description: 'Public and school holidays' },
    { id: '3', name: 'Conference', description: 'Academic and professional conferences' },
    { id: '4', name: 'Sports', description: 'Inter-house and inter-school sports' },
    { id: '5', name: 'Cultural', description: 'Cultural days and festivals' }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: 'e1',
      title: 'End of Term Exams',
      description: 'Final examinations for all students.',
      category: 'Examination',
      startDate: '2026-04-10',
      endDate: '2026-04-24',
      time: '09:00',
      venue: 'Exam Halls A & B',
      targetAudience: 'All Students',
      status: 'Upcoming',
      capacity: 500
    },
    {
      id: 'e2',
      title: 'Annual Science Fair',
      description: 'Exhibition of student science projects.',
      category: 'Conference',
      startDate: '2026-03-15',
      endDate: '2026-03-15',
      time: '10:00',
      venue: 'Main Auditorium',
      targetAudience: 'Students, Parents, Staff',
      status: 'Upcoming',
      capacity: 300
    },
    {
      id: 'e3',
      title: 'Staff Retreat',
      description: 'Annual planning retreat for academic staff.',
      category: 'Conference',
      startDate: '2026-01-05',
      endDate: '2026-01-07',
      time: '08:00',
      venue: 'Hilltop Resort',
      targetAudience: 'Academic Staff',
      status: 'Completed',
      capacity: 50
    }
  ]);

  const addEvent = (newEvent: Omit<Event, 'id' | 'status'>) => {
    const event: Event = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
      status: getEventStatus(newEvent.startDate, newEvent.endDate)
    };
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => {
      if (event.id === id) {
        return { ...event, ...updates };
      }
      return event;
    }));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const addCategory = (newCategory: Omit<EventCategory, 'id'>) => {
    const category: EventCategory = {
      ...newCategory,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCategories(prev => [...prev, category]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const getEventStatus = (start: string, end: string): 'Upcoming' | 'Ongoing' | 'Completed' => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return 'Upcoming';
    if (now >= startDate && now <= endDate) return 'Ongoing';
    return 'Completed';
  };

  // Auto-update statuses on mount
  useEffect(() => {
    setEvents(prev => prev.map(event => ({
      ...event,
      status: getEventStatus(event.startDate, event.endDate)
    })));
  }, []);

  const value = useMemo(() => ({
    events,
    categories,
    addEvent,
    updateEvent,
    deleteEvent,
    addCategory,
    deleteCategory
  }), [events, categories]);

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
