import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  ShoppingCart, 
  CheckCircle 
} from 'lucide-react';
import CreatePharmacyRequest from './CreatePharmacyRequest';

const PharmacyRequest: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <CreatePharmacyRequest 
        onCancel={() => setIsCreating(false)}
        onSubmit={(data) => {
          console.log('Submitted Request:', data);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Pill className="text-green-600" />
          Pharmacy Requests
        </h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Requisition
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <ShoppingCart size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Paracetamol Restock</h4>
                    <p className="text-xs text-gray-500">Requested by: Dr. Sarah • 2 hrs ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold uppercase">Pending</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Recent Approvals</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Antibiotics Batch A</p>
                <p className="text-xs text-gray-500">Approved yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyRequest;
