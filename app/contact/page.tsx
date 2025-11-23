import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, HelpCircle, Users, Zap } from "lucide-react"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help with technical issues or general inquiries",
      contact: "aryan80079@gmail.com",
      availability: "24/7 response within 24 hours",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our education specialists",
      contact: "8087390944",
      availability: "Mon-Fri, 9 AM - 5 PM EST",
    },
  ]

  const supportCategories = [
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "General Support",
      description: "Account issues, billing questions, and platform navigation help",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Technical Support",
      description: "Circuit simulation issues, browser compatibility, and performance problems",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Educational Partnerships",
      description: "Institutional licensing, curriculum integration, and bulk accounts",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center space-y-6 mb-16">
          <Badge className="mx-auto w-fit">Contact Us</Badge>
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-balance">We're Here to Help</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Have questions about our platform? Need technical support? Want to explore educational partnerships? We'd
            love to hear from you and help you succeed.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Get in Touch</CardTitle>
                <CardDescription>Choose the method that works best for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {method.icon}
                      </div>
                      <h4 className="font-medium">{method.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">{method.description}</p>
                    <p className="text-sm font-medium ml-10">{method.contact}</p>
                    <p className="text-xs text-muted-foreground ml-10">{method.availability}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Our Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">CSE LAB</p>
                    <p className="text-sm text-muted-foreground">
                      Near CP-1, LNMIIT, Jaipur, Rajasthan, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Meeting Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                      <br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">Support Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {category.icon}
                      </div>
                      <h4 className="font-medium">{category.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">{category.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Quick answers to common questions about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">How do I get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simply visit our experiments section and start with beginner-level circuits. No account required to
                  try basic experiments, but creating an account lets you save progress and access advanced features.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Is the platform free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We offer both free and premium tiers. Basic experiments are free, while advanced
                  simulations and personalized learning paths require a subscription.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Can I use this for my classroom?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We offer educational licenses for schools and universities. Contact us to discuss bulk pricing and
                  curriculum integration options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">What browsers are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our platform works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend
                  keeping your browser updated for the best experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
