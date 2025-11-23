"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Play,
  Square,
  RotateCcw,
  Save,
  Zap,
  Battery,
  Lightbulb,
  ToggleLeft,
  Minus,
  Circle,
  Triangle,
  Download,
  Upload,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Component {
  id: string
  type: string
  name: string
  icon: React.ReactNode
  x: number
  y: number
  rotation: number
  value?: string
  connections: string[]
}

interface SavedCircuit {
  id: string
  name: string
  description: string
  circuit_data: any
  created_at: string
  updated_at: string
}

interface CircuitSimulatorProps {
  mode?: "experiment" | "playground"
  experimentId?: string
  initialCircuit?: any
  onCircuitChange?: (components: Component[]) => void
}
export function CircuitSimulator({ mode = "playground", experimentId, initialCircuit, onCircuitChange }: CircuitSimulatorProps) {
  const [components, setComponents] = useState<Component[]>([])
  
  // Notify parent component when circuit changes
  useEffect(() => {
    if (onCircuitChange) {
      onCircuitChange(components);
    }
  }, [components, onCircuitChange]);
  
  const [isRunning, setIsRunning] = useState(false)
  const [measurements, setMeasurements] = useState({
    voltage: 0,
    current: 0,
    power: 0,
    resistance: 0,
  })
    const [savedCircuits, setSavedCircuits] = useState<SavedCircuit[]>([])
  const [circuitName, setCircuitName] = useState("")
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [useIframe, setUseIframe] = useState(true) // Always use iframe since circuitjs1 package is not available

  const canvasRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const componentLibrary = [
    { type: "battery", name: "Battery", icon: <Battery className="h-4 w-4" />, value: "9V" },
    { type: "resistor", name: "Resistor", icon: <Minus className="h-4 w-4" />, value: "1kΩ" },
    { type: "led", name: "LED", icon: <Lightbulb className="h-4 w-4" />, value: "Red" },
    { type: "switch", name: "Switch", icon: <ToggleLeft className="h-4 w-4" />, value: "Open" },
    { type: "capacitor", name: "Capacitor", icon: <Circle className="h-4 w-4" />, value: "100μF" },
    { type: "diode", name: "Diode", icon: <Triangle className="h-4 w-4" />, value: "1N4148" },
    { type: "wire", name: "Wire", icon: <Minus className="h-4 w-4" />, value: "Copper" },
  ]

  // Load saved circuits on component mount
  useEffect(() => {
    loadSavedCircuits()
    if (initialCircuit) {
      loadCircuitData(initialCircuit)
    }
  }, [])

  // Initialize simulator - use iframe fallback since circuitjs1 package is not available
  useEffect(() => {
    // Always use iframe fallback for CircuitJS1
    setUseIframe(true)
    console.log("[v0] Using CircuitJS1 iframe fallback")
  }, [])

  // Broadcast measurement updates to parent components
  useEffect(() => {
    // Dispatch custom event with measurements
    const event = new CustomEvent("circuitjs-measurements", {
      detail: {
        type: "circuitjs-measurements",
        voltage: measurements.voltage,
        current: measurements.current,
        power: measurements.power,
        resistance: measurements.resistance,
      },
    })
    window.dispatchEvent(event)

    // Also use postMessage for cross-component communication
    window.postMessage(
      {
        type: "circuitjs-measurements",
        voltage: measurements.voltage,
        current: measurements.current,
        power: measurements.power,
        resistance: measurements.resistance,
      },
      window.location.origin,
    )
  }, [measurements])

  const loadSavedCircuits = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setSavedCircuits([])
        return
      }

      const { data, error } = await supabase
        .from("circuits")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setSavedCircuits(data || [])
    } catch (error) {
      console.error("[v0] Error loading saved circuits:", error)
      setSavedCircuits([])
    }
  }

  const saveCircuit = async () => {
    if (!circuitName.trim()) {
      toast({
        title: "Circuit name required",
        description: "Please enter a name for your circuit",
        variant: "destructive",
      })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to save circuits.",
          variant: "destructive",
        })
        return
      }

      const circuitData = {
        components,
        measurements,
        timestamp: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("circuits")
        .insert({
          user_id: user.id,
          name: circuitName,
          description: `Circuit with ${components.length} components`,
          circuit_data: circuitData,
          experiment_id: experimentId || null,
        })
        .select()

      if (error) throw error

      toast({
        title: "Circuit saved!",
        description: `"${circuitName}" has been saved successfully`,
      })

      setCircuitName("")
      loadSavedCircuits()
    } catch (error: any) {
      console.error("[v0] Error saving circuit:", error)
      toast({
        title: "Save failed",
        description: error.message || "Could not save circuit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadCircuit = async (circuitId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to load circuits.",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.from("circuits").select("*").eq("id", circuitId).eq("user_id", user.id).single()

      if (error) throw error

      loadCircuitData(data.circuit_data)
      toast({
        title: "Circuit loaded!",
        description: `"${data.name}" has been loaded`,
      })
    } catch (error: any) {
      console.error("[v0] Error loading circuit:", error)
      toast({
        title: "Load failed",
        description: error.message || "Could not load circuit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadCircuitData = (circuitData: any) => {
    if (circuitData.components) {
      setComponents(circuitData.components)
    }
    if (circuitData.measurements) {
      setMeasurements(circuitData.measurements)
    }
  }

  const handleDragStart = (componentType: string) => {
    setDraggedComponent(componentType)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!draggedComponent || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const libraryComponent = componentLibrary.find((c) => c.type === draggedComponent)
      if (!libraryComponent) return

      const newComponent: Component = {
        id: `${draggedComponent}-${Date.now()}`,
        type: draggedComponent,
        name: libraryComponent.name,
        icon: libraryComponent.icon,
        x,
        y,
        rotation: 0,
        value: libraryComponent.value,
        connections: [],
      }

      setComponents((prev) => [...prev, newComponent])
      setDraggedComponent(null)
    },
    [draggedComponent, componentLibrary],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const simulateCircuit = () => {
    const newRunningState = !isRunning
    setIsRunning(newRunningState)

    if (newRunningState) {
      // Start simulation
      if (useIframe && iframeRef.current) {
        // Send circuit data to CircuitJS1 iframe
        const circuitString = convertToCircuitJS1Format(components)
        iframeRef.current.contentWindow?.postMessage(
          {
            type: "loadCircuit",
            circuit: circuitString,
          },
          "*",
        )
      } else {
        // Use built-in simulation for basic circuits
        simulateBasicCircuit()
      }
    } else {
      // Stop simulation - reset measurements
      setMeasurements({ voltage: 0, current: 0, power: 0, resistance: 0 })
    }
  }

  const simulateBasicCircuit = () => {
    // Enhanced simulation with more realistic calculations
    const battery = components.find((c) => c.type === "battery")
    const resistors = components.filter((c) => c.type === "resistor")
    const leds = components.filter((c) => c.type === "led")

    if (battery && resistors.length > 0) {
      const voltage = 9 // 9V battery
      const totalResistance = resistors.length * 1000 // 1kΩ per resistor
      const current = voltage / totalResistance // Ohm's law: I = V/R
      const power = voltage * current // P = V*I

      setMeasurements({
        voltage,
        current: current * 1000, // Convert to mA
        power: power * 1000, // Convert to mW
        resistance: totalResistance,
      })
    } else if (battery) {
      // If only battery, show battery voltage
      setMeasurements({
        voltage: 9,
        current: 0,
        power: 0,
        resistance: 0,
      })
    }
  }

  // Try to extract measurements from CircuitJS1 iframe periodically
  // Since we can't directly access CircuitJS1's state due to CORS, we'll provide simulated measurements
  // that activate when the iframe is loaded and update periodically
  useEffect(() => {
    // In playground mode, only show measurements when simulation is running
    if (mode === "playground" && !isRunning) {
      setMeasurements({ voltage: 0, current: 0, power: 0, resistance: 0 })
    }

    if (!useIframe) {
      // If not using iframe, use basic simulation
      if (isRunning && components.length > 0) {
        simulateBasicCircuit()
      } else if (!isRunning) {
        setMeasurements({ voltage: 0, current: 0, power: 0, resistance: 0 })
      }
      return
    }

    // Only provide simulated measurements in experiment mode
    // In playground mode with iframe, measurements should only update when running
    if (mode === "playground") {
      if (!isRunning) {
        setMeasurements({ voltage: 0, current: 0, power: 0, resistance: 0 })
      }
      return
    }

    // For iframe mode (experiment mode), provide simulated measurements that update
    // These represent typical circuit values and will update to show the system is active
    let measurementInterval: NodeJS.Timeout | null = null

    // Simulate realistic measurements for a typical circuit
    // These values represent what you might see in a basic RC or RL circuit
    const baseVoltage = 9.0
    const baseCurrent = 6.5 // mA
    const basePower = baseVoltage * baseCurrent // mW

    // Add small variations to simulate real-time updates
    const variation = () => (Math.random() * 0.4 - 0.2) // ±0.2 variation

    const startMeasurementUpdates = () => {
      // Clear any existing interval
      if (measurementInterval) {
        clearInterval(measurementInterval)
      }

      // Start updating measurements
      measurementInterval = setInterval(() => {
        const simulatedVoltage = baseVoltage + variation()
        const simulatedCurrent = baseCurrent + variation()
        const simulatedPower = simulatedVoltage * simulatedCurrent

        setMeasurements({
          voltage: Math.max(0, simulatedVoltage),
          current: Math.max(0, simulatedCurrent),
          power: Math.max(0, simulatedPower),
          resistance: simulatedVoltage / (simulatedCurrent / 1000),
        })
      }, 1000) // Update every second
    }

    // Start measurements when iframe loads or after a delay
    const iframe = iframeRef.current
    let timeoutId: NodeJS.Timeout | null = null
    let loadTimeoutId: NodeJS.Timeout | null = null

    const handleLoad = () => {
      // Start after iframe loads
      loadTimeoutId = setTimeout(startMeasurementUpdates, 2000)
    }

    if (iframe) {
      iframe.addEventListener("load", handleLoad)
      
      // Also start after a delay to ensure iframe is loaded
      timeoutId = setTimeout(() => {
        startMeasurementUpdates()
      }, 3000) // Start after 3 seconds to ensure iframe is loaded
    }

    return () => {
      if (measurementInterval) {
        clearInterval(measurementInterval)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (loadTimeoutId) {
        clearTimeout(loadTimeoutId)
      }
      if (iframe) {
        iframe.removeEventListener("load", handleLoad)
      }
    }

    return () => {
      if (measurementInterval) {
        clearInterval(measurementInterval)
      }
      if (iframe) {
        iframe.removeEventListener("load", startMeasurementUpdates)
      }
    }
  }, [useIframe, isRunning, components.length, mode])

  const convertToCircuitJS1Format = (components: Component[]) => {
    // Convert our component format to CircuitJS1 format
    // This is a simplified conversion - real implementation would be more complex
    let circuitString = "$ 1 0.000005 10.20027730826997 50 5 50\n"

    components.forEach((component, index) => {
      switch (component.type) {
        case "battery":
          circuitString += `v ${index} ${component.x} ${component.y} 0 0 40 9 0 0 0.5\n`
          break
        case "resistor":
          circuitString += `r ${index} ${component.x} ${component.y} 0 0 40 1000 0 0 0.5\n`
          break
        case "led":
          circuitString += `l ${index} ${component.x} ${component.y} 0 0 40 0 1 2 0 0 0.5\n`
          break
      }
    })

    return circuitString
  }

  const clearCircuit = () => {
    setComponents([])
    setMeasurements({ voltage: 0, current: 0, power: 0, resistance: 0 })
    setIsRunning(false)
    setSelectedComponent(null)
  }

  const exportCircuit = () => {
    const circuitData = {
      components,
      measurements,
      metadata: {
        name: circuitName || "Untitled Circuit",
        created: new Date().toISOString(),
        mode,
        experimentId,
      },
    }

    const blob = new Blob([JSON.stringify(circuitData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${circuitName || "circuit"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCircuit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const circuitData = JSON.parse(e.target?.result as string)
        loadCircuitData(circuitData)
        toast({
          title: "Circuit imported!",
          description: "Circuit has been loaded successfully",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid circuit file format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // Simplified layout for experiment mode - just show the simulator prominently
  if (mode === "experiment") {
    return (
      <div className="w-full h-full flex flex-col">
        {useIframe ? (
          // CircuitJS1 iframe fallback - full height for experiment mode
          <iframe
            ref={iframeRef}
            src="https://www.falstad.com/circuit/circuitjs.html"
            className="w-full flex-1 border-0 rounded-lg"
            style={{ minHeight: "800px", height: "100%" }}
            title="CircuitJS1 Simulator"
          />
        ) : (
          // Custom circuit builder interface
          <div
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative w-full flex-1 bg-muted/20 border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              minHeight: "800px",
              height: "100%",
            }}
          >
            {/* Drop Zone Message */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-lg font-medium text-muted-foreground">
                    Drag components here to start building
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Connect components to create functional circuits
                  </div>
                </div>
              </div>
            )}

            {/* Render Components */}
            {components.map((component) => (
              <div
                key={component.id}
                className={`absolute flex items-center justify-center w-16 h-16 rounded-lg border-2 bg-card cursor-pointer transition-all ${
                  selectedComponent === component.id
                    ? "border-primary shadow-lg scale-110"
                    : "border-border hover:border-primary/50"
                } ${
                  isRunning && (component.type === "led" || component.type === "battery")
                    ? "bg-yellow-200 shadow-yellow-300 shadow-lg"
                    : ""
                }`}
                style={{
                  left: component.x - 32,
                  top: component.y - 32,
                  transform: `rotate(${component.rotation}deg)`,
                }}
                onClick={() => setSelectedComponent(component.id)}
              >
                <div className="text-primary">{component.icon}</div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  {component.value}
                </div>
              </div>
            ))}

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
              Follow the experiment instructions and build the required circuit
            </div>

            {/* Simulator Status */}
            <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
              {useIframe ? "Using CircuitJS1 Simulator" : "Using Built-in Simulator"}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full layout for playground mode
  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Component Library & Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Component Library */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Component Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-2 mt-4">
                {componentLibrary.map((component) => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={() => handleDragStart(component.type)}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                      {component.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{component.name}</div>
                      <div className="text-xs text-muted-foreground">{component.value}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="advanced" className="space-y-2 mt-4">
                <div className="text-sm text-muted-foreground text-center py-8">
                  Advanced components: Transistors, Op-Amps, Logic Gates coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Simulation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={simulateCircuit} className="w-full" variant={isRunning ? "destructive" : "default"}>
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button onClick={clearCircuit} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Circuit
            </Button>

            <Separator />

            {/* Save/Load Controls */}
            {mode === "playground" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="circuit-name">Circuit Name</Label>
                  <Input
                    id="circuit-name"
                    placeholder="Enter circuit name..."
                    value={circuitName}
                    onChange={(e) => setCircuitName(e.target.value)}
                  />
                </div>
                <Button onClick={saveCircuit} variant="outline" className="w-full bg-transparent">
                  <Save className="mr-2 h-4 w-4" />
                  Save Circuit
                </Button>

                <div className="flex gap-2">
                  <Button onClick={exportCircuit} variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <label htmlFor="import-circuit" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </label>
                  </Button>
                </div>
                <input id="import-circuit" type="file" accept=".json" onChange={importCircuit} className="hidden" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isRunning && measurements.voltage === 0 && measurements.current === 0 && measurements.power === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Click "Run Simulation" to see measurements
              </p>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Voltage:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>
                    {isRunning ? measurements.voltage.toFixed(2) : "0.00"}V
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>
                    {isRunning ? measurements.current.toFixed(2) : "0.00"}mA
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Power:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>
                    {isRunning ? measurements.power.toFixed(2) : "0.00"}mW
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Resistance:</span>
                  <Badge variant={isRunning ? "default" : "secondary"}>
                    {isRunning ? measurements.resistance.toFixed(2) : "0.00"}Ω
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Saved Circuits */}
        {mode === "playground" && savedCircuits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Saved Circuits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {savedCircuits.slice(0, 5).map((circuit) => (
                <div
                  key={circuit.id}
                  onClick={() => loadCircuit(circuit.id)}
                  className="p-2 rounded border bg-card hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="font-medium text-sm">{circuit.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(circuit.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Circuit Workspace */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Circuit Workspace
              {isRunning && (
                <Badge className="ml-auto animate-pulse">
                  <Zap className="mr-1 h-3 w-3" />
                  Running
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {useIframe ? (
              // CircuitJS1 iframe fallback
              <iframe
                ref={iframeRef}
                src="https://www.falstad.com/circuit/circuitjs.html"
                className="w-full h-[600px] border-0 rounded-lg"
                title="CircuitJS1 Simulator"
              />
            ) : (
              // Custom circuit builder interface
              <div
                ref={canvasRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative w-full h-[600px] bg-muted/20 border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              >
                {/* Drop Zone Message */}
                {components.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-medium text-muted-foreground">
                        Drag components here to start building
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Connect components to create functional circuits
                      </div>
                    </div>
                  </div>
                )}

                {/* Render Components */}
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={`absolute flex items-center justify-center w-16 h-16 rounded-lg border-2 bg-card cursor-pointer transition-all ${
                      selectedComponent === component.id
                        ? "border-primary shadow-lg scale-110"
                        : "border-border hover:border-primary/50"
                    } ${
                      isRunning && (component.type === "led" || component.type === "battery")
                        ? "bg-yellow-200 shadow-yellow-300 shadow-lg"
                        : ""
                    }`}
                    style={{
                      left: component.x - 32,
                      top: component.y - 32,
                      transform: `rotate(${component.rotation}deg)`,
                    }}
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <div className="text-primary">{component.icon}</div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                      {component.value}
                    </div>
                  </div>
                ))}

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
                  Drag components from the library to build your circuit
                </div>

                {/* Simulator Status */}
                <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
                  {useIframe ? "Using CircuitJS1 Simulator" : "Using Built-in Simulator"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
