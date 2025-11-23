import { Navigation } from "@/components/navigation"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Eye, Star, ThumbsUp, Share, BookOpen, ChevronRight, Play } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// This would typically come from a database
const getTutorial = (id: string) => {
  const tutorials = {
    "ohms-law-basics": {
      id: "ohms-law-basics",
      title: "Understanding Ohm's Law",
      description: "Learn the fundamental relationship between voltage, current, and resistance in electrical circuits",
      duration: "12:34",
      views: 15420,
      rating: 4.8,
      likes: 1240,
      category: "Fundamentals",
      tags: ["Ohm's Law", "Voltage", "Current", "Resistance"],
      level: "Beginner",
      thumbnail: "/ohms-law-tutorial-thumbnail.jpg",
      instructor: "Dr. Sarah Chen",
      videoUrl: "https://example.com/video.mp4", // Placeholder URL
      transcript: `
Welcome to this tutorial on Ohm's Law, one of the most fundamental principles in electrical engineering.

Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points.

The mathematical relationship is expressed as: V = I × R

Where:
- V is the voltage in volts
- I is the current in amperes  
- R is the resistance in ohms

Let's explore each component and see how they relate to each other...
      `,
      chapters: [
        { title: "Introduction to Ohm's Law", timestamp: "0:00" },
        { title: "Understanding Voltage", timestamp: "2:15" },
        { title: "Current Flow Explained", timestamp: "4:30" },
        { title: "Resistance in Circuits", timestamp: "7:45" },
        { title: "Practical Applications", timestamp: "10:20" },
      ],
      relatedExperiments: [
        { id: "ohms-law", title: "Ohm's Law Circuit", type: "experiment" },
        { id: "voltage-divider", title: "Voltage Divider Circuit", type: "experiment" },
      ],
      nextTutorial: {
        id: "series-parallel-explained",
        title: "Series vs Parallel Circuits Explained",
      },
    },
  }

  return tutorials[id as keyof typeof tutorials] || null
}

export default function TutorialPage({ params }: { params: { id: string } }) {
  const tutorial = getTutorial(params.id)

  if (!tutorial) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              videoUrl={tutorial.videoUrl}
              thumbnail={tutorial.thumbnail}
              title={tutorial.title}
              chapters={tutorial.chapters}
            />

            {/* Tutorial Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="font-heading font-bold text-2xl lg:text-3xl text-balance">{tutorial.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {tutorial.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {tutorial.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {tutorial.rating} ({tutorial.likes} likes)
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
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
                {tutorial.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground text-pretty">{tutorial.description}</p>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Instructor:</span>
                <span className="text-muted-foreground">{tutorial.instructor}</span>
              </div>
            </div>

            <Separator />

            {/* Tabs for additional content */}
            <Tabs defaultValue="transcript" className="w-full">
              <TabsList>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="transcript" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Video Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
                        {tutorial.transcript}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="chapters" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Video Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tutorial.chapters.map((chapter, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                        >
                          <span className="text-sm">{chapter.title}</span>
                          <span className="text-xs text-muted-foreground">{chapter.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Additional Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Related Experiments</h4>
                        <div className="space-y-2">
                          {tutorial.relatedExperiments.map((experiment) => (
                            <Link
                              key={experiment.id}
                              href={`/experiments/${experiment.id}`}
                              className="flex items-center gap-2 p-2 rounded border hover:bg-muted/50 transition-colors"
                            >
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span className="text-sm">{experiment.title}</span>
                              <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Tutorial */}
            {tutorial.nextTutorial && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Up Next</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/tutorials/${tutorial.nextTutorial.id}`} className="block group">
                    <div className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {tutorial.nextTutorial.title}
                      </h4>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/experiments/circuit-builder">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Try Circuit Builder
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/tutorials">Browse All Tutorials</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
