import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Zap, Users, Award, ArrowRight, Wrench, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredPDFs = [
    {
      id: "system-modeling",
      title: "System Modeling and Analysis",
      description: "Comprehensive lab manual for modeling and analyzing second-order RC circuits using Simulink and STM32 microcontroller.",
      category: "Control Systems",
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
    },
    {
      id: "dc-motor-modeling",
      title: "First and Second Order Modeling of DC Motor",
      description: "Lab manual for transient performance analysis of DC motor speed control circuits and transfer function identification.",
      category: "Control Systems",
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
    },
    {
      id: "stability-analysis",
      title: "Stability Analysis of Closed-Loop DC Motor",
      description: "Lab manual for evaluating closed-loop DC motor performance using Gain and Phase Margin analysis.",
      category: "Control Systems",
      image: "/virtual-circuit-board-with-electronic-components-a.jpg",
    },
  ]

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Interactive Circuit Builder",
      description: "Drag and drop components to build real circuits with instant feedback",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaborative Learning",
      description: "Share circuits and learn from a community of students and educators",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with achievements and skill assessments",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-12 lg:pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Interactive Learning Platform
                </Badge>
                <h1 className="font-heading font-bold text-4xl lg:text-6xl text-balance">
                  Master Electrical Engineering Through
                  <span className="text-primary"> Virtual Experiments</span>
                </h1>
                <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                  Build, simulate, and understand electrical circuits in our interactive virtual lab. Perfect for
                  students, educators, and anyone curious about electronics.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/circuit-lab">
                    <Wrench className="mr-2 h-4 w-4" />
                    Open Circuit Lab
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/experiments">
                    Start Experimenting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                <img
                  src="/virtual-circuit-board-with-electronic-components-a.jpg"
                  alt="Virtual Circuit Board"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circuit Lab Highlight Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="default" className="w-fit">
                  <Wrench className="mr-1 h-3 w-3" />
                  New Feature
                </Badge>
                <h2 className="font-heading font-bold text-3xl lg:text-4xl text-balance">
                  Circuit Lab: Your Virtual Playground
                </h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  Experiment freely with our advanced circuit simulator powered by CircuitJS1. Build any circuit you can
                  imagine, save your designs, and share them with others. Perfect for creative exploration and testing
                  new ideas.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Real-time Simulation</div>
                    <div className="text-xs text-muted-foreground">CircuitJS1 Integration</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Save & Share</div>
                    <div className="text-xs text-muted-foreground">Cloud Storage</div>
                  </div>
                </div>
              </div>

              <Button size="lg" asChild>
                <Link href="/circuit-lab">
                  <Wrench className="mr-2 h-4 w-4" />
                  Try Circuit Lab Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="p-6">
                <div className="aspect-video bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Wrench className="h-12 w-12 text-primary mx-auto" />
                    <div className="font-medium">Interactive Circuit Builder</div>
                    <div className="text-sm text-muted-foreground">Drag, drop, and simulate</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-20 pb-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-balance">
              Why Choose CSE LAB?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Experience hands-on learning without the need for physical components or lab equipment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lab Manuals */}
      <section className="pt-4 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-3xl lg:text-4xl">Featured Lab Manuals</h2>
              <p className="text-muted-foreground">Download comprehensive PDF guides for advanced control systems experiments</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/experiments">
                View All Experiments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPDFs.map((pdf, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow flex flex-col">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={pdf.image || "/placeholder.svg"}
                    alt={pdf.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{pdf.category}</Badge>
                  </div>
                  <CardTitle className="font-heading">{pdf.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <CardDescription className="text-pretty mb-4 flex-1">{pdf.description}</CardDescription>
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/lab-manuals/${pdf.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View PDF
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/lab-manuals/${pdf.id}`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-balance">
              Ready to Start Your Electrical Engineering Journey?
            </h2>
            <p className="text-lg opacity-90 text-pretty">
              Join thousands of students and educators who are already learning with our interactive platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/circuit-lab">
                  <Wrench className="mr-2 h-4 w-4" />
                  Try Circuit Lab
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/experiments">
                  Explore Experiments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
