"use client"

import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const systemStatus = [
  {
    name: 'Website',
    status: 'operational',
    uptime: '99.9%',
    lastCheck: '2 min ago',
  },
  {
    name: 'Payment System',
    status: 'operational',
    uptime: '99.8%',
    lastCheck: '1 min ago',
  },
  {
    name: 'Email Service',
    status: 'warning',
    uptime: '98.5%',
    lastCheck: '5 min ago',
  },
  {
    name: 'Database',
    status: 'operational',
    uptime: '99.9%',
    lastCheck: '1 min ago',
  },
  {
    name: 'File Storage',
    status: 'operational',
    uptime: '99.7%',
    lastCheck: '3 min ago',
  },
]

const statusConfig = {
  operational: {
    icon: CheckCircle,
    color: 'text-green-500',
    badge: 'bg-green-100 text-green-800',
    label: 'Operational',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-800',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    color: 'text-red-500',
    badge: 'bg-red-100 text-red-800',
    label: 'Error',
  },
}

export function SystemHealth() {
  const overallStatus = systemStatus.some(s => s.status === 'error') 
    ? 'error' 
    : systemStatus.some(s => s.status === 'warning') 
    ? 'warning' 
    : 'operational'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          <div className="flex items-center space-x-2">
            <Activity className={`h-4 w-4 ${statusConfig[overallStatus].color}`} />
            <Badge className={statusConfig[overallStatus].badge} variant="secondary">
              {statusConfig[overallStatus].label}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {systemStatus.map((service) => {
            const config = statusConfig[service.status as keyof typeof statusConfig]
            const StatusIcon = config.icon
            
            return (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last check: {service.lastCheck}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {service.uptime}
                  </div>
                  <div className="text-xs text-gray-500">uptime</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall System Health</span>
            <span className={`font-medium ${statusConfig[overallStatus].color}`}>
              {statusConfig[overallStatus].label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}