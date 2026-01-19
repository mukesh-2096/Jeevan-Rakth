"use client";
import { useState, useEffect } from "react";

interface BloodInventoryProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  refreshTrigger?: number;
}

type BloodInventoryItem = {
  bloodType: string;
  units: number;
  status: string;
  trend: string;
  lastDonation: string;
  expiring: string;
  trendUp: boolean;
};

type SortField = 'bloodType' | 'units' | 'status' | 'lastDonation';
type SortOrder = 'asc' | 'desc';

export default function BloodInventory({ user, refreshTrigger = 0 }: BloodInventoryProps) {
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('bloodType');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newStockUnits, setNewStockUnits] = useState('');
  const [inventoryData, setInventoryData] = useState<BloodInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAvailableDonors: 0,
    criticalStock: 0,
  });

  // Fetch blood inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hospital/blood-inventory', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setInventoryData(data.inventory || []);
        setStats({
          totalUnits: data.totalUnits || 0,
          totalAvailableDonors: data.totalAvailableDonors || 0,
          criticalStock: data.criticalStock || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user, refreshTrigger]);

  const totalUnits = inventoryData.reduce((sum, item) => sum + item.units, 0);
  const criticalStock = inventoryData.filter(item => item.status === 'Critical').length;
  const expiringUnits = inventoryData.reduce((sum, item) => sum + parseInt(item.expiring), 0);

  // Filtering
  const filteredData = filterStatus === 'all' 
    ? inventoryData 
    : inventoryData.filter(item => item.status === filterStatus);

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'bloodType') {
      comparison = a.bloodType.localeCompare(b.bloodType);
    } else if (sortField === 'units') {
      comparison = a.units - b.units;
    } else if (sortField === 'status') {
      const statusOrder = { 'Critical': 1, 'Low': 2, 'Good': 3 };
      comparison = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddStock = () => {
    if (selectedBloodType && newStockUnits) {
      // In a real app, this would make an API call
      console.log(`Adding ${newStockUnits} units of ${selectedBloodType}`);
      setShowAddStockModal(false);
      setSelectedBloodType(null);
      setNewStockUnits('');
    }
  };

  const handleExport = () => {
    // Convert data to CSV
    const headers = ['Blood Type', 'Units', 'Status', 'Trend', 'Last Donation', 'Expiring Soon'];
    const csvData = sortedData.map(item => [
      item.bloodType,
      item.units,
      item.status,
      item.trend,
      item.lastDonation,
      item.expiring
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blood-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Inventory</h1>
          <p className="text-gray-600">Real-time tracking of blood units across all blood groups</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button 
            onClick={() => setShowAddStockModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
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
          <p className="text-sm text-gray-600 mb-1">Total Donated Units</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : stats.totalUnits.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span>Completed donations</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Critical Stock</p>
          <p className="text-3xl font-bold text-red-600 mb-2">{loading ? '...' : stats.criticalStock}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{stats.criticalStock > 0 ? 'Requires immediate action' : 'All stocks normal'}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Available Donors</p>
          <p className="text-3xl font-bold text-green-600 mb-2">{loading ? '...' : stats.totalAvailableDonors}</p>
          <p className="text-sm text-gray-600">Ready to donate</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Last Updated</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">Now</p>
          <p className="text-sm text-green-600">Live tracking active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('Critical')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'Critical' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilterStatus('Low')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'Low' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Low
              </button>
              <button
                onClick={() => setFilterStatus('Good')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'Good' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Good
              </button>
            </div>
          </div>
          <div className="sm:ml-auto text-sm text-gray-600">
            Showing {sortedData.length} of {inventoryData.length} blood types
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  onClick={() => handleSort('bloodType')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Blood Type
                    {sortField === 'bloodType' && (
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('units')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Available Units
                    {sortField === 'units' && (
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' && (
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Donation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiring Soon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                      <p className="text-gray-600">Loading inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-600">No inventory data available</p>
                    </div>
                  </td>
                </tr>
              ) : (
              sortedData.map((item) => (
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
                    <button 
                      onClick={() => {
                        setSelectedBloodType(item.bloodType);
                        setShowAddStockModal(true);
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Request More
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Blood Stock</h2>
              <button 
                onClick={() => {
                  setShowAddStockModal(false);
                  setSelectedBloodType(null);
                  setNewStockUnits('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type
                </label>
                <select
                  value={selectedBloodType || ''}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select blood type</option>
                  {inventoryData.map((item) => (
                    <option key={item.bloodType} value={item.bloodType}>
                      {item.bloodType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Units
                </label>
                <input
                  type="number"
                  min="1"
                  value={newStockUnits}
                  onChange={(e) => setNewStockUnits(e.target.value)}
                  placeholder="Enter number of units"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {selectedBloodType && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inventoryData.find(i => i.bloodType === selectedBloodType)?.units || 0} units
                  </p>
                  {newStockUnits && (
                    <p className="text-sm text-green-600 mt-2">
                      New total: {(inventoryData.find(i => i.bloodType === selectedBloodType)?.units || 0) + parseInt(newStockUnits)} units
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddStockModal(false);
                  setSelectedBloodType(null);
                  setNewStockUnits('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStock}
                disabled={!selectedBloodType || !newStockUnits}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
