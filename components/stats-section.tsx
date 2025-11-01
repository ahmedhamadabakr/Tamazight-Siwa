"use client"
import { useEffect, useState } from "react"
import { Users, Star, MapPin, Calendar } from "lucide-react"

interface StatItem {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  color: string
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0])

  const stats: StatItem[] = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 1250,
      label: "Happy Visitors",
      suffix: "+",
      color: "text-primary"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.9,
      label: "Excellent Rating",
      color: "text-yellow-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: 25,
      label: "Amazing Locations",
      suffix: "+",
      color: "text-secondary"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: 5,
      label: "Years Experience",
      suffix: "+",
      color: "text-accent"
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (typeof document !== 'undefined') {
      const element = document.getElementById('stats-section')
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        let start = 0
        const end = stat.value
        const duration = 2000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            start = end
            clearInterval(timer)
          }
          
          setAnimatedValues(prev => {
            const newValues = [...prev]
            newValues[index] = Math.floor(start * 10) / 10
            return newValues
          })
        }, 16)
      })
    }
  }, [isVisible])

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-4">
            <span className="text-primary font-medium">📊 Our Statistics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Numbers That Speak for Themselves
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            We take pride in our customers' trust and excellent reviews that reflect the quality of our services and unique experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm mb-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>

              {/* Value */}
              <div className="mb-2">
                <span className="text-4xl md:text-5xl font-bold text-foreground">
                  {animatedValues[index] || 0}
                </span>
                {stat.suffix && (
                  <span className="text-2xl font-bold text-primary">{stat.suffix}</span>
                )}
              </div>

              {/* Label */}
              <p className="text-muted-foreground font-medium text-lg">{stat.label}</p>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full group-hover:w-3/4 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}