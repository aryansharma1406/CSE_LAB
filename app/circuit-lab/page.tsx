import { Navigation } from "@/components/navigation"
import { CircuitSimulator } from "@/components/circuit-simulator"
import TransferFunctionCalculator from '@/components/circuit/TransferFunctionCalculator';
import ManualTransferFunction from '@/components/circuit/ManualTransferFunction';
import TransferFunctionCalculatorWithAnalysis from '@/components/circuit/TransferFunctionCalculatorWithAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function CircuitLabPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 mb-6">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl">Circuit Lab</h1>
          <p className="text-muted-foreground max-w-2xl">
            Welcome to the Circuit Lab! This is your playground for building and experimenting with electrical circuits.
            Drag components from the library, connect them together, and run simulations to see how they work. Save your
            designs and share them with others.
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Free Experimentation
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Save & Load Circuits
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Real-time Simulation
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Export & Import</div>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Transfer Functions</div>
          </div>
        </div>
        
        {/* Circuit Simulator */}
        <CircuitSimulator mode="playground" />
        
        {/* Transfer Function Section - Same grid layout as CircuitSimulator */}
        <div className="mt-12">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Empty left column to match simulator layout */}
            <div className="lg:col-span-1"></div>
            
            {/* Transfer Function in right area */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Transfer Function Calculator</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="auto">From Circuit</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual">
                      <ManualTransferFunction />
                    </TabsContent>
                    <TabsContent value="auto">
                      <TransferFunctionCalculator />
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>

              {/* MATLAB-style Analysis Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">MATLAB-style Analysis</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <TransferFunctionCalculatorWithAnalysis />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}