import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Lightbulb, Award, BookOpen, Zap, Globe, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const teamMember = {
    name: "Dr. Bharat Verma",
    role: "Faculty Mentor & Lead Educator",
    bio: "Dr Bharat Verma received a BTech degree in electronics and instrumentation engineering from Gautam Buddh Technical University, Lucknow, India, in 2010, the M.E. degree in measurement and control from the Madhav Institute of Technology and Science, Gwalior, India, in 2015, and the PhD degree in Control System Engineering from the Pandit Dwarka Prasad Mishra Indian Institute of Information Technology Design and Manufacturing (PDPM IIITDM), Jabalpur, India, in 2019. He is currently an assistant professor with the Electronics and Communication Department at the LNM Institute of Information Technology, Jaipur India. His research interests include indirect design approach, optimal control, intelligent control, proportional-integral-derivative controller, and biomedical signal processing.",
    image: "/bharat-verma.jpg",
  }

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Accessibility",
      description:
        "Making electrical engineering education accessible to students worldwide, regardless of their access to physical lab equipment.",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description:
        "Leveraging cutting-edge technology to create immersive, interactive learning experiences that engage and inspire.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Quality",
      description:
        "Maintaining the highest standards in educational content, ensuring accuracy, clarity, and pedagogical effectiveness.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description:
        "Striving for excellence in every aspect of our platform, from user experience to educational outcomes.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-16">
          <Badge className="mx-auto w-fit">About CSE LAB</Badge>
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-balance">
            Revolutionizing Electrical Engineering Education
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            We believe that every student should have access to high-quality electrical engineering education,
            regardless of their location or resources. Our virtual lab platform makes this vision a reality.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-3xl lg:text-4xl">Our Mission</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                To democratize electrical engineering education by providing interactive, accessible, and comprehensive
                virtual laboratory experiences that prepare students for real-world challenges.
              </p>
              <p className="text-muted-foreground text-pretty">
                Founded in 2020 by a team of educators and engineers, CSE LAB was born from the
                recognition that traditional laboratory access was a significant barrier to quality electrical
                engineering education. We set out to create a platform that would give every student the opportunity to
                experiment, learn, and grow.
              </p>
              <Button asChild>
                <Link href="/experiments">Explore Our Platform</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex items-center justify-center">
                <Image
                  src="/virtual-circuit-board-with-electronic-components-a.jpg"
                  alt="Students learning with virtual lab"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* NO STATS SECTION - REMOVED */}

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              The principles that guide everything we do and shape our approach to education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="font-heading">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Meet Our Faculty Mentor</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Passionate educator dedicated to transforming electrical engineering education
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="max-w-md">
              <CardContent className="p-6 text-center">
                <div className="aspect-square rounded-full bg-muted mb-4 overflow-hidden max-w-[200px] mx-auto">
                  <Image
                    src={teamMember.image}
                    alt={teamMember.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-xl mb-1">{teamMember.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{teamMember.role}</p>
                <p className="text-sm text-muted-foreground text-pretty">{teamMember.bio}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Comprehensive features designed to enhance your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Interactive Simulations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time circuit simulations with accurate electrical behavior and instant feedback on your designs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Comprehensive Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From basic concepts to advanced topics, our curriculum covers all essential electrical engineering
                  principles.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Expert Instruction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn from experienced educators and industry professionals with decades of combined expertise.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Personalized Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Adaptive learning paths that adjust to your pace and learning style for optimal educational outcomes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Global Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access our platform anywhere, anytime, with no need for physical laboratory equipment or facilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Industry Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Trusted by universities and institutions worldwide for delivering high-quality electrical engineering
                  education.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-16 bg-muted/30 rounded-2xl">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-balance">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of students and educators who are already transforming their understanding of electrical
            engineering
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/experiments">Start Experimenting</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}