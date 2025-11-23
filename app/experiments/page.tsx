"use client"

import { useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Clock, Users, FileText, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getPDFsForExperiments } from "@/app/actions/pdfs"

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Default experiments (fallback)
  const defaultExperiments = [
    {
      id: "system-modeling",
      title: "System Modeling and Analysis",
      description:
        "Model and analyze the step response of a second-order RC circuit using Simulink and an STM32 Microcontroller.",
      difficulty: "Advanced",
      duration: "120 min",
      category: "Control Systems",
      participants: 156,
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
      hasLabManual: true,
      manualId: "system-modeling",
    },
    {
      id: "dc-motor-modeling",
      title: "First and Second Order Modeling of DC Motor",
      description:
        "Transient performance analysis of DC Motor speed control circuit. Identify first and second-order transfer functions.",
      difficulty: "Advanced",
      duration: "135 min",
      category: "Control Systems",
      participants: 142,
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
      hasLabManual: true,
      manualId: "dc-motor-modeling",
    },
    {
      id: "stability-analysis",
      title: "Stability Analysis of Closed-Loop DC Motor",
      description:
        "Evaluate closed-loop DC motor performance by testing gain values and analyzing Gain and Phase Margins.",
      difficulty: "Advanced",
      duration: "150 min",
      category: "Control Systems",
      participants: 128,
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
      hasLabManual: true,
      manualId: "stability-analysis",
    },
  ]

  useEffect(() => {
    async function fetchExperiments() {
      try {
        const { experiments: pdfExperiments } = await getPDFsForExperiments()
        if (pdfExperiments && pdfExperiments.length > 0) {
          setExperiments(pdfExperiments)
        } else {
          // Fallback to default experiments if no PDFs found
          setExperiments(defaultExperiments)
        }
      } catch (error) {
        console.error("Error fetching experiments:", error)
        // Fallback to default experiments on error
        setExperiments(defaultExperiments)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchExperiments()
  }, [])

  const categories = ["All", "Control Systems", "Circuit Analysis"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("query") ?? "")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [difficultyFilter, setDifficultyFilter] = useState("All")

  useEffect(() => {
    setSearchTerm(searchParams.get("query") ?? "")
  }, [searchParams])

  const filteredExperiments = useMemo(() => {
    return experiments.filter((experiment) => {
      const matchesSearch =
        experiment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experiment.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "All" || experiment.category === categoryFilter
      const matchesDifficulty = difficultyFilter === "All" || experiment.difficulty === difficultyFilter

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [experiments, searchTerm, categoryFilter, difficultyFilter])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl">Interactive Experiments</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Advanced control systems experiments with comprehensive lab manuals. Each experiment includes theoretical
            background and practical implementation guides.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search experiments..."
              className="pl-10"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Start Circuit Builder */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-xl">Circuit Builder</CardTitle>
                <CardDescription>
                  Start building your own circuits from scratch with our interactive circuit builder
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/experiments/circuit-builder">
                  <Play className="mr-2 h-4 w-4" />
                  Open Builder
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Experiments Grid */}
        {isLoading ? (
          <Card className="col-span-full">
            <CardContent className="p-12 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Loading experiments...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No experiments match your search. Try adjusting your filters.
                </CardContent>
              </Card>
            )}
          {filteredExperiments.map((experiment) => (
            <Card key={experiment.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={experiment.image || "/placeholder.svg"}
                  alt={experiment.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="destructive">{experiment.difficulty}</Badge>
                  <Badge variant="outline">{experiment.category}</Badge>
                </div>
                <CardTitle className="font-heading">{experiment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-pretty">{experiment.description}</CardDescription>

                {/* Lab Manual Download */}
                {experiment.hasLabManual && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    {experiment.pdf_url ? (
                      <a
                        href={experiment.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>View Lab Manual</span>
                        <Download className="h-4 w-4 ml-auto" />
                      </a>
                    ) : (
                      <Link
                        href={`/lab-manuals/${experiment.manualId}`}
                        className="flex items-center gap-2 w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>View Lab Manual</span>
                        <Download className="h-4 w-4 ml-auto" />
                      </Link>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {experiment.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {experiment.participants.toLocaleString()}
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/experiments/${experiment.id}`}>Start Experiment</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}
