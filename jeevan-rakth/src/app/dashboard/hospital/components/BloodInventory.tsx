"use client";

interface BloodInventoryProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function BloodInventory({ user }: BloodInventoryProps) {
  const inventoryData = [
    { bloodType: 'A+', units: 487, status: 'Good', trend: '+12', lastDonation: '2 hours ago', expiring: '8 units', trendUp: true },
    { bloodType: 'A-', units: 142, status: 'Low', trend: '-5', lastDonation: '5 hours ago', expiring: '3 units', trendUp: false },
    { bloodType: 'B+', units: 523, status: 'Good', trend: '+18', lastDonation: '1 hour ago', expiring: '12 units', trendUp: true },
    { bloodType: 'B-', units: 98, status: 'Critical', trend: '-15', lastDonation: '8 hours ago', expiring: '2 units', trendUp: false },
    { bloodType: 'AB+', units: 276, status: 'Good', trend: '+8', lastDonation: '3 hours ago', expiring: '5 units', trendUp: true },
    { bloodType: 'AB-', units: 67, status: 'Low', trend: '-8', lastDonation: '6 hours ago', expiring: '1 units', trendUp: false },
    { bloodType: 'O+', units: 892, status: 'Good', trend: '+24', lastDonation: '30 mins ago', expiring: '18 units', trendUp: true },
    { bloodType: 'O-', units: 362, status: 'Good', trend: '+15', lastDonation: '1 hour ago', expiring: '7 units', trendUp: true },
  ];

  const totalUnits = inventoryData.reduce((sum, item) => sum + item.units, 0);
  const criticalStock = inventoryData.filter(item => item.status === 'Critical').length;
  const expiringUnits = inventoryData.reduce((sum, item) => sum + parseInt(item.expiring), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Inventory</h1>
          <p className="text-gray-600">Real-time tracking of blood units across all blood groups</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stock
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Units</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{totalUnits.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+12.5% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Critical Stock</p>
          <p className="text-3xl font-bold text-red-600 mb-2">{criticalStock}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Requires immediate action</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
          <p className="text-3xl font-bold text-yellow-600 mb-2">{expiringUnits}</p>
          <p className="text-sm text-gray-600">Within 7 days</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Last Updated</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">Now</p>
          <p className="text-sm text-green-600">Live tracking active</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Blood Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Available Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Donation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiring Soon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item) => (
                <tr key={item.bloodType} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </div>
                      <span className="text-base font-semibold text-gray-900">{item.bloodType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-base font-semibold text-gray-900">{item.units}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Good' ? 'bg-green-100 text-green-700' :
                      item.status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-sm font-medium ${item.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {item.trendUp ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      )}
                      <span>{item.trend}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.lastDonation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      parseInt(item.expiring) > 10 ? 'text-red-600' : 
                      parseInt(item.expiring) > 5 ? 'text-yellow-600' : 
                      'text-gray-600'
                    }`}>
                      {item.expiring}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer">
                      Request More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
