import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/dashboard/sidebar"

export function UsersLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
        </div>

        {/* Filters */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-full sm:w-32 h-10" />
          <Skeleton className="w-full sm:w-20 h-10" />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-12 lg:w-16" />
                </th>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-12 lg:w-16" />
                </th>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-12 lg:w-16" />
                </th>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-8 lg:w-12" />
                </th>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-12 lg:w-16" />
                </th>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-8 lg:w-12" />
                </th>
                <th className="px-4 lg:px-6 py-3">
                  <Skeleton className="h-4 w-12 lg:w-16" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 lg:px-6 py-4">
                    <Skeleton className="h-4 w-24 lg:w-32" />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <Skeleton className="h-4 w-32 lg:w-48" />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <Skeleton className="h-4 w-20 lg:w-28" />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <Skeleton className="h-8 w-16 lg:w-20 rounded" />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <Skeleton className="h-6 w-12 lg:w-16 rounded-full" />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <Skeleton className="h-4 w-16 lg:w-20" />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-12 lg:w-16 rounded" />
                      <Skeleton className="h-8 w-12 lg:w-16 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
