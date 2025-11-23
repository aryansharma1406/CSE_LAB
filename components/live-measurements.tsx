"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LiveMeasurementsProps {
  experimentId?: string
}

export function LiveMeasurements({ experimentId }: LiveMeasurementsProps) {
  const [measurements, setMeasurements] = useState({
    voltage: 0,
    current: 0,
    power: 0,
  })

  useEffect(() => {
    // Listen for measurement updates from the simulator via postMessage
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from our own origin
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data && event.data.type === "circuitjs-measurements") {
        setMeasurements({
          voltage: event.data.voltage || 0,
          current: event.data.current || 0,
          power: event.data.power || 0,
        })
      }
    }

    // Also listen for custom events
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.type === "circuitjs-measurements") {
        setMeasurements({
          voltage: event.detail.voltage || 0,
          current: event.detail.current || 0,
          power: event.detail.power || 0,
        })
      }
    }

    window.addEventListener("message", handleMessage)
    window.addEventListener("circuitjs-measurements", handleCustomEvent as EventListener)

    return () => {
      window.removeEventListener("message", handleMessage)
      window.removeEventListener("circuitjs-measurements", handleCustomEvent as EventListener)
    }
  }, [])

  // Format measurements for display
  const formatVoltage = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(2)} kV`
    return `${v.toFixed(2)} V`
  }

  const formatCurrent = (i: number) => {
    if (i >= 1000) return `${(i / 1000).toFixed(2)} A`
    if (i >= 1) return `${i.toFixed(2)} A`
    return `${(i * 1000).toFixed(2)} mA`
  }

  const formatPower = (p: number) => {
    if (p >= 1000) return `${(p / 1000).toFixed(2)} W`
    return `${p.toFixed(2)} mW`
  }

  const measurementStats = [
    { label: "VOLTAGE", value: formatVoltage(measurements.voltage) },
    { label: "CURRENT", value: formatCurrent(measurements.current) },
    { label: "POWER", value: formatPower(measurements.power) },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg flex items-center gap-2">Live Measurements</CardTitle>
        <CardDescription>Track simulated values as you adjust the circuit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4">
          {measurementStats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl border border-primary/10 bg-primary/5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
        {measurements.voltage === 0 && measurements.current === 0 && measurements.power === 0 && (
          <div className="text-xs text-muted-foreground mt-4 text-center space-y-1">
            <p>Build a circuit in the CircuitJS1 simulator above to see live measurements</p>
            <p className="text-[10px]">Measurements are displayed directly in the CircuitJS1 interface</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

