import React, { useEffect, useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ArrowUpRight,
  Eye,
  FileText
} from 'lucide-react';
import superAdminService from '../../../services/superAdminApi';

type Row = {
  id: string;
  institute: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Unknown';
  method?: string;
};

const Revenue: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState<Row[]>([]);

  const formatNaira = (amount: number) => `₦${Number(amount || 0).toLocaleString()}`;

  const statusFromSubscription = (raw: any): Row['status'] => {
    const s = (raw || '').toString().toLowerCase();
    if (s.includes('active')) return 'Paid';
    if (s.includes('pending')) return 'Pending';
    if (s.includes('expired') || s.includes('expire')) return 'Overdue';
    return 'Unknown';
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await superAdminService.getSubscriptions();
        const data = Array.isArray(res) ? res : (res as any)?.data || [];
        const mapped: Row[] = data.map((it: any) => ({
          id: String(it.invoice_id ?? it.invoiceId ?? it.reference ?? it.id ?? it.subscription_id ?? ''),
          institute: String(it.institution?.name ?? it.institution_name ?? it.name ?? 'Institution'),
          amount: Number(it.amount ?? it.price ?? it.fee ?? 0),
          date: String(it.paid_at ?? it.payment_date ?? it.updated_at ?? it.created_at ?? it.start_date ?? ''),
          status: statusFromSubscription(it.status),
          method: it.method ?? it.payment_method ?? it.channel ?? '',
        })).filter((r: Row) => r.id);
        setRows(mapped);
      } catch (err: any) {
        console.error('Failed to load revenue', err);
        setError('Failed to load revenue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const statusOk = (tx: Row) => statusFilter === 'All' || tx.status === statusFilter;
    const searchOk = (tx: Row) =>
      !q || tx.institute.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q);
    return rows.filter(tx => statusOk(tx) && searchOk(tx));
  }, [rows, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Details</h1>
          <p className="text-gray-500 dark:text-gray-400">Detailed breakdown of subscription payments and invoices.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            <ArrowUpRight size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by institute or invoice ID..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
            <Filter size={16} className="text-gray-500" />
            <select 
              className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
            <Calendar size={16} className="text-gray-500" />
            <select 
              className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Institute</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading revenue...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-rose-600 dark:text-rose-400">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && filteredTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">{tx.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{tx.institute}</span>
                      <span className="text-xs text-gray-500">{tx.method || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 dark:text-white">{formatNaira(tx.amount)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tx.date || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Download Invoice">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!loading && !error && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter size={24} className="text-gray-300" />
                      <p>No transactions found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900 dark:text-white">1-6</span> of <span className="font-bold text-gray-900 dark:text-white">42</span> transactions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
