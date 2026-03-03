import React, { useState } from 'react';
import { 
  Palette, 
  Layout, 
  Save, 
  Eye, 
  Check
} from 'lucide-react';

interface TemplateConfig {
  primaryColor: string;
  secondaryColor: string;
  showSignature: boolean;
  layout: 'standard' | 'modern' | 'minimal';
  fields: {
    dob: boolean;
    bloodGroup: boolean;
    expiryDate: boolean;
    department: boolean;
  };
}

const IDCardTemplateDesigner: React.FC<{ type: 'Staff' | 'Student' }> = ({ type }) => {
  const [config, setConfig] = useState<TemplateConfig>({
    primaryColor: '#2563EB',
    secondaryColor: '#1E40AF',
    showSignature: true,
    layout: 'standard',
    fields: {
      dob: true,
      bloodGroup: true,
      expiryDate: true,
      department: true
    }
  });

  // Mock Preview Component
  const CardPreview = () => (
    <div className="w-[350px] h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden relative border border-gray-200">
      {/* Header Pattern */}
      <div 
        className="h-32 relative"
        style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
            <img src="https://i.pravatar.cc/300" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-14 px-6 text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{type === 'Staff' ? 'Senior Lecturer' : 'Computer Science'}</p>
        <p className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-3 py-1 rounded-full mt-2">
          ID: {type === 'Staff' ? 'STF/2024/001' : 'ENG/2024/001'}
        </p>
      </div>

      {/* Fields */}
      <div className="mt-8 px-8 space-y-3 text-left">
        {config.fields.department && (
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Department</span>
            <span className="text-sm font-medium text-gray-800">Computer Science</span>
          </div>
        )}
        {config.fields.dob && (
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">DOB</span>
            <span className="text-sm font-medium text-gray-800">12 May 1990</span>
          </div>
        )}
        {config.fields.bloodGroup && (
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Blood Group</span>
            <span className="text-sm font-medium text-gray-800">O+</span>
          </div>
        )}
        {config.fields.expiryDate && (
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Expires</span>
            <span className="text-sm font-medium text-red-600">Dec 2025</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-100 text-center">
        {config.showSignature && (
          <div className="mb-2">
            <p className="font-dancing-script text-lg text-gray-600">Registrar Sign</p>
          </div>
        )}
        <p className="text-[10px] text-gray-400">This card is property of Keynoverse University</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      {/* Configuration Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-[#151e32] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Palette className="text-blue-500" /> Template Configuration
          </h2>

          <div className="space-y-6">
            {/* Colors */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Brand Colors</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium mb-1 block dark:text-gray-300">Primary</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={config.primaryColor}
                      onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{config.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium mb-1 block dark:text-gray-300">Secondary</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{config.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Options */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Card Layout</label>
              <div className="grid grid-cols-3 gap-3">
                {['standard', 'modern', 'minimal'].map((layout) => (
                  <button
                    key={layout}
                    onClick={() => setConfig({...config, layout: layout as any})}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      config.layout === layout
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <Layout className="mx-auto mb-2" size={20} />
                    <span className="text-sm font-bold capitalize">{layout}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visible Fields */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Visible Fields</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(config.fields).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      value ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'
                    }`}>
                      {value && <Check size={14} />}
                    </div>
                    <input 
                      type="checkbox" 
                      checked={value}
                      onChange={() => setConfig({
                        ...config, 
                        fields: { ...config.fields, [key]: !value }
                      })}
                      className="hidden"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer w-fit">
                <input 
                  type="checkbox" 
                  checked={config.showSignature}
                  onChange={(e) => setConfig({...config, showSignature: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Authorized Signature</span>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
            <button className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
              Reset Default
            </button>
            <button className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Save size={18} /> Save Template
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold text-sm uppercase tracking-wider">
            <Eye size={16} /> Live Preview
          </div>
          <div className="flex justify-center p-8 bg-gray-100 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
            <CardPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardTemplateDesigner;