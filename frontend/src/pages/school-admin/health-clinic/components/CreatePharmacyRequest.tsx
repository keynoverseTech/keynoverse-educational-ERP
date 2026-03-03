import React, { useState } from 'react';
import { 
  Pill, 
  Save, 
  ArrowLeft, 
  Package,
  AlertTriangle,
  CheckCircle2,
  Box,
  Thermometer
} from 'lucide-react';

interface CreatePharmacyRequestProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const CreatePharmacyRequest: React.FC<CreatePharmacyRequestProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Medication',
    quantity: '',
    unit: 'Box', 
    urgency: 'Routine',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const urgencyLevels = [
    { id: 'Routine', label: 'Routine', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 'Urgent', label: 'Urgent', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: 'Emergency', label: 'Critical', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
      >
        <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="font-bold">Back to Requests</span>
      </button>

      <div className="bg-white dark:bg-[#151e32] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Pill size={32} className="text-emerald-100" />
              New Pharmacy Requisition
            </h2>
            <p className="text-emerald-50 mt-2 max-w-xl">
              Submit a request for new stock, medications, or medical supplies. 
              Please verify current inventory levels before ordering.
            </p>
          </div>
          <Pill className="absolute -right-12 -bottom-12 text-white opacity-10 rotate-12" size={200} />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section 1: Urgency Selection */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Urgency Level</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgencyLevels.map((level) => (
                <div 
                  key={level.id}
                  onClick={() => setFormData({...formData, urgency: level.id})}
                  className={`cursor-pointer relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                    formData.urgency === level.id 
                      ? `${level.bg} ${level.border} dark:bg-opacity-10 dark:border-opacity-50` 
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${formData.urgency === level.id ? 'bg-white/80' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <level.icon size={20} className={level.color} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${formData.urgency === level.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {level.label}
                      </h4>
                    </div>
                  </div>
                  {formData.urgency === level.id && (
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${level.color.replace('text-', 'bg-')}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

          {/* Section 2: Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="relative group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Item Name</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    required
                    type="text" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-emerald-500/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl outline-none transition-all font-medium"
                    placeholder="e.g. Paracetamol 500mg"
                    value={formData.itemName}
                    onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Category</label>
                <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                  {['Medication', 'Consumables', 'Equipment'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`py-2 text-sm font-bold rounded-lg transition-all ${
                        formData.category === cat
                          ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Quantity</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-emerald-500/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl outline-none transition-all font-medium"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Unit</label>
                  <div className="relative">
                    <Box className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      className="w-full pl-10 pr-8 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-emerald-500/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl outline-none transition-all appearance-none font-medium text-gray-700 dark:text-gray-300"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    >
                      <option value="Box">Box</option>
                      <option value="Pack">Pack</option>
                      <option value="Bottle">Bottle</option>
                      <option value="Strip">Strip</option>
                      <option value="Unit">Single Unit</option>
                      <option value="Carton">Carton</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Notes</label>
                <textarea 
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-24 resize-none text-sm"
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Save size={20} />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePharmacyRequest;