import React, { useState, useEffect } from 'react';
import { DownloadCloud, User, Clock } from 'lucide-react';
import { courseMaterialService } from './service';
import type { DownloadLogEntry, CourseMaterial } from './types';

const DownloadLog: React.FC = () => {
  const [log, setLog] = useState<DownloadLogEntry[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);

  useEffect(() => {
    setLog(courseMaterialService.getDownloadLog());
    setMaterials(courseMaterialService.getMaterials());
  }, []);

  const getMaterialTitle = (materialId: string) => {
    return materials.find(m => m.id === materialId)?.title || 'Unknown Material';
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><DownloadCloud /> Download Log</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Material</th>
              <th className="text-left p-2">Student</th>
              <th className="text-left p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {log.map(entry => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{getMaterialTitle(entry.materialId)}</td>
                <td className="p-2 flex items-center gap-2"><User size={14} /> {entry.studentName} ({entry.studentId})</td>
                <td className="p-2 flex items-center gap-2"><Clock size={14} /> {new Date(entry.downloadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadLog;
