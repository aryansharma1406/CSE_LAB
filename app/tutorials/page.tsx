import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Clock, Eye, BookOpen, Star } from "lucide-react"
import Link from "next/link"

export default function TutorialsPage() {
  const tutorials = [
    {
      id: "ohms-law-basics",
      title: "Understanding Ohm's Law",
      description: "Learn the fundamental relationship between voltage, current, and resistance in electrical circuits",
      duration: "12:34",
      views: 15420,
      rating: 4.8,
      category: "Fundamentals",
      tags: ["Ohm's Law", "Voltage", "Current", "Resistance"],
      level: "Beginner",
      thumbnail: "/ohms-law-tutorial-thumbnail.jpg",
      instructor: "Dr. Sarah Chen",
    },
    {
      id: "series-parallel-explained",
      title: "Series vs Parallel Circuits Explained",
      description: "Comprehensive guide to understanding how components behave in series and parallel configurations",
      duration: "18:45",
      views: 12890,
      rating: 4.9,
      category: "Circuit Analysis",
      tags: ["Series Circuit", "Parallel Circuit", "Circuit Analysis"],
      level: "Beginner",
      thumbnail: "/series-parallel-tutorial-thumbnail.jpg",
      instructor: "Prof. Michael Rodriguez",
    },
    {
      id: "capacitor-fundamentals",
      title: "Capacitors: Storage and Discharge",
      description: "Deep dive into how capacitors store electrical energy and their behavior in AC and DC circuits",
      duration: "22:15",
      views: 9876,
      rating: 4.7,
      category: "Components",
      tags: ["Capacitors", "Energy Storage", "AC Circuits", "DC Circuits"],
      level: "Intermediate",
      thumbnail: "/capacitor-fundamentals-thumbnail.jpg",
      instructor: "Dr. Emily Watson",
    },
    {
      id: "transistor-basics",
      title: "Introduction to Transistors",
      description: "Learn how transistors work as switches and amplifiers in electronic circuits",
      duration: "25:30",
      views: 8543,
      rating: 4.6,
      category: "Semiconductors",
      tags: ["Transistors", "Amplifiers", "Switches", "BJT", "MOSFET"],
      level: "Intermediate",
      thumbnail: "/transistor-basics-thumbnail.jpg",
      instructor: "Dr. James Park",
    },
    {
      id: "ac-dc-analysis",
      title: "AC vs DC Circuit Analysis",
      description: "Understanding the differences between alternating and direct current circuits and analysis methods",
      duration: "19:20",
      views: 7234,
      rating: 4.8,
      category: "Circuit Analysis",
      tags: ["AC Analysis", "DC Analysis", "Phasors", "Frequency Response"],
      level: "Advanced",
      thumbnail: "/ac-dc-analysis-thumbnail.jpg",
      instructor: "Prof. Lisa Thompson",
    },
    {
      id: "digital-logic-gates",
      title: "Digital Logic Gates Fundamentals",
      description: "Introduction to digital logic gates and their role in digital electronics and computer systems",
      duration: "16:45",
      views: 11200,
      rating: 4.7,
      category: "Digital Electronics",
      tags: ["Logic Gates", "Boolean Algebra", "Digital Circuits"],
      level: "Intermediate",
      thumbnail: "/digital-logic-gates-thumbnail.jpg",
      instructor: "Dr. Robert Kim",
    },
  ]

  const categories = ["All", "Fundamentals", "Circuit Analysis", "Components", "Semiconductors", "Digital Electronics"]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const featuredTutorial = tutorials[0]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl">Video Tutorials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn electrical engineering concepts through our comprehensive video library. From basic principles to
            advanced topics, master electronics at your own pace.
          </p>
        </div>

        {/* Featured Tutorial */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-1">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={featuredTutorial.thumbnail || "/placeholder.svg"}
                    alt={featuredTutorial.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Badge className="w-fit">Featured Tutorial</Badge>
                  <h3 className="font-heading font-bold text-xl">{featuredTutorial.title}</h3>
                  <p className="text-muted-foreground">{featuredTutorial.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredTutorial.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {featuredTutorial.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {featuredTutorial.rating}
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/tutorials/${featuredTutorial.id}`}>
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tutorials..." className="pl-10" />
          </div>
          <div className="flex gap-4">
            <Select defaultValue="All">
              <SelectTrigger className="w-48">
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
            <Select defaultValue="All">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={tutorial.thumbnail || "/placeholder.svg"}
                  alt={tutorial.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/0 group-hover:bg-primary/90 flex items-center justify-center transition-all duration-300">
                    <Play className="w-5 h-5 text-transparent group-hover:text-primary-foreground ml-0.5 transition-colors duration-300" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {tutorial.duration}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      tutorial.level === "Beginner"
                        ? "secondary"
                        : tutorial.level === "Intermediate"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {tutorial.level}
                  </Badge>
                  <Badge variant="outline">{tutorial.category}</Badge>
                </div>
                <CardTitle className="font-heading text-lg line-clamp-2">{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty mb-4 line-clamp-2">{tutorial.description}</CardDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {tutorial.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {tutorial.rating}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Instructor:</span> {tutorial.instructor}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tutorial.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tutorial.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tutorial.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/tutorials/${tutorial.id}`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Watch Tutorial
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path Section */}
        <section className="mt-16">
          <div className="text-center space-y-4 mb-8">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl">Structured Learning Paths</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow our curated learning paths to master electrical engineering concepts step by step
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="font-heading">Beginner Path</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Start with basic electrical concepts and build your foundation
                </CardDescription>
                <div className="text-sm text-muted-foreground mb-4">8 tutorials • 2.5 hours</div>
                <Button variant="outline" className="w-full bg-transparent">
                  Start Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="font-heading">Circuit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Master circuit analysis techniques and problem-solving methods
                </CardDescription>
                <div className="text-sm text-muted-foreground mb-4">12 tutorials • 4 hours</div>
                <Button variant="outline" className="w-full bg-transparent">
                  Start Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="font-heading">Digital Electronics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Explore digital circuits, logic gates, and microcontroller basics
                </CardDescription>
                <div className="text-sm text-muted-foreground mb-4">15 tutorials • 5.5 hours</div>
                <Button variant="outline" className="w-full bg-transparent">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
