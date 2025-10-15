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
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">إجمالي المستخدمين</h2>
        <p className="text-3xl text-blue-600">{total}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">المستخدمين النشطين</h2>
        <p className="text-3xl text-green-600">{active}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">المستخدمين غير النشطين</h2>
        <p className="text-3xl text-red-600">{inactive}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">المستخدمين قيد الانتظار</h2>
        <p className="text-3xl text-yellow-600">{pending}</p>
      </div>
    </div>
  );
}

