import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Shield, 
  Landmark,
  Award
} from 'lucide-react';

const ProfileView = () => {
  // Mock Profile Data
  const profile = {
    firstName: 'Sarah',
    lastName: 'Connor',
    staffId: 'STF/2015/001',
    email: 'sarah.connor@uni.edu',
    phone: '+234 801 234 5678',
    role: 'Senior Lecturer',
    department: 'Computer Science',
    status: 'Active',
    joinDate: '2015-01-10',
    gender: 'Female',
    dob: '1985-05-12',
    address: '123 Tech Avenue, Silicon Valley, Lagos',
    nin: '12345678901',
    qualifications: 'PhD Computer Science, MSc Artificial Intelligence',
    bankName: 'First Bank',
    accountNumber: '3045678901',
    accountName: 'Sarah Connor',
    nextOfKin: 'Kyle Reese',
    nextOfKinPhone: '+234 809 876 5432'
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="relative">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl"></div>
        
        {/* Profile Header */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-lg">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-4xl font-bold text-gray-400">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{profile.role} • {profile.department}</p>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Key Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Staff ID</p>
                <p className="font-bold text-gray-900 dark:text-white">{profile.staffId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Status</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {profile.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Date Employed</p>
                <p className="font-bold text-gray-900 dark:text-white">{profile.joinDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-300">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-300">{profile.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="text-blue-600" size={20} /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1">{profile.gender}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1">{profile.dob}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">NIN Number</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1">{profile.nin}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qualifications</label>
                <div className="flex items-start gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <Award className="text-orange-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-gray-900 dark:text-white text-sm">{profile.qualifications}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Landmark className="text-green-600" size={20} /> Bank Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Name</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1">{profile.bankName}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Number</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1 font-mono">{profile.accountNumber}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Name</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1">{profile.accountName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
