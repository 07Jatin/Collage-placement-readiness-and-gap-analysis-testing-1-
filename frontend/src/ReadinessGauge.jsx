import React from 'react'
import { RadialBarChart, RadialBar, Legend } from 'recharts'

export default function ReadinessGauge({ value }) {
  const data = [
    { name: 'readiness', value: Math.max(0, Math.min(100, value)), fill: '#4ade80' },
  ]

  return (
    <div style={{ width: 200, height: 160 }}>
      <RadialBarChart
        cx={100}
        cy={80}
        innerRadius={20}
        outerRadius={80}
        barSize={20}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise
          dataKey="value"
        />
      </RadialBarChart>
      <div style={{ textAlign: 'center', marginTop: -20 }}>
        <strong>{Math.round(value)}%</strong>
      </div>
    </div>
  )
}
