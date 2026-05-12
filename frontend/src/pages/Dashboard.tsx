import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3 text-blue-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Credits</dt>
                  <dd className="text-xl font-bold text-gray-900">50,000</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Delivered</dt>
                  <dd className="text-xl font-bold text-gray-900">12,450</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Pending</dt>
                  <dd className="text-xl font-bold text-gray-900">120</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Failed</dt>
                  <dd className="text-xl font-bold text-gray-900">45</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Summer Sale Promo</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 12, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5,000</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Weekly Newsletter</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 10, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,200</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">View all campaigns &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
