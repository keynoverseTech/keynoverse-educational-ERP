import React, { useEffect, useMemo, useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  CheckCircle2,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import superAdminService from '../../../services/superAdminApi';

interface SubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  noOfDays: number;
  description: string;
  notes: string;
  isActive: boolean;
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    no_of_days: 30,
    amount: 0,
    description: '',
    notes: '',
    is_active: true,
  });

  const resetForm = () => {
    setForm({
      name: '',
      no_of_days: 30,
      amount: 0,
      description: '',
      notes: '',
      is_active: true,
    });
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await superAdminService.getSubscriptionPlans();
        const data = Array.isArray(response) ? response : (response as any)?.data || [];

        const mapped: SubscriptionPlan[] = data.map((p: any) => ({
          id: String(p.id ?? p.plan_id ?? ''),
          name: String(p.name ?? 'Subscription Plan'),
          noOfDays: Number(p.no_of_days ?? p.noOfDays ?? 0) || 0,
          amount: Number(p.amount ?? 0) || 0,
          description: String(p.description ?? ''),
          notes: String(p.notes ?? ''),
          isActive: Boolean(p.is_active ?? p.isActive ?? true),
        })).filter((p: SubscriptionPlan) => p.id);

        setPlans(mapped);
      } catch (err: any) {
        console.error('Failed to fetch subscription plans', err);
        setError('Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const openCreate = () => {
    setEditingPlan(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      no_of_days: plan.noOfDays,
      amount: plan.amount,
      description: plan.description,
      notes: plan.notes,
      is_active: plan.isActive,
    });
    setIsModalOpen(true);
  };

  const refreshPlans = async () => {
    const response = await superAdminService.getSubscriptionPlans();
    const data = Array.isArray(response) ? response : (response as any)?.data || [];
    const mapped: SubscriptionPlan[] = data.map((p: any) => ({
      id: String(p.id ?? p.plan_id ?? ''),
      name: String(p.name ?? 'Subscription Plan'),
      noOfDays: Number(p.no_of_days ?? p.noOfDays ?? 0) || 0,
      amount: Number(p.amount ?? 0) || 0,
      description: String(p.description ?? ''),
      notes: String(p.notes ?? ''),
      isActive: Boolean(p.is_active ?? p.isActive ?? true),
    })).filter((p: SubscriptionPlan) => p.id);
    setPlans(mapped);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        no_of_days: Number(form.no_of_days),
        amount: Number(form.amount),
        description: form.description.trim(),
        notes: form.notes.trim(),
        is_active: Boolean(form.is_active),
      };

      if (!payload.name) {
        setError('Name is required');
        setSaving(false);
        return;
      }

      if (editingPlan) {
        await superAdminService.updateSubscriptionPlan(editingPlan.id, payload);
      } else {
        await superAdminService.createSubscriptionPlan(payload);
      }

      setIsModalOpen(false);
      await refreshPlans();
    } catch (err: any) {
      console.error('Failed to save subscription plan', err);
      const message = err?.response?.data?.message || 'Failed to save subscription plan';
      setError(String(message));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (plan: SubscriptionPlan) => {
    try {
      const next = !plan.isActive;
      await superAdminService.updateSubscriptionPlan(plan.id, { is_active: next });
      setPlans(prev => prev.map(p => (p.id === plan.id ? { ...p, isActive: next } : p)));
    } catch (err) {
      console.error('Failed to update plan status', err);
      alert('Failed to update plan status');
    }
  };

  const formatNaira = useMemo(() => (amount: number) => `₦${Number(amount || 0).toLocaleString()}`, []);

  const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button 
          onClick={() => openEdit(plan)}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => toggleActive(plan)}
          className={`p-2 rounded-lg transition-colors ${
            plan.isActive
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {plan.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        </button>
      </div>

      <div className="p-8">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
          <CreditCard size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
            plan.isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700'
          }`}>
            {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
          <span className="text-xs font-medium text-gray-500">{plan.noOfDays} days</span>
        </div>

        <div className="mb-6">
          <span className="text-3xl font-black text-gray-900 dark:text-white">{formatNaira(plan.amount)}</span>
          <span className="text-gray-500 text-sm font-medium"> / {plan.noOfDays} days</span>
        </div>

        <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-6">
          {plan.description && (
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{plan.description}</span>
            </div>
          )}
          {plan.notes && (
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{plan.notes}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage institute pricing tiers based on student population.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} />
          Create New Plan
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6"></div>
              <div className="h-6 w-2/3 bg-gray-100 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-10 w-1/2 bg-gray-100 dark:bg-gray-700 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          plans.map(plan => <PlanCard key={plan.id} plan={plan} />)
        )}
        
        {/* Add Plan Card Placeholder */}
        <button 
          onClick={openCreate}
          className="group border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[400px]"
        >
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-white flex items-center justify-center mb-4 transition-colors shadow-sm">
            <Plus size={32} />
          </div>
          <span className="font-bold text-lg">Add New Plan</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl p-3 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. of Days</label>
                  <input
                    type="number"
                    value={form.no_of_days}
                    onChange={(e) => setForm(prev => ({ ...prev, no_of_days: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[90px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full min-h-[90px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4"
                />
                Active
              </label>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
