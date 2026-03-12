import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Paperclip, Send, Ticket, XCircle, FileText } from 'lucide-react';

type TicketPriority = 'Low' | 'Medium' | 'High';
type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
type TicketCategory = 'Registration' | 'Documents' | 'Payments' | 'Technical' | 'Other';

type PortalTicket = {
  id: string;
  ticketNumber: string;
  instituteName: string;
  email: string;
  phone: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  attachments: { name: string; size: number; type: string }[];
  status: TicketStatus;
  createdAt: string;
};

const STORAGE_KEY = 'portal_support_tickets';
const LEGACY_STORAGE_KEY = 'registration_portal_tickets';

const loadTickets = (): PortalTicket[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as PortalTicket[];
    } catch {
      return [];
    }
  }
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacy) return [];
  try {
    return JSON.parse(legacy) as PortalTicket[];
  } catch {
    return [];
  }
};

const saveTickets = (tickets: PortalTicket[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    return;
  }
};

const formatBytes = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
};

const makeTicketNumber = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${y}${m}${day}-${rand}`;
};

const PortalTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<PortalTicket[]>(() => loadTickets());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    instituteName: '',
    email: '',
    phone: '',
    category: 'Registration' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    subject: '',
    description: '',
    attachments: null as FileList | null
  });

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  }, [tickets]);

  const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!form.instituteName.trim() || !form.email.trim() || !form.subject.trim() || !form.description.trim()) {
      setStatusMessage({ type: 'error', text: 'Please complete institute name, email, subject, and description.' });
      return;
    }

    const attachments = form.attachments
      ? Array.from(form.attachments).map((f) => ({ name: f.name, size: f.size, type: f.type }))
      : [];

    const ticket: PortalTicket = {
      id: `ptk_${Date.now()}`,
      ticketNumber: makeTicketNumber(),
      instituteName: form.instituteName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      category: form.category,
      priority: form.priority,
      subject: form.subject.trim(),
      description: form.description.trim(),
      attachments,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    setTickets((prev) => [ticket, ...prev]);
    setForm({
      instituteName: form.instituteName,
      email: form.email,
      phone: form.phone,
      category: form.category,
      priority: form.priority,
      subject: '',
      description: '',
      attachments: null
    });
    setStatusMessage({ type: 'success', text: `Ticket submitted successfully (${ticket.ticketNumber}).` });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Submit issues encountered during onboarding and track your recent tickets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/portal/manual')}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-black text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <FileText size={18} />
            Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-blue-600 dark:text-blue-400" />
              <div className="text-sm font-black text-gray-900 dark:text-white">Submit a Ticket</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">We respond as soon as possible</div>
          </div>

          <form onSubmit={submitTicket} className="p-6 space-y-5">
            {statusMessage && (
              <div
                className={`rounded-2xl p-4 border text-sm font-bold flex items-start gap-3 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-300'
                    : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-900/40 dark:text-rose-300'
                }`}
              >
                {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <div className="leading-relaxed">{statusMessage.text}</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Institute Name</label>
                <input
                  value={form.instituteName}
                  onChange={(e) => setForm((p) => ({ ...p, instituteName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. ABC Polytechnic"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="support@yourinstitute.edu"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Phone (optional)</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+234..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as TicketCategory }))}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Registration">Registration</option>
                    <option value="Documents">Documents</option>
                    <option value="Payments">Payments</option>
                    <option value="Technical">Technical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as TicketPriority }))}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short summary of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe the problem and the step where you got stuck..."
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Attachments (optional)</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                  <Paperclip size={16} />
                  Attach files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => setForm((p) => ({ ...p, attachments: e.target.files }))}
                  />
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                  {form.attachments && form.attachments.length > 0 ? `${form.attachments.length} file(s) selected` : 'PDF/JPG/PNG supported'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    instituteName: '',
                    email: '',
                    phone: '',
                    category: 'Registration',
                    priority: 'Medium',
                    subject: '',
                    description: '',
                    attachments: null
                  });
                  setStatusMessage(null);
                }}
                className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-colors shadow-lg shadow-blue-600/20 inline-flex items-center gap-2"
              >
                Submit Ticket <Send size={16} />
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="text-sm font-black text-gray-900 dark:text-white">Your Recent Tickets</div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{tickets.length} total</div>
          </div>
          <div className="p-6 space-y-4">
            {recentTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-black text-gray-500 dark:text-gray-400">{t.ticketNumber}</div>
                    <div className="mt-1 text-sm font-black text-gray-900 dark:text-white truncate">{t.subject}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-bold">
                      {t.category} • {t.priority} • {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wide ${
                    t.status === 'Open'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      : t.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  }`}>
                    {t.status}
                  </span>
                </div>
                {t.attachments.length > 0 && (
                  <div className="mt-3 text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Paperclip size={14} />
                    {t.attachments.map((a) => `${a.name} (${formatBytes(a.size)})`).join(', ')}
                  </div>
                )}
              </div>
            ))}
            {recentTickets.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-500 dark:text-gray-400 font-bold">No tickets submitted yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalTickets;

