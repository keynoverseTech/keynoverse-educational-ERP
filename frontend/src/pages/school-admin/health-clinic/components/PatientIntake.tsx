import React, { useState } from 'react';
import { 
  Search, 
  Save, 
  User, 
  Activity, 
  FileText,
  AlertCircle,
  Thermometer,
  Heart,
  Scale,
  Stethoscope
} from 'lucide-react';

const PatientIntake: React.FC = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    vitals: { bp: '', temp: '', pulse: '', weight: '' },
    symptoms: '',
    admissionRequired: false,
    diagnosis: ''
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#151e32] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Activity size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Patient Intake</h2>
              <p className="text-blue-100 mt-1">Record vitals, diagnosis, and admission details.</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Section 1: Patient Search */}
          <div className="relative group">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Patient Identification</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by Student/Staff ID or Name..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none font-medium text-lg shadow-inner transition-all"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              />
              {formData.patientId && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <User size={12} /> Verified
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Vitals Grid */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Activity className="text-red-500" size={20} /> 
              Vital Signs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Blood Pressure', icon: Activity, unit: 'mmHg', key: 'bp', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', placeholder: '120/80' },
                { label: 'Temperature', icon: Thermometer, unit: '°C', key: 'temp', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', placeholder: '36.5' },
                { label: 'Pulse Rate', icon: Heart, unit: 'bpm', key: 'pulse', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', placeholder: '72' },
                { label: 'Weight', icon: Scale, unit: 'kg', key: 'weight', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', placeholder: '70.5' },
              ].map((vital) => (
                <div key={vital.key} className="relative group">
                  <div className={`absolute inset-0 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100 ${vital.bg} blur-xl`}></div>
                  <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">{vital.label}</span>
                      <vital.icon size={16} className={vital.color} />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <input 
                        type="text" 
                        className="w-full bg-transparent text-2xl font-bold text-gray-900 dark:text-white outline-none placeholder-gray-300 dark:placeholder-gray-700"
                        placeholder={vital.placeholder}
                        value={(formData.vitals as any)[vital.key]}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, [vital.key]: e.target.value}
                        })}
                      />
                      <span className="text-xs font-bold text-gray-400">{vital.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Clinical Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Stethoscope className="text-blue-500" size={20} /> 
                  Diagnosis & Symptoms
                </h3>
                <div className="relative">
                  <textarea 
                    className="w-full p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[160px] resize-none text-gray-700 dark:text-gray-300 leading-relaxed shadow-inner"
                    placeholder="Describe patient's chief complaint, observed symptoms, and initial diagnosis..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  />
                  <div className="absolute top-4 right-4">
                    <FileText className="text-gray-300" size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <AlertCircle className="text-orange-500" size={20} /> 
                Action Required
              </h3>
              
              <div 
                onClick={() => setFormData({...formData, admissionRequired: !formData.admissionRequired})}
                className={`cursor-pointer group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-6 ${
                  formData.admissionRequired 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-lg shadow-red-500/10' 
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50'
                }`}
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`p-3 rounded-full transition-colors ${
                    formData.admissionRequired ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${
                      formData.admissionRequired ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      Immediate Admission
                    </h4>
                    <p className={`text-sm mt-1 ${
                      formData.admissionRequired ? 'text-red-600/80 dark:text-red-400/80' : 'text-gray-500'
                    }`}>
                      Flag this patient for urgent care and ward allocation.
                    </p>
                  </div>
                </div>
                {/* Background Pattern */}
                {formData.admissionRequired && (
                  <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12">
                    <AlertCircle size={120} className="text-red-500" />
                  </div>
                )}
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                <Save size={20} />
                Register Visit
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientIntake;