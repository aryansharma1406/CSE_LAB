"use client"

import { Navigation } from "@/components/navigation"
import { CircuitBuilder } from "@/components/circuit-builder"

export default function CircuitBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 mb-6">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl">Circuit Builder</h1>
          <p className="text-muted-foreground">
            Drag and drop components to build your own electrical circuits. Connect components with wires and simulate
            your designs.
          </p>
        </div>
        <CircuitBuilder />
      </div>
    </div>
  )
}
