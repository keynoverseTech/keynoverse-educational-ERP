import React, { useMemo, useState } from 'react';
import { Plus, Edit3, CheckCircle2 } from 'lucide-react';
import { useHostel, type AllocationRuleType, type ReallocationPolicy } from '../../../../state/hostelContext';
import { HostelSubnav, Modal, SkeletonRow, StatusPill, ToastViewport } from './HostelShared';

const ALL_LEVELS = ['100', '200', '300', '400', '500'] as const;

const HostelConfig: React.FC = () => {
  const { ready, rules, createRule, updateRule, activateRule, toasts, dismissToast } = useHostel();

  const activeRule = useMemo(() => rules.find(r => r.isActive) ?? null, [rules]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [ruleType, setRuleType] = useState<AllocationRuleType>('Eligible Levels = 100–300');
  const [eligibleLevels, setEligibleLevels] = useState<string[]>(['100', '200', '300']);
  const [allocationDurationSemesters, setAllocationDurationSemesters] = useState(2);
  const [reallocationPolicy, setReallocationPolicy] = useState<ReallocationPolicy>('Change room every 2 semesters');
  const [makeActive, setMakeActive] = useState(true);

  const openCreate = () => {
    setEditingId(null);
    setRuleType('Eligible Levels = 100–300');
    setEligibleLevels(['100', '200', '300']);
    setAllocationDurationSemesters(2);
    setReallocationPolicy('Change room every 2 semesters');
    setMakeActive(true);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    const r = rules.find(x => x.id === id);
    if (!r) return;
    setEditingId(r.id);
    setRuleType(r.ruleType);
    setEligibleLevels(r.eligibleLevels);
    setAllocationDurationSemesters(r.allocationDurationSemesters);
    setReallocationPolicy(r.reallocationPolicy);
    setMakeActive(r.isActive);
    setFormOpen(true);
  };

  const submit = () => {
    if (eligibleLevels.length === 0) return;
    if (editingId) {
      updateRule(editingId, { ruleType, eligibleLevels, allocationDurationSemesters, reallocationPolicy, isActive: makeActive });
      if (makeActive) activateRule(editingId);
    } else {
      createRule({ ruleType, eligibleLevels, allocationDurationSemesters, reallocationPolicy, isActive: makeActive });
    }
    setFormOpen(false);
  };

  const applyRuleTemplate = (type: AllocationRuleType) => {
    setRuleType(type);
    setEligibleLevels(type === 'Eligible Levels = 100–300' ? ['100', '200', '300'] : ['100', '200', '300', '400', '500']);
  };

  const toggleLevel = (level: string) => {
    setEligibleLevels(prev => (prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level].sort()));
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Allocation Rules</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Configure eligibility levels, duration, and reallocation policy.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
          >
            <Plus size={18} />
            Create Rule
          </button>
        </div>

        <HostelSubnav
          items={[
            { label: 'Dashboard', to: '/school-admin/student-services/hostel' },
            { label: 'Hostels', to: '/school-admin/student-services/hostel/hostels' },
            { label: 'Rooms', to: '/school-admin/student-services/hostel/rooms' },
            { label: 'Allocation Rules', to: '/school-admin/student-services/hostel/rules' },
            { label: 'Booking Requests', to: '/school-admin/student-services/hostel/requests' },
            { label: 'Allocations', to: '/school-admin/student-services/hostel/allocations' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Active Rule</h3>
          <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
            {!ready ? (
              <div className="space-y-3">
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : activeRule ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <StatusPill label="ACTIVE" tone="green" />
                  <button
                    type="button"
                    onClick={() => openEdit(activeRule.id)}
                    className="px-3 py-1.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{activeRule.ruleType}</p>
                <div className="flex flex-wrap gap-2">
                  {activeRule.eligibleLevels.map(l => (
                    <StatusPill key={l} label={`Level ${l}`} tone="blue" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p>
                    Duration: <span className="font-bold">{activeRule.allocationDurationSemesters} semesters</span>
                  </p>
                  <p>
                    Policy: <span className="font-bold">{activeRule.reallocationPolicy}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-bold text-gray-900 dark:text-white">No active rule</p>
                <p className="mt-1">Create and activate a rule to define allocation policy.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">All Rules</h3>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{rules.length} total</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/30">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rule</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Eligible Levels</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Policy</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!ready ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <SkeletonRow key={i} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ) : (
                  rules.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {r.isActive ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-300" /> : null}
                          <p className="font-bold text-gray-900 dark:text-white">{r.ruleType}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {r.eligibleLevels.map(l => (
                            <StatusPill key={l} label={l} tone="blue" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{r.allocationDurationSemesters} semesters</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{r.reallocationPolicy}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(r.id)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => activateRule(r.id)}
                            className={`px-3 py-2 rounded-xl text-sm font-bold ${
                              r.isActive ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200' : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {r.isActive ? 'Active' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        title={editingId ? 'Edit Rule' : 'Create Rule'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        widthClassName="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button type="button" onClick={submit} className="px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700">
              Save
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Rule Type</label>
              <select
                value={ruleType}
                onChange={e => applyRuleTemplate(e.target.value as AllocationRuleType)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Eligible Levels = 100–300">Eligible Levels = 100–300</option>
                <option value="Eligible Levels = 100–500">Eligible Levels = 100–500</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Allocation Duration</label>
              <input
                type="number"
                min={1}
                value={allocationDurationSemesters}
                onChange={e => setAllocationDurationSemesters(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Default: 2 semesters</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Eligible Levels</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
              {ALL_LEVELS.map(level => {
                const active = eligibleLevels.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleLevel(level)}
                    className={`px-3 py-2 rounded-xl border text-sm font-bold transition-colors ${
                      active
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Reallocation Policy</label>
            <select
              value={reallocationPolicy}
              onChange={e => setReallocationPolicy(e.target.value as ReallocationPolicy)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Change room every 2 semesters">Change room every 2 semesters</option>
              <option value="Keep same room until graduation">Keep same room until graduation</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Activate rule</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Only one rule can be active at a time.</p>
            </div>
            <button
              type="button"
              onClick={() => setMakeActive(v => !v)}
              className={`px-3 py-2 rounded-xl text-sm font-bold ${makeActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            >
              {makeActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HostelConfig;
