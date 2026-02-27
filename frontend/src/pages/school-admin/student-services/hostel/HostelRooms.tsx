import React, { useState } from 'react';
import { Building, Plus, Trash2, Edit, BedDouble, Users, X } from 'lucide-react';
import { useHostel } from '../../../../state/hostelContext';

const HostelRooms: React.FC = () => {
  const { blocks, addBlock, deleteBlock, addRoom, deleteRoom } = useHostel();

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  
  // Modals
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Form State - Block
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockType, setNewBlockType] = useState<'Male' | 'Female' | 'Mixed'>('Male');
  const [newBlockCaretaker, setNewBlockCaretaker] = useState('');

  // Form State - Room
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(4);
  const [newRoomType, setNewRoomType] = useState<'Single' | 'Double' | 'Dormitory'>('Dormitory');
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [newRoomGender, setNewRoomGender] = useState<'Male' | 'Female' | 'Co-ed'>('Male');

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    addBlock({
      name: newBlockName,
      type: newBlockType,
      caretaker: newBlockCaretaker,
    });
    setIsBlockModalOpen(false);
    // Reset form
    setNewBlockName('');
    setNewBlockCaretaker('');
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBlockId) return;

    addRoom(activeBlockId, {
      number: newRoomNumber,
      capacity: newRoomCapacity,
      type: newRoomType,
      floor: newRoomFloor,
      gender: newRoomGender
    });
    setIsRoomModalOpen(false);
    // Reset form
    setNewRoomNumber('');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Rooms & Blocks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage hostel buildings, rooms, and capacity.</p>
        </div>
        <button 
          onClick={() => setIsBlockModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Hostel Block
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hostel Blocks List */}
        <div className="space-y-4 lg:col-span-1">
          {blocks.map(block => (
            <div 
              key={block.id}
              onClick={() => setActiveBlockId(block.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeBlockId === block.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Building size={20} className="text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{block.name}</h3>
                </div>
                <div className="flex gap-2">
                   <span className={`text-xs px-2 py-1 rounded-full ${
                    block.type === 'Male' ? 'bg-blue-100 text-blue-700' : 
                    block.type === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {block.type}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); if(activeBlockId === block.id) setActiveBlockId(null); }}
                    className="p-1 hover:bg-red-100 text-red-500 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 mt-3">
                <div className="flex items-center gap-1">
                  <BedDouble size={14} />
                  <span>{block.totalRooms} Rooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{block.totalCapacity} Beds</span>
                </div>
              </div>
            </div>
          ))}
          
          {blocks.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
              <p className="text-gray-500">No blocks found. Create one to get started.</p>
            </div>
          )}
        </div>

        {/* Rooms Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 min-h-[400px]">
          {activeBlock ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Rooms in {activeBlock.name}
                  </h2>
                  <p className="text-sm text-gray-500">Caretaker: {activeBlock.caretaker || 'Not assigned'}</p>
                </div>
                <button 
                  onClick={() => setIsRoomModalOpen(true)}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus size={16} /> Add Room
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Room No.</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Floor</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Occupancy</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {activeBlock.rooms.map(room => (
                      <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{room.number}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{room.floor}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {room.type} <span className="text-xs text-gray-400">({room.gender})</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  room.occupied === room.capacity ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {room.occupied}/{room.capacity}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-blue-600">
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => deleteRoom(activeBlock.id, room.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activeBlock.rooms.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                          <p>No rooms added to this block yet.</p>
                          <button onClick={() => setIsRoomModalOpen(true)} className="text-blue-600 mt-2 hover:underline">Add your first room</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Building size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a hostel block</p>
              <p className="text-sm">Click on a block from the left list to manage its rooms.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Block Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Add New Hostel Block</h3>
              <button onClick={() => setIsBlockModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBlock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Block Name</label>
                <input 
                  type="text" 
                  required
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. Block C" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Caretaker Name</label>
                <input 
                  type="text" 
                  value={newBlockCaretaker}
                  onChange={(e) => setNewBlockCaretaker(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="Optional" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type</label>
                <select 
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value as 'Male' | 'Female' | 'Mixed')}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsBlockModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Block</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Add New Room</h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Room Number</label>
                  <input 
                    type="text" 
                    required
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    placeholder="e.g. 101" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Floor</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Capacity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type</label>
                  <select 
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as 'Single' | 'Double' | 'Dormitory')}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Dormitory">Dormitory</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Gender Allocation</label>
                <select 
                  value={newRoomGender}
                  onChange={(e) => setNewRoomGender(e.target.value as 'Male' | 'Female' | 'Co-ed')}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                  <option value="Co-ed">Co-ed (Mixed)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelRooms;
