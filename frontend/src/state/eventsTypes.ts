export interface EventCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string; // Category Name or ID
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String
  time: string;
  venue: string;
  targetAudience: string;
  bannerUrl?: string | null;
  documentUrl?: string | null;
  capacity?: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

export interface EventsContextType {
  events: Event[];
  categories: EventCategory[];
  addEvent: (event: Omit<Event, 'id' | 'status'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addCategory: (category: Omit<EventCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
}
