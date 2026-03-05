import { DollarSign, CreditCard, Calendar, Download } from 'lucide-react';
import { currentStaffId } from '../academics/assignedCourses';

const MySalary = () => {
  // Mock Salary Data based on staff ID
  const salaryData = {
    staffId: currentStaffId,
    basicSalary: 250000,
    allowances: [
      { name: 'Housing Allowance', amount: 50000 },
      { name: 'Transport Allowance', amount: 30000 },
      { name: 'Research Grant', amount: 20000 }
    ],
    deductions: [
      { name: 'Tax (PAYE)', amount: 25000 },
      { name: 'Pension', amount: 15000 },
      { name: 'Health Insurance', amount: 5000 }
    ],
    netSalary: 305000,
    bankDetails: {
      bankName: 'First Bank',
      accountNumber: '3045678901',
      accountName: 'Sarah Connor'
    }
  };

  const payslips = [
    { id: 1, month: 'October', year: 2025, amount: 305000, status: 'Paid' },
    { id: 2, month: 'September', year: 2025, amount: 305000, status: 'Paid' },
    { id: 3, month: 'August', year: 2025, amount: 305000, status: 'Paid' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          My Salary
        </h1>
        <p className="text-gray-500 dark:text-gray-400">View your salary structure and payslips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Salary Structure Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Salary Structure</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Basic Salary</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">₦{salaryData.basicSalary.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-green-600 mb-3 uppercase tracking-wider">Allowances</h3>
                  <div className="space-y-2">
                    {salaryData.allowances.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wider">Deductions</h3>
                  <div className="space-y-2">
                    {salaryData.deductions.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <span className="text-blue-800 dark:text-blue-300 font-bold">Net Monthly Salary</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₦{salaryData.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details & Payslips */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard size={16} /> Bank Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Name</span>
                <span className="font-medium dark:text-white">{salaryData.bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number</span>
                <span className="font-medium dark:text-white font-mono">{salaryData.bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name</span>
                <span className="font-medium dark:text-white">{salaryData.bankDetails.accountName}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={16} /> Recent Payslips
            </h3>
            <div className="space-y-3">
              {payslips.map(slip => (
                <div key={slip.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{slip.month} {slip.year}</p>
                    <p className="text-xs text-green-600 font-medium">{slip.status}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalary;
