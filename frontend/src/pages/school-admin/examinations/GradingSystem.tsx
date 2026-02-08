import React, { useState } from 'react';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';

interface GradeScale {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  point: number;
  description: string;
}

interface CGPAPolicy {
  minPassMark: number;
  probationThreshold: number;
  graduationThreshold: number;
  maxCarryOverUnits: number;
}

const GradingSystem: React.FC = () => {
  const [gradingScales, setGradingScales] = useState<GradeScale[]>([
    { id: '1', grade: 'A', minScore: 70, maxScore: 100, point: 5.0, description: 'Excellent' },
    { id: '2', grade: 'B', minScore: 60, maxScore: 69, point: 4.0, description: 'Very Good' },
    { id: '3', grade: 'C', minScore: 50, maxScore: 59, point: 3.0, description: 'Good' },
    { id: '4', grade: 'D', minScore: 45, maxScore: 49, point: 2.0, description: 'Fair' },
    { id: '5', grade: 'E', minScore: 40, maxScore: 44, point: 1.0, description: 'Pass' },
    { id: '6', grade: 'F', minScore: 0, maxScore: 39, point: 0.0, description: 'Fail' },
  ]);

  const [policy, setPolicy] = useState<CGPAPolicy>({
    minPassMark: 40,
    probationThreshold: 1.5,
    graduationThreshold: 1.5,
    maxCarryOverUnits: 24,
  });

  const handleAddScale = () => {
    const newScale: GradeScale = {
      id: Date.now().toString(),
      grade: '',
      minScore: 0,
      maxScore: 0,
      point: 0,
      description: '',
    };
    setGradingScales([...gradingScales, newScale]);
  };

  const handleDeleteScale = (id: string) => {
    setGradingScales(gradingScales.filter((s) => s.id !== id));
  };

  const handleScaleChange = (id: string, field: keyof GradeScale, value: string | number) => {
    setGradingScales(
      gradingScales.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grading System & CGPA</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure institutional grading policies</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Save size={20} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grading Scale */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Grading Scale (5.0 System)</h2>
              <button
                onClick={handleAddScale}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus size={16} />
                Add Grade
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-2">Grade</th>
                      <th className="py-3 px-2">Min Score (%)</th>
                      <th className="py-3 px-2">Max Score (%)</th>
                      <th className="py-3 px-2">Points</th>
                      <th className="py-3 px-2">Description</th>
                      <th className="py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {gradingScales.map((scale) => (
                      <tr key={scale.id} className="text-sm">
                        <td className="py-3 px-2">
                          <input
                            type="text"
                            value={scale.grade}
                            onChange={(e) => handleScaleChange(scale.id, 'grade', e.target.value)}
                            className="w-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-center"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            value={scale.minScore}
                            onChange={(e) => handleScaleChange(scale.id, 'minScore', parseInt(e.target.value))}
                            className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-center"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            value={scale.maxScore}
                            onChange={(e) => handleScaleChange(scale.id, 'maxScore', parseInt(e.target.value))}
                            className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-center"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            step="0.1"
                            value={scale.point}
                            onChange={(e) => handleScaleChange(scale.id, 'point', parseFloat(e.target.value))}
                            className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-center"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="text"
                            value={scale.description}
                            onChange={(e) => handleScaleChange(scale.id, 'description', e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleDeleteScale(scale.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">CGPA Policies</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Pass Mark (%)</label>
                <input
                  type="number"
                  value={policy.minPassMark}
                  onChange={(e) => setPolicy({ ...policy, minPassMark: parseInt(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Probation Threshold (CGPA)</label>
                <input
                  type="number"
                  step="0.01"
                  value={policy.probationThreshold}
                  onChange={(e) => setPolicy({ ...policy, probationThreshold: parseFloat(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Graduation Threshold (CGPA)</label>
                <input
                  type="number"
                  step="0.01"
                  value={policy.graduationThreshold}
                  onChange={(e) => setPolicy({ ...policy, graduationThreshold: parseFloat(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Carry-Over Units</label>
                <input
                  type="number"
                  value={policy.maxCarryOverUnits}
                  onChange={(e) => setPolicy({ ...policy, maxCarryOverUnits: parseInt(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
            <AlertCircle className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Changes to the grading scale will affect future result computations. Past records are immutable unless manually recalculated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingSystem;
