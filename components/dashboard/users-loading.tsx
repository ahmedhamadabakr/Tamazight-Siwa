import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/dashboard/sidebar"

export function UsersLoading() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-4">
          <div className="flex gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-32 h-10" />
            <Skeleton className="w-20 h-10" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-6 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-8 w-20 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
