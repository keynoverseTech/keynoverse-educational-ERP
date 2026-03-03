import React, { useState } from 'react';
import { 
  User, 
  Save, 
  ArrowLeft,
  Phone,
  Droplet,
  Shield
} from 'lucide-react';

interface CreatePatientProfileProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

const CreatePatientProfile: React.FC<CreatePatientProfileProps> = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    userType: 'Student', // Student or Staff
    schoolId: '', // Matric No or Staff ID
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    genotype: '',
    allergies: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    preExistingConditions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation would go here
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <User size={24} />
            Create New Patient Profile
          </h2>
          <p className="text-blue-100 mt-2">Register a new student or staff member into the clinic system.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Basic Identity */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <Shield className="text-blue-500" size={20} /> Identity Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">User Type</label>
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                  {['Student', 'Staff'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, userType: type})}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                        formData.userType === type 
                          ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  {formData.userType === 'Student' ? 'Matric Number' : 'Staff ID'}
                </label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder={formData.userType === 'Student' ? 'e.g. ENG/2023/001' : 'e.g. STF/001'}
                  value={formData.schoolId}
                  onChange={(e) => setFormData({...formData, schoolId: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gender</label>
                <select 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Medical Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <Droplet className="text-red-500" size={20} /> Medical Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Blood Group</label>
                <select 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Genotype</label>
                <select 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.genotype}
                  onChange={(e) => setFormData({...formData, genotype: e.target.value})}
                >
                  <option value="">Select Genotype</option>
                  <option value="AA">AA</option>
                  <option value="AS">AS</option>
                  <option value="SS">SS</option>
                  <option value="AC">AC</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Allergies</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-24 resize-none"
                  placeholder="List any known allergies..."
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pre-existing Conditions</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-24 resize-none"
                  placeholder="Any chronic illnesses or conditions..."
                  value={formData.preExistingConditions}
                  onChange={(e) => setFormData({...formData, preExistingConditions: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <Phone className="text-green-500" size={20} /> Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({
                    ...formData, 
                    emergencyContact: {...formData.emergencyContact, name: e.target.value}
                  })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Relationship</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g. Parent, Sibling"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => setFormData({
                    ...formData, 
                    emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
                  })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData({
                    ...formData, 
                    emergencyContact: {...formData.emergencyContact, phone: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientProfile;