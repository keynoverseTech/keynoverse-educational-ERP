import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import superAdminService from '../../../services/superAdminApi';

interface SubscriptionPlan {
  id: string;
  name: string;
  minStudents: number;
  maxStudents: number | null; // null means "and above"
  amount: number;
  features: string[];
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await superAdminService.getSubscriptionPlans();
        const data = Array.isArray(response) ? response : (response as any)?.data || [];

        const mapped: SubscriptionPlan[] = data.map((p: any) => {
          const featuresRaw = p.features ?? p.benefits ?? p.modules ?? [];
          const features =
            Array.isArray(featuresRaw)
              ? featuresRaw.map((f: any) => String(f))
              : typeof featuresRaw === 'string'
                ? featuresRaw
                    .split(/\r?\n|,/g)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : [];

          const minStudents =
            p.minStudents ??
            p.min_students ??
            p.min_student_population ??
            p.min_students_population ??
            0;

          const maxStudents =
            p.maxStudents ??
            p.max_students ??
            p.max_student_population ??
            p.max_students_population ??
            null;

          const amount = p.amount ?? p.price ?? p.cost ?? 0;

          return {
            id: String(p.id ?? p.plan_id ?? p.code ?? ''),
            name: String(p.name ?? p.title ?? 'Subscription Plan'),
            minStudents: Number(minStudents) || 0,
            maxStudents: maxStudents === null || maxStudents === undefined ? null : Number(maxStudents),
            amount: Number(amount) || 0,
            features,
          };
        }).filter((p: SubscriptionPlan) => p.id);

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

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button 
          onClick={() => { setEditingPlan(plan); setIsModalOpen(true); }}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => handleDelete(plan.id)}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-8">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
          <CreditCard size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Users size={16} />
          <span>
            {plan.minStudents.toLocaleString()} - {plan.maxStudents ? plan.maxStudents.toLocaleString() : 'Unlimited'} Students
          </span>
        </div>

        <div className="mb-6">
          <span className="text-3xl font-black text-gray-900 dark:text-white">₦{(plan.amount / 1000000).toFixed(1)}M</span>
          <span className="text-gray-500 text-sm font-medium"> / year</span>
        </div>

        <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-6">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
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
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
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
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          className="group border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[400px]"
        >
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-white flex items-center justify-center mb-4 transition-colors shadow-sm">
            <Plus size={32} />
          </div>
          <span className="font-bold text-lg">Add New Plan</span>
        </button>
      </div>

      {/* Modal Placeholder - Logic to be implemented fully if needed */}
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
            <div className="p-8 text-center text-gray-500">
              <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
              <p>Form implementation pending for: {editingPlan?.name || 'New Plan'}</p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
