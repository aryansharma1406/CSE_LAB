"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RotateCcw, Zap, Battery, Lightbulb, Minus } from "lucide-react"

interface ExperimentSimulatorProps {
  experimentId: string
}

export function ExperimentSimulator({ experimentId }: ExperimentSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [measurements, setMeasurements] = useState({
    voltage: 0,
    current: 0,
    resistance: 0,
    power: 0,
  })

  const simulateExperiment = () => {
    setIsRunning(!isRunning)

    if (!isRunning) {
      // Simulate measurements based on experiment type
      if (experimentId === "ohms-law") {
        setMeasurements({
          voltage: 9.0,
          current: 9.0, // 9V / 1000Ω = 9mA
          resistance: 1000,
          power: 81, // 9V * 9mA = 81mW
        })
      } else if (experimentId === "series-parallel") {
        setMeasurements({
          voltage: 9.0,
          current: 3.0, // Series: 9V / 3000Ω = 3mA
          resistance: 3000,
          power: 27,
        })
      }
    } else {
      setMeasurements({
        voltage: 0,
        current: 0,
        resistance: 0,
        power: 0,
      })
    }
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setMeasurements({
      voltage: 0,
      current: 0,
      resistance: 0,
      power: 0,
    })
  }

  return (
    <div className="space-y-4">
      {/* Circuit Workspace */}
      <div className="h-96 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Pre-built Circuit for Experiment */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {experimentId === "ohms-law" && (
              <div className="flex items-center gap-8">
                {/* Battery */}
                <div
                  className={`w-16 h-16 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary shadow-lg" : "border-border"}`}
                >
                  <Battery className="h-6 w-6 text-primary" />
                  <div className="absolute -bottom-6 text-xs font-medium">9V</div>
                </div>

                {/* Wire */}
                <div className="w-12 h-0.5 bg-foreground"></div>

                {/* Resistor */}
                <div
                  className={`w-16 h-16 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary shadow-lg" : "border-border"}`}
                >
                  <Minus className="h-6 w-6 text-primary" />
                  <div className="absolute -bottom-6 text-xs font-medium">1kΩ</div>
                </div>

                {/* Wire */}
                <div className="w-12 h-0.5 bg-foreground"></div>

                {/* LED (if running) */}
                <div
                  className={`w-16 h-16 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary shadow-lg bg-yellow-200" : "border-border"}`}
                >
                  <Lightbulb className={`h-6 w-6 ${isRunning ? "text-yellow-600" : "text-muted-foreground"}`} />
                  <div className="absolute -bottom-6 text-xs font-medium">LED</div>
                </div>
              </div>
            )}

            {experimentId === "series-parallel" && (
              <div className="space-y-8">
                {/* Series Circuit */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary" : "border-border"}`}
                  >
                    <Battery className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-8 h-0.5 bg-foreground"></div>
                  <div
                    className={`w-12 h-12 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary" : "border-border"}`}
                  >
                    <Minus className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-8 h-0.5 bg-foreground"></div>
                  <div
                    className={`w-12 h-12 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary" : "border-border"}`}
                  >
                    <Minus className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-8 h-0.5 bg-foreground"></div>
                  <div
                    className={`w-12 h-12 rounded-lg border-2 bg-card flex items-center justify-center ${isRunning ? "border-primary" : "border-border"}`}
                  >
                    <Minus className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="text-center text-sm font-medium">Series Configuration</div>
              </div>
            )}
          </div>
        </div>

        {/* Running Indicator */}
        {isRunning && (
          <div className="absolute top-4 right-4">
            <Badge className="animate-pulse">
              <Zap className="mr-1 h-3 w-3" />
              Simulating
            </Badge>
          </div>
        )}
      </div>

      {/* Controls and Measurements */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium">Simulation Controls</h4>
              <div className="flex gap-2">
                <Button onClick={simulateExperiment} className="flex-1" variant={isRunning ? "destructive" : "default"}>
                  {isRunning ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetSimulation} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium">Measurements</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Voltage:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>{measurements.voltage.toFixed(1)}V</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Current:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>{measurements.current.toFixed(1)}mA</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Resistance:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>{measurements.resistance}Ω</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Power:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>{measurements.power.toFixed(1)}mW</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Click "Start" to begin the simulation. The circuit will be energized and you
            can observe the measurements in real-time. Use the measurement values to verify theoretical calculations.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
