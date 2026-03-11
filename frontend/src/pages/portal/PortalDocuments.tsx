import { useState } from 'react';
import { FileText, Edit2, CheckCircle2, AlertCircle, Upload, Eye, Trash2, ShieldCheck } from 'lucide-react';

const PortalDocuments = () => {
  const [documents] = useState([
    { id: 1, name: 'Institution Logo', status: 'Verified', date: 'Oct 14, 2023', size: '1.2 MB', type: 'PNG' },
    { id: 2, name: 'Accreditation Letter', status: 'Pending Review', date: 'Oct 14, 2023', size: '4.5 MB', type: 'PDF' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and update your institution's onboarding documents.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all">
          <Upload size={18} />
          Upload New Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
               <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Uploaded Documents</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {documents.map((doc) => (
                <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="text-base font-black text-gray-900 dark:text-white">{doc.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-0.5 flex items-center gap-2">
                         <span>{doc.type} • {doc.size}</span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full" />
                         <span>Uploaded {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      doc.status === 'Verified' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                    }`}>
                      {doc.status === 'Verified' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {doc.status}
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="View Document">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all" title="Edit/Replace">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Document Guidelines</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                 <div className="text-xs font-black text-gray-900 dark:text-white mb-1">Logo Requirements</div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                   High resolution PNG or JPG, square aspect ratio recommended, minimum 500x500px.
                 </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                 <div className="text-xs font-black text-gray-900 dark:text-white mb-1">Accreditation Letter</div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                   Scanned PDF of the official NBTE accreditation letter. Must be clear and legible.
                 </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/20">
             <ShieldCheck size={32} className="mb-4 text-indigo-200" />
             <h3 className="text-lg font-black leading-tight">Verification in progress</h3>
             <p className="text-sm text-indigo-100/90 mt-2 font-medium">
               Once uploaded, documents are reviewed by the NBTE compliance team. This usually takes 48-72 hours.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDocuments;
