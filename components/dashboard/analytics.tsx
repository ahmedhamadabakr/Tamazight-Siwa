'use client';

interface AnalyticsProps {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export default function Analytics({
  total,
  active,
  inactive,
  pending,
}: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white shadow-sm border rounded-lg p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Total Users</h2>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{total}</p>
      </div>
      <div className="bg-white shadow-sm border rounded-lg p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Active Users</h2>
        <p className="text-2xl sm:text-3xl font-bold text-green-600">{active}</p>
      </div>
      <div className="bg-white shadow-sm border rounded-lg p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Inactive Users</h2>
        <p className="text-2xl sm:text-3xl font-bold text-red-600">{inactive}</p>
      </div>
      <div className="bg-white shadow-sm border rounded-lg p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Pending Users</h2>
        <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{pending}</p>
      </div>
    </div>
  );
}

