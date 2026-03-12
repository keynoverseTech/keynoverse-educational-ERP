import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, FileText, HelpCircle, Ticket } from 'lucide-react';

type ManualSection = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
};

const PortalManual = () => {
  const navigate = useNavigate();

  const sections = useMemo<ManualSection[]>(() => [
    {
      id: 'start',
      title: '1) Start Registration',
      summary: 'Begin your onboarding and create your institute registration request.',
      bullets: [
        'Go to the Registration Portal and click Start Registration.',
        'Use a valid institute email and phone number.',
        'Choose the correct institute type and basic details.',
        'Save frequently while completing the form.'
      ]
    },
    {
      id: 'details',
      title: '2) Fill Institute Details',
      summary: 'Provide accurate information to avoid delays during review.',
      bullets: [
        'Enter official institute name, address, and contact channels.',
        'Provide accreditation/regulatory information where applicable.',
        'Double-check spelling and document numbers before submission.',
        'Use consistent data across all uploaded documents.'
      ]
    },
    {
      id: 'documents',
      title: '3) Upload Required Documents',
      summary: 'Upload readable documents to support verification.',
      bullets: [
        'Upload clear scans (PDF preferred) and ensure text is readable.',
        'Name files clearly (e.g., Accreditation.pdf, CAC.pdf).',
        'Avoid password-protected files unless requested.',
        'If a document is missing, explain it in a Support Ticket.'
      ]
    },
    {
      id: 'review',
      title: '4) Review & Submit',
      summary: 'Confirm all entries and submit your application for processing.',
      bullets: [
        'Review all sections and confirm there are no empty required fields.',
        'Submit only after documents and details are complete.',
        'Keep your ticket or reference number for follow-up.'
      ]
    },
    {
      id: 'approval',
      title: '5) Approval Workflow',
      summary: 'Your submission is reviewed for compliance and completeness.',
      bullets: [
        'Our team verifies institute details and uploaded documents.',
        'You may be asked to provide additional information.',
        'If changes are required, submit a ticket with the requested corrections.'
      ]
    },
    {
      id: 'access',
      title: '6) Portal Access & Next Steps',
      summary: 'After approval, log in and begin setup inside the ERP.',
      bullets: [
        'Use the Portal to manage documents and payments during onboarding.',
        'Track progress from your dashboard.',
        'Submit a ticket for any issues encountered in the workflow.'
      ]
    }
  ], []);

  const faqs = useMemo(() => [
    {
      q: 'I can’t submit the form. What should I do?',
      a: 'Check that all required fields are completed and all documents are uploaded. If it still fails, submit a ticket with a screenshot and the step you were on.'
    },
    {
      q: 'Which email should I use for registration?',
      a: 'Use an official institute email that can receive verification messages and support replies.'
    },
    {
      q: 'A document is not available yet. Can I still proceed?',
      a: 'Yes. Submit a ticket explaining what is missing and when it will be available. Provide alternative evidence if possible.'
    },
    {
      q: 'How long does approval take?',
      a: 'Timing depends on completeness of your submission. Submissions with clear details and readable documents are processed faster.'
    }
  ], []);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => ({ start: true }));
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Registration Manual</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Step-by-step guide on how to complete onboarding and avoid delays.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/portal/tickets')}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-black text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <Ticket size={18} />
            Tickets
          </button>
          <button
            onClick={() => navigate('/register/new')}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-colors shadow-lg shadow-blue-600/20 inline-flex items-center gap-2"
          >
            Start Registration <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {sections.map((s) => {
            const isOpen = Boolean(openSections[s.id]);
            return (
              <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden">
                <button
                  onClick={() => setOpenSections((prev) => ({ ...prev, [s.id]: !isOpen }))}
                  className="w-full p-6 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-black text-gray-900 dark:text-white">{s.title}</div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{s.summary}</div>
                  </div>
                  <div className="shrink-0 text-gray-500 dark:text-gray-400">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <ul className="space-y-3">
                      {s.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">{b}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-blue-600 dark:text-blue-400" />
              <div className="text-sm font-black text-gray-900 dark:text-white">Quick Tips</div>
            </div>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5" />
                Use clear PDF scans for faster verification.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5" />
                Ensure institute name matches official documents.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5" />
                If you get stuck, submit a ticket with screenshots.
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle size={18} className="text-purple-600 dark:text-purple-400" />
              <div className="text-sm font-black text-gray-900 dark:text-white">FAQs</div>
            </div>
            <div className="space-y-3">
              {faqs.map((f, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-4 py-3 flex items-start justify-between gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                    >
                      <div className="text-sm font-black text-gray-900 dark:text-white">{f.q}</div>
                      <div className="shrink-0 text-gray-500 dark:text-gray-400">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">{f.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-600/20">
            <div className="text-xs font-bold opacity-90">Need help right now?</div>
            <div className="mt-1 text-lg font-black">Submit a Support Ticket</div>
            <div className="mt-2 text-sm text-white/90">Include the step you are on and screenshots of any error messages.</div>
            <button
              onClick={() => navigate('/portal/tickets')}
              className="mt-5 w-full px-6 py-3 rounded-2xl bg-white text-emerald-700 font-black hover:bg-emerald-50 transition-colors"
            >
              Open Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalManual;

