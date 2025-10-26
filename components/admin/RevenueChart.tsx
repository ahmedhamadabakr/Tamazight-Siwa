"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Mock data for the chart
const revenueData = {
  '7d': [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1800 },
    { day: 'Wed', revenue: 1600 },
    { day: 'Thu', revenue: 2200 },
    { day: 'Fri', revenue: 2800 },
    { day: 'Sat', revenue: 3200 },
    { day: 'Sun', revenue: 2400 },
  ],
  '30d': [
    { day: 'Week 1', revenue: 12000 },
    { day: 'Week 2', revenue: 18000 },
    { day: 'Week 3', revenue: 16000 },
    { day: 'Week 4', revenue: 22000 },
  ],
  '90d': [
    { day: 'Month 1', revenue: 45000 },
    { day: 'Month 2', revenue: 52000 },
    { day: 'Month 3', revenue: 48000 },
  ],
}

export function RevenueChart() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const data = revenueData[period]
  const maxRevenue = Math.max(...data.map(d => d.revenue))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-64 flex items-end space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary rounded-t-md transition-all duration-300 hover:bg-primary/80 cursor-pointer"
                style={{
                  height: `${(item.revenue / maxRevenue) * 200}px`,
                  minHeight: '20px',
                }}
                title={`${item.day}: $${item.revenue.toLocaleString()}`}
              />
              <div className="mt-2 text-xs text-gray-600 text-center">
                {item.day}
              </div>
              <div className="text-xs font-medium text-gray-900">
                ${item.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +12.5%
            </div>
            <div className="text-sm text-gray-600">Growth</div>
          </div>
        </div>
      </div>
    </div>
  )
}