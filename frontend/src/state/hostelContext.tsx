import React, { createContext, useContext, useState, type ReactNode } from 'react';

// --- Types ---

export interface Room {
  id: string;
  number: string;
  capacity: number;
  occupied: number;
  type: 'Single' | 'Double' | 'Dormitory';
  gender: 'Male' | 'Female' | 'Co-ed';
  floor: number;
}

export interface HostelBlock {
  id: string;
  name: string;
  type: 'Male' | 'Female' | 'Mixed';
  caretaker: string;
  totalRooms: number;
  totalCapacity: number;
  rooms: Room[];
}

export interface AllocationRequest {
  id: string;
  studentName: string;
  studentId: string;
  programme: string;
  level: string;
  gender: 'Male' | 'Female';
  requestedType: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Allocated';
  date: string;
  assignedRoom?: string; // e.g., "Block A - 101"
  assignedRoomId?: string;
  assignedBlockId?: string;
}

export interface BookingWindow {
  id: string;
  type: 'Hostel' | 'Transport';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  description: string;
  targetGroup: string;
}

interface HostelContextType {
  blocks: HostelBlock[];
  requests: AllocationRequest[];
  bookingWindows: BookingWindow[];
  
  // Actions
  addBlock: (block: Omit<HostelBlock, 'id' | 'rooms' | 'totalRooms' | 'totalCapacity'>) => void;
  updateBlock: (id: string, updates: Partial<HostelBlock>) => void;
  deleteBlock: (id: string) => void;
  
  addRoom: (blockId: string, room: Omit<Room, 'id' | 'occupied'>) => void;
  updateRoom: (blockId: string, roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (blockId: string, roomId: string) => void;
  
  addRequest: (request: Omit<AllocationRequest, 'id' | 'status' | 'date'>) => void;
  updateRequestStatus: (requestId: string, status: AllocationRequest['status'], roomId?: string, blockId?: string) => void;
  autoAllocate: () => { allocated: number; failed: number };
  manualAllocate: (requestId: string, blockId: string, roomId: string) => boolean;

  updateBookingWindow: (window: BookingWindow) => void;
}

// --- Initial Data ---

const initialBlocks: HostelBlock[] = [
  {
    id: '1',
    name: 'Block A (Male)',
    type: 'Male',
    caretaker: 'Mr. John Doe',
    totalRooms: 3,
    totalCapacity: 10,
    rooms: [
      { id: '101', number: '101', capacity: 4, occupied: 3, type: 'Dormitory', gender: 'Male', floor: 1 },
      { id: '102', number: '102', capacity: 4, occupied: 4, type: 'Dormitory', gender: 'Male', floor: 1 },
      { id: '103', number: '103', capacity: 2, occupied: 0, type: 'Double', gender: 'Male', floor: 1 },
    ]
  },
  {
    id: '2',
    name: 'Block B (Female)',
    type: 'Female',
    caretaker: 'Mrs. Jane Smith',
    totalRooms: 2,
    totalCapacity: 5,
    rooms: [
      { id: '201', number: '201', capacity: 4, occupied: 2, type: 'Dormitory', gender: 'Female', floor: 1 },
      { id: '202', number: '202', capacity: 1, occupied: 0, type: 'Single', gender: 'Female', floor: 1 },
    ]
  }
];

const initialRequests: AllocationRequest[] = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    studentId: 'STD/2024/001',
    programme: 'Computer Science',
    level: '100',
    gender: 'Male',
    requestedType: 'Dormitory',
    status: 'Pending',
    date: '2024-08-20'
  },
  {
    id: '2',
    studentName: 'Sarah Williams',
    studentId: 'STD/2024/045',
    programme: 'Economics',
    level: '200',
    gender: 'Female',
    requestedType: 'Single',
    status: 'Pending',
    date: '2024-08-18'
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    studentId: 'STD/2024/089',
    programme: 'Physics',
    level: '300',
    gender: 'Male',
    requestedType: 'Double',
    status: 'Pending',
    date: '2024-08-19'
  }
];

const initialWindows: BookingWindow[] = [
  {
    id: '1',
    type: 'Hostel',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    status: 'Active',
    description: 'First Semester 2024/2025 Allocation',
    targetGroup: 'All Students'
  }
];

// --- Context ---

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<HostelBlock[]>(initialBlocks);
  const [requests, setRequests] = useState<AllocationRequest[]>(initialRequests);
  const [bookingWindows, setBookingWindows] = useState<BookingWindow[]>(initialWindows);

  // --- Block Actions ---

  const addBlock = (blockData: Omit<HostelBlock, 'id' | 'rooms' | 'totalRooms' | 'totalCapacity'>) => {
    const newBlock: HostelBlock = {
      ...blockData,
      id: Date.now().toString(),
      rooms: [],
      totalRooms: 0,
      totalCapacity: 0
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<HostelBlock>) => {
    setBlocks(blocks.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // --- Room Actions ---

  const addRoom = (blockId: string, roomData: Omit<Room, 'id' | 'occupied'>) => {
    setBlocks(blocks.map(block => {
      if (block.id !== blockId) return block;
      
      const newRoom: Room = {
        ...roomData,
        id: Date.now().toString(),
        occupied: 0
      };
      
      const updatedRooms = [...block.rooms, newRoom];
      const totalCapacity = updatedRooms.reduce((sum, r) => sum + r.capacity, 0);
      
      return {
        ...block,
        rooms: updatedRooms,
        totalRooms: updatedRooms.length,
        totalCapacity
      };
    }));
  };

  const updateRoom = (blockId: string, roomId: string, updates: Partial<Room>) => {
    setBlocks(blocks.map(block => {
      if (block.id !== blockId) return block;
      
      const updatedRooms = block.rooms.map(r => r.id === roomId ? { ...r, ...updates } : r);
      const totalCapacity = updatedRooms.reduce((sum, r) => sum + r.capacity, 0);
      
      return {
        ...block,
        rooms: updatedRooms,
        totalCapacity
      };
    }));
  };

  const deleteRoom = (blockId: string, roomId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id !== blockId) return block;
      
      const updatedRooms = block.rooms.filter(r => r.id !== roomId);
      const totalCapacity = updatedRooms.reduce((sum, r) => sum + r.capacity, 0);
      
      return {
        ...block,
        rooms: updatedRooms,
        totalRooms: updatedRooms.length,
        totalCapacity
      };
    }));
  };

  // --- Request Actions ---

  const addRequest = (requestData: Omit<AllocationRequest, 'id' | 'status' | 'date'>) => {
    const newRequest: AllocationRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequestStatus = (requestId: string, status: AllocationRequest['status'], roomId?: string, blockId?: string) => {
    setRequests(requests.map(req => {
      if (req.id !== requestId) return req;
      
      // If allocating, we need to update room occupancy
      if (status === 'Allocated' && roomId && blockId) {
        // Find block and room name for display
        const block = blocks.find(b => b.id === blockId);
        const room = block?.rooms.find(r => r.id === roomId);
        const assignedRoomName = block && room ? `${block.name} - ${room.number}` : undefined;
        
        return { ...req, status, assignedRoom: assignedRoomName, assignedRoomId: roomId, assignedBlockId: blockId };
      }
      
      return { ...req, status };
    }));
  };

  const manualAllocate = (requestId: string, blockId: string, roomId: string): boolean => {
    // 1. Check if room exists and has space
    const block = blocks.find(b => b.id === blockId);
    if (!block) return false;
    
    const roomIndex = block.rooms.findIndex(r => r.id === roomId);
    if (roomIndex === -1) return false;
    
    const room = block.rooms[roomIndex];
    if (room.occupied >= room.capacity) return false;

    // 2. Update Room Occupancy
    const updatedBlocks = blocks.map(b => {
      if (b.id !== blockId) return b;
      const newRooms = [...b.rooms];
      newRooms[roomIndex] = { ...room, occupied: room.occupied + 1 };
      return { ...b, rooms: newRooms };
    });
    setBlocks(updatedBlocks);

    // 3. Update Request Status
    updateRequestStatus(requestId, 'Allocated', roomId, blockId);
    
    return true;
  };

  const autoAllocate = () => {
    let allocatedCount = 0;
    let failedCount = 0;
    
    // Create a copy of blocks to modify locally before setting state once
    const currentBlocks = JSON.parse(JSON.stringify(blocks)) as HostelBlock[];
    
    const pendingRequests = requests.filter(req => req.status === 'Pending');
    const updatedRequests = [...requests];

    pendingRequests.forEach(req => {
      // Find a suitable room
      let allocated = false;

      // Logic: Iterate blocks matching gender (or mixed), then rooms matching type and having space
      for (const block of currentBlocks) {
        if (block.type !== 'Mixed' && block.type !== req.gender) continue;

        for (const room of block.rooms) {
          if (room.type === req.requestedType && room.occupied < room.capacity && room.gender === req.gender) {
            
            // Allocate!
            room.occupied += 1;
            allocated = true;
            allocatedCount++;

            // Update request in our local list
            const reqIndex = updatedRequests.findIndex(r => r.id === req.id);
            if (reqIndex !== -1) {
              updatedRequests[reqIndex] = {
                ...updatedRequests[reqIndex],
                status: 'Allocated',
                assignedRoom: `${block.name} - ${room.number}`,
                assignedRoomId: room.id,
                assignedBlockId: block.id
              };
            }
            break; // Break room loop
          }
        }
        if (allocated) break; // Break block loop
      }

      if (!allocated) failedCount++;
    });

    // Update state
    setBlocks(currentBlocks);
    setRequests(updatedRequests);
    
    return { allocated: allocatedCount, failed: failedCount };
  };

  // --- Window Actions ---

  const updateBookingWindow = (window: BookingWindow) => {
    setBookingWindows(prev => prev.map(w => w.id === window.id ? window : w));
  };

  return (
    <HostelContext.Provider value={{
      blocks,
      requests,
      bookingWindows,
      addBlock,
      updateBlock,
      deleteBlock,
      addRoom,
      updateRoom,
      deleteRoom,
      addRequest,
      updateRequestStatus,
      autoAllocate,
      manualAllocate,
      updateBookingWindow
    }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (context === undefined) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
