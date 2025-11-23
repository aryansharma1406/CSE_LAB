import { Navigation } from "@/components/navigation"
import { CircuitSimulator } from "@/components/circuit-simulator" // Updated to use new CircuitSimulator component
import { ExperimentProgress } from "@/components/experiment-progress"
import { LiveMeasurements } from "@/components/live-measurements"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Users, BookOpen, Target, Lightbulb, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getPDFsForExperiments } from "@/app/actions/pdfs"

// This would typically come from a database
const getExperiment = (id: string) => {
  const experiments: Record<string, any> = {
    "ohms-law": {
      id: "ohms-law",
      title: "Ohm's Law Circuit",
      description: "Learn the fundamental relationship between voltage, current, and resistance using a simple circuit",
      difficulty: "Beginner",
      duration: "15 min",
      category: "Fundamentals",
      participants: 1247,
      image: "/electrical-circuit-with-resistor-and-voltmeter.jpg",
      objectives: [
        "Understand the relationship between voltage, current, and resistance",
        "Apply Ohm's Law formula (V = I × R) in practical circuits",
        "Measure voltage and current using virtual instruments",
        "Analyze how changing resistance affects current flow",
      ],
      theory: `
Ohm's Law is one of the most fundamental principles in electrical engineering. It describes the relationship between three key electrical quantities:

**Voltage (V)**: The electrical potential difference, measured in volts
**Current (I)**: The flow of electrical charge, measured in amperes  
**Resistance (R)**: The opposition to current flow, measured in ohms

The mathematical relationship is: **V = I × R**

This means:
- Voltage is directly proportional to current when resistance is constant
- Current decreases as resistance increases when voltage is constant
- Higher voltage produces higher current when resistance is constant
      `,
      materials: ["9V Battery", "1kΩ Resistor", "Voltmeter", "Ammeter", "Connecting wires"],
      steps: [
        {
          title: "Set up the basic circuit",
          description: "Connect the battery, resistor, and measuring instruments in series",
          image: "/ohms-law-step1.jpg",
          instructions: [
            "Drag a 9V battery from the component library to the workspace",
            "Add a 1kΩ resistor to the circuit",
            "Place a voltmeter across the resistor to measure voltage",
            "Insert an ammeter in series to measure current",
          ],
        },
        {
          title: "Make initial measurements",
          description: "Record the voltage and current values with the 1kΩ resistor",
          image: "/ohms-law-step2.jpg",
          instructions: [
            "Click the 'Simulate' button to start the circuit",
            "Record the voltage reading from the voltmeter",
            "Record the current reading from the ammeter",
            "Calculate the resistance using R = V/I",
          ],
        },
        {
          title: "Change resistance values",
          description: "Replace the resistor with different values and observe the changes",
          image: "/ohms-law-step3.jpg",
          instructions: [
            "Replace the 1kΩ resistor with a 2kΩ resistor",
            "Observe how the current changes",
            "Try a 500Ω resistor and note the current increase",
            "Verify that V = I × R holds true for each case",
          ],
        },
        {
          title: "Analyze the results",
          description: "Compare your measurements and verify Ohm's Law",
          image: "/ohms-law-step4.jpg",
          instructions: [
            "Create a table of your voltage, current, and resistance values",
            "Calculate V = I × R for each measurement",
            "Observe the inverse relationship between resistance and current",
            "Note that voltage remains constant (9V) across the resistor",
          ],
        },
      ],
      safetyNotes: [
        "Always check circuit connections before applying power",
        "Use appropriate voltage and current ratings for components",
        "Be aware of component heating with high currents",
      ],
      relatedExperiments: [
        { id: "series-parallel", title: "Series vs Parallel Circuits" },
        { id: "voltage-divider", title: "Voltage Divider Circuit" },
      ],
    },
    "series-parallel": {
      id: "series-parallel",
      title: "Series vs Parallel Circuits",
      description: "Compare how components behave in different circuit configurations and measure the differences",
      difficulty: "Intermediate",
      duration: "25 min",
      category: "Circuit Analysis",
      participants: 892,
      image: "/parallel-and-series-circuit-diagram.jpg",
      objectives: [
        "Understand the difference between series and parallel circuits",
        "Measure voltage distribution in series circuits",
        "Observe current division in parallel circuits",
        "Calculate total resistance for both configurations",
      ],
      theory: `
**Series Circuits**: Components are connected end-to-end in a single path
- Current is the same through all components
- Voltage divides across components
- Total resistance = R1 + R2 + R3...

**Parallel Circuits**: Components are connected across common points
- Voltage is the same across all components  
- Current divides between branches
- 1/Total resistance = 1/R1 + 1/R2 + 1/R3...
      `,
      materials: ["9V Battery", "Three 1kΩ Resistors", "Voltmeter", "Ammeter", "Connecting wires"],
      steps: [
        {
          title: "Build a series circuit",
          description: "Connect three resistors in series and measure voltages",
          image: "/series-circuit-step1.jpg",
          instructions: [
            "Connect three 1kΩ resistors in series with the battery",
            "Place voltmeters across each resistor",
            "Add an ammeter to measure total current",
            "Simulate and record all measurements",
          ],
        },
        {
          title: "Build a parallel circuit",
          description: "Reconnect the same resistors in parallel configuration",
          image: "/parallel-circuit-step2.jpg",
          instructions: [
            "Reconnect the three resistors in parallel",
            "Place ammeters in each branch to measure individual currents",
            "Add a voltmeter across the parallel combination",
            "Simulate and record all measurements",
          ],
        },
        {
          title: "Compare the results",
          description: "Analyze the differences between series and parallel circuits",
          image: "/circuit-comparison-step3.jpg",
          instructions: [
            "Compare total resistance in both configurations",
            "Note voltage distribution in series vs parallel",
            "Observe current behavior in both circuits",
            "Verify theoretical calculations with measured values",
          ],
        },
      ],
      safetyNotes: [
        "Ensure proper connections before energizing circuits",
        "Check that measuring instruments are properly connected",
      ],
      relatedExperiments: [
        { id: "ohms-law", title: "Ohm's Law Circuit" },
        { id: "voltage-divider", title: "Voltage Divider Circuit" },
      ],
    },
    "system-modeling": {
      id: "system-modeling",
      title: "System Modeling and Analysis",
      description:
        "Model and analyze the step response of a second-order RC circuit using Simulink and an STM32 Microcontroller.",
      difficulty: "Advanced",
      duration: "120 min",
      category: "Control Systems",
      participants: 156,
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
      objectives: [
        "Understand second-order RC circuit behavior and transfer functions",
        "Apply Simulink modeling techniques for circuit analysis",
        "Implement hardware control on STM32 microcontroller",
        "Compare theoretical predictions with practical measurements",
        "Analyze step response and system dynamics",
      ],
      theory: `
## Second-Order RC Circuit Analysis

A second-order RC circuit consists of two resistors (R₁, R₂) and two capacitors (C₁, C₂) connected in cascade. The transfer function is:

**H(s) = 1 / (R₁R₂C₁C₂s² + (R₁C₁ + R₂C₂ + R₁C₂)s + 1)**

Key concepts:
- **Cascaded filtering**: Two stages of RC filtering for steeper frequency response
- **Natural frequency (ωₙ)**: Determines oscillation speed
- **Damping ratio (ζ)**: Controls overshoot and settling time
- **Step response**: Shows transient behavior and steady-state accuracy
      `,
      materials: [
        "Resistors: R₁ = 10kΩ, R₂ = 10kΩ",
        "Capacitors: C₁ = 47μF, C₂ = 47μF",
        "STM32F767ZI Microcontroller",
        "Breadboard",
        "5V Power Supply",
        "Jumper wires",
      ],
      steps: [
        {
          title: "Circuit Design & Simulation",
          description: "Design the second-order RC circuit and create Simulink model",
          image: "/ohms-law-step1.jpg",
          instructions: [
            "Draw the cascaded RC circuit schematic",
            "Calculate transfer function coefficients",
            "Create Simulink block diagram with step input",
            "Configure transfer function block with calculated values",
            "Set simulation parameters: Tend = 10 seconds, solver = ode45",
          ],
        },
        {
          title: "Run Simulations",
          description: "Simulate the step response and analyze results",
          image: "/ohms-law-step2.jpg",
          instructions: [
            "Apply unit step input at t = 0",
            "Observe transient response characteristics",
            "Record rise time, settling time, and overshoot",
            "Save simulation data to MATLAB workspace",
            "Export results for comparison with hardware",
          ],
        },
        {
          title: "Hardware Implementation",
          description: "Deploy to STM32 microcontroller",
          image: "/ohms-law-step3.jpg",
          instructions: [
            "Install Simulink Coder Support Package for STM32",
            "Configure hardware board settings for STM32F767ZI",
            "Build and download model to microcontroller",
            "Set up data logging on STM32",
            "Apply step input and collect response data",
          ],
        },
        {
          title: "Compare & Analyze",
          description: "Compare simulation vs hardware implementation",
          image: "/ohms-law-step4.jpg",
          instructions: [
            "Plot simulation and hardware response on same graph",
            "Calculate Integral Square Error (ISE)",
            "Identify discrepancies and causes",
            "Document findings and conclusions",
            "Suggest improvements for better model accuracy",
          ],
        },
      ],
      safetyNotes: [
        "Verify all connections before applying power supply",
        "Use appropriate current limiting to protect components",
        "Allow capacitors to discharge before disconnecting power",
        "Do not exceed rated voltage on any component",
      ],
      hasLabManual: true,
      manualId: "system-modeling",
    },
    "dc-motor-modeling": {
      id: "dc-motor-modeling",
      title: "First and Second Order Modeling of DC Motor",
      description:
        "Transient performance analysis of DC Motor speed control circuit. Identify and model transfer functions.",
      difficulty: "Advanced",
      duration: "135 min",
      category: "Control Systems",
      participants: 142,
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
      objectives: [
        "Analyze DC motor speed control circuit transient response",
        "Determine first and second-order transfer functions",
        "Use MATLAB System Identification toolbox",
        "Validate models through experimental data",
        "Understand motor dynamics and control characteristics",
      ],
      theory: `
## DC Motor Transfer Function Modeling

A DC motor's response to input voltage can be modeled as a transfer function. Depending on system complexity, it may behave as first or second-order:

**First-Order System:** G(s) = K / (τs + 1)
- K: System gain
- τ: Time constant (63.2% settling time)

**Second-Order System:** G(s) = K / (as² + bs + c)
- Accounts for mechanical and electrical dynamics
- ζ < 1: Underdamped (oscillatory)
- ζ = 1: Critically damped (fastest non-oscillatory)
- ζ > 1: Overdamped (slow response)

The system identification process matches experimental data to model parameters.
      `,
      materials: [
        "Encoder Motor with pulley",
        "STM32F767ZI Microcontroller",
        "Motor Driver (L298N or similar)",
        "Breadboard",
        "Resistors and capacitors",
        "Jumper wires",
      ],
      steps: [
        {
          title: "Motor Setup & Speed Measurement",
          description: "Connect motor with encoder and measure speed response",
          image: "/ohms-law-step1.jpg",
          instructions: [
            "Connect motor to motor driver output",
            "Attach encoder to motor shaft",
            "Connect encoder to STM32 capture pins",
            "Configure PWM on STM32 for motor control",
            "Test speed measurement at different duty cycles",
          ],
        },
        {
          title: "Collect Step Response Data",
          description: "Record motor speed response to step input",
          image: "/ohms-law-step2.jpg",
          instructions: [
            "Apply 20% duty cycle PWM and record speed",
            "Increase duty cycle: 40%, 60%, 80%, 100%",
            "Record time to reach 63.2% of final speed",
            "Save input (PWM) and output (speed) to MATLAB workspace",
            "Plot speed vs time for each duty cycle",
          ],
        },
        {
          title: "System Identification in MATLAB",
          description: "Use System Identification Toolbox to model motor",
          image: "/ohms-law-step3.jpg",
          instructions: [
            "Import input-output data into System ID app",
            "Select transfer function model type",
            "Estimate parameters for first-order system",
            "Test second-order model fit",
            "Compare model accuracy percentages",
          ],
        },
        {
          title: "Validate & Compare Models",
          description: "Verify models with experimental data",
          image: "/ohms-law-step4.jpg",
          instructions: [
            "Load identified transfer functions into Simulink",
            "Compare model response with measured data",
            "Calculate ISE (Integral Square Error)",
            "Document first vs second-order accuracy",
            "Verify with additional test speeds",
          ],
        },
      ],
      safetyNotes: [
        "Ensure motor is securely mounted before operation",
        "Keep hands and clothing away from rotating motor",
        "Use current limiting to protect motor driver",
        "Verify encoder connections before applying power",
      ],
      hasLabManual: true,
      manualId: "dc-motor-modeling",
    },
    "stability-analysis": {
      id: "stability-analysis",
      title: "Stability Analysis of Closed-Loop DC Motor",
      description:
        "Evaluate closed-loop DC motor performance by testing gain values and analyzing Gain and Phase Margins.",
      difficulty: "Advanced",
      duration: "150 min",
      category: "Control Systems",
      participants: 128,
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
      objectives: [
        "Analyze closed-loop system stability using frequency domain methods",
        "Determine Gain and Phase Margins for different controller gains",
        "Identify critical gain conditions for oscillations",
        "Understand damping factor and time constant effects",
        "Design stable closed-loop motor controllers",
      ],
      theory: `
## Closed-Loop Stability Analysis

Stability is assessed using **Bode plot** analysis and **Nyquist criteria**:

### Gain Margin (GM)
- The amount by which system gain can be increased before instability
- Found at frequency where phase = -180°
- Stable if GM > 0 dB

### Phase Margin (PM)
- The additional phase shift allowed before instability  
- Found at frequency where gain = 0 dB (unity gain crossover)
- Stable if PM > 0°

### Damping Effects
- **Underdamped (0 < ζ < 1)**: Oscillatory response with overshoot
- **Critically damped (ζ = 1)**: Fastest non-oscillatory response
- **Overdamped (ζ > 1)**: Slow but stable response

The relationship between gain K and stability margins determines controller performance.
      `,
      materials: [
        "STM32F767ZI Microcontroller",
        "Encoder Motor",
        "Motor Driver",
        "Breadboard",
        "Resistors and capacitors",
        "Jumper wires",
      ],
      steps: [
        {
          title: "System Identification & Modeling",
          description: "Obtain DC motor transfer function from previous experiment",
          image: "/ohms-law-step1.jpg",
          instructions: [
            "Use transfer function from Experiment 2",
            "Create closed-loop system block diagram",
            "Add proportional controller block with gain K",
            "Set up Simulink model for stability analysis",
            "Configure Bode plot analysis tools",
          ],
        },
        {
          title: "Vary Controller Gain",
          description: "Test system response at different gain values",
          image: "/ohms-law-step2.jpg",
          instructions: [
            "Set initial gain K = 0.5",
            "Simulate step response and observe behavior",
            "Gradually increase K: 1, 2, 5, 10",
            "Record response characteristics at each gain",
            "Identify gain value causing sustained oscillations",
          ],
        },
        {
          title: "Generate Bode Plots",
          description: "Create frequency response plots for different gains",
          image: "/ohms-law-step3.jpg",
          instructions: [
            "Use Simulink Bode plot tool",
            "Generate plots for each gain value",
            "Measure Gain Margin at -180° phase",
            "Measure Phase Margin at unity gain crossover",
            "Document all margin values in observation table",
          ],
        },
        {
          title: "Analyze Stability Margins",
          description: "Determine critical conditions and stability limits",
          image: "/ohms-law-step4.jpg",
          instructions: [
            "Plot Gain vs Gain Margin graph",
            "Identify critical gain where GM = 0 dB",
            "Calculate damping ratio for each response",
            "Determine optimal gain for stable response",
            "Verify findings with hardware implementation",
          ],
        },
      ],
      safetyNotes: [
        "Sustained oscillations may cause motor heating - monitor temperature",
        "Limit maximum current with motor driver protection",
        "Never exceed motor rated specifications",
        "Stop immediately if unusual vibration occurs",
      ],
      hasLabManual: true,
      manualId: "stability-analysis",
    },
  }

  return experiments[id] || null
}

export default async function ExperimentPage({ params }: { params: { id: string } }) {
  // First try hardcoded experiments
  let experiment = getExperiment(params.id)

  // If not found, try fetching from database
  if (!experiment) {
    try {
      const { experiments: pdfExperiments } = await getPDFsForExperiments()
      const pdfExperiment = pdfExperiments.find((exp: any) => exp.id === params.id)
      
      if (pdfExperiment) {
        // Convert PDF experiment to experiment format
        experiment = {
          id: pdfExperiment.id,
          title: pdfExperiment.title,
          description: pdfExperiment.description || '',
          difficulty: pdfExperiment.difficulty || 'Beginner',
          duration: pdfExperiment.duration || '120 min',
          category: pdfExperiment.category || 'General',
          participants: pdfExperiment.participants || 0,
          image: pdfExperiment.image || '/virtual-circuit-board-with-electronic-components-a.jpg',
          objectives: [
            "Follow the lab manual instructions",
            "Complete the experiment steps",
            "Document your findings",
          ],
          theory: pdfExperiment.description || 'Please refer to the lab manual for detailed theory and instructions.',
          materials: [],
          steps: [
            {
              title: "Read the Lab Manual",
              description: "Review the lab manual for detailed instructions",
              image: pdfExperiment.image || '/virtual-circuit-board-with-electronic-components-a.jpg',
              instructions: [
                "Download and open the lab manual",
                "Read through the objectives and theory",
                "Review the required materials",
                "Understand the experimental procedure",
              ],
            },
            {
              title: "Set Up the Experiment",
              description: "Prepare the circuit and equipment",
              image: pdfExperiment.image || '/virtual-circuit-board-with-electronic-components-a.jpg',
              instructions: [
                "Gather all required materials",
                "Set up the circuit as described",
                "Verify all connections",
                "Check power supply settings",
              ],
            },
            {
              title: "Perform Measurements",
              description: "Collect data and measurements",
              image: pdfExperiment.image || '/virtual-circuit-board-with-electronic-components-a.jpg',
              instructions: [
                "Apply input signals as specified",
                "Record all measurements",
                "Take note of any observations",
                "Document any unexpected behavior",
              ],
            },
            {
              title: "Analyze Results",
              description: "Process and interpret the data",
              image: pdfExperiment.image || '/virtual-circuit-board-with-electronic-components-a.jpg',
              instructions: [
                "Plot the collected data",
                "Compare with theoretical predictions",
                "Calculate any required parameters",
                "Document your conclusions",
              ],
            },
          ],
          safetyNotes: [
            "Follow all safety guidelines in the lab manual",
            "Verify connections before applying power",
            "Use appropriate protective equipment",
          ],
          hasLabManual: true,
          manualId: pdfExperiment.id.toString(),
          pdf_url: pdfExperiment.pdf_url,
        }
      }
    } catch (error) {
      console.error("Error fetching experiment from database:", error)
    }
  }

  if (!experiment) {
    notFound()
  }

  const measurementStats = [
    { label: "Voltage", value: "0.00 V" },
    { label: "Current", value: "0.00 mA" },
    { label: "Power", value: "0.00 mW" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  experiment.difficulty === "Beginner"
                    ? "secondary"
                    : experiment.difficulty === "Intermediate"
                      ? "default"
                      : "destructive"
                }
              >
                {experiment.difficulty}
              </Badge>
              <Badge variant="outline">{experiment.category}</Badge>
            </div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl text-balance">{experiment.title}</h1>
            <p className="text-lg text-muted-foreground text-pretty">{experiment.description}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {experiment.duration}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {experiment.participants.toLocaleString()} completed
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ExperimentProgress experimentId={experiment.id} totalSteps={experiment.steps?.length || 0} />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[280px_1fr_280px] gap-6">
          {/* Left Sidebar - Simulation Controls */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border-primary/10 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Simulation Controls</CardTitle>
                <CardDescription className="text-xs">Adjust and observe feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {measurementStats.map((stat) => (
                    <div key={stat.label} className="p-2.5 rounded-lg border bg-background">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-base font-semibold text-primary">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t">
                  <li>• Use component library</li>
                  <li>• Adjust parameters</li>
                  <li>• Monitor measurements</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Center - Interactive Simulation */}
          <div className="space-y-6 min-w-0">
            <Card className="overflow-hidden shadow-lg border-primary/20 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-2xl">Interactive Simulation</CardTitle>
                <CardDescription>
                  Build and test circuits using our virtual lab environment with CircuitJS1 integration
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <div className="w-full h-full flex-1">
                  <CircuitSimulator mode="experiment" experimentId={experiment.id} />
                </div>
              </CardContent>
            </Card>

            {/* Detailed Content Tabs */}
            <Tabs defaultValue="instructions" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" className="space-y-6">
                <LiveMeasurements experimentId={experiment.id} />

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Learning Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {experiment.objectives.map((objective: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  {experiment.steps.map(
                    (
                      step: {
                        title: string
                        description: string
                        image?: string
                        instructions: string[]
                      },
                      index: number,
                    ) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="font-heading text-lg">
                          Step {index + 1}: {step.title}
                        </CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-medium">Instructions:</h4>
                              <ol className="space-y-2 text-sm">
                                {step.instructions.map((instruction: string, i: number) => (
                                <li key={i} className="flex gap-2">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                                    {i + 1}
                                  </span>
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <img
                              src={step.image || "/placeholder.svg"}
                              alt={step.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="theory" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Theory & Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{experiment.theory}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Required Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {experiment.materials.map((material: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded border">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{material}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Safety Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {experiment.safetyNotes.map((note: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                        >
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800">{note}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Related Experiments, Quick Actions, Lab Manual */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            {/* Related Experiments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm">Related Experiments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {experiment.relatedExperiments && experiment.relatedExperiments.length > 0 ? (
                    experiment.relatedExperiments.map((related: { id: string; title: string }) => (
                      <Link
                        key={related.id}
                        href={`/experiments/${related.id}`}
                        className="block p-1.5 rounded border hover:bg-muted/50 transition-colors text-xs"
                      >
                        <span className="font-medium">{related.title}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No related experiments.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full text-xs h-8" size="sm" asChild>
                  <Link href="/circuit-lab">Open Circuit Lab</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent text-xs h-8" size="sm" asChild>
                  <Link href="/experiments">Browse Experiments</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Lab Manual */}
            {experiment.hasLabManual && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-sm">Lab Manual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {experiment.pdf_url ? (
                    <Button className="w-full text-xs h-8" size="sm" asChild>
                      <a href={experiment.pdf_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-1.5 h-3 w-3" />
                        View & Download
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full text-xs h-8" size="sm" asChild>
                      <Link href={`/lab-manuals/${experiment.manualId}`}>
                        <FileText className="mr-1.5 h-3 w-3" />
                        View & Download
                      </Link>
                    </Button>
                  )}
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Open the lab manual in a viewer or download the PDF
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
