import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Leaf, Award, MapPin, Clock } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        <Image src="/siwa-oasis-palm-trees-desert-landscape.jpg" alt="Siwa Oasis landscape" fill className="object-cover" priority />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">About Tamazight Siwa</h1>
          <p className="text-xl md:text-2xl text-balance">
            Preserving the authentic spirit of Siwa Oasis through sustainable tourism
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Tamazight Siwa was born from a deep love for the mystical Siwa Oasis and its rich Amazigh heritage.
                Founded by local guides who grew up among the palm groves and salt lakes, we are dedicated to sharing
                the authentic beauty of our homeland while preserving its cultural integrity.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our name "Tamazight" honors the ancient Berber language still spoken in Siwa, connecting visitors to
                thousands of years of desert wisdom and tradition. Every experience we offer is crafted to respect both
                our environment and our ancestors' legacy.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Learn More About Siwa
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/traditional-siwa-architecture-mud-brick-buildings.jpg"
                alt="Traditional Siwa architecture"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every journey with us is guided by principles that honor both our guests and our homeland
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sustainability</h3>
                <p className="text-muted-foreground">
                  Protecting Siwa's fragile ecosystem through responsible tourism practices
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Authenticity</h3>
                <p className="text-muted-foreground">
                  Genuine experiences that connect you with real Siwan culture and traditions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-muted-foreground">
                  Supporting local families and preserving traditional livelihoods
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-muted-foreground">
                  Delivering unforgettable experiences with attention to every detail
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Local experts passionate about sharing the magic of Siwa Oasis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ahmed Al-Siwi</h3>
                <p className="text-primary mb-4">Founder & Head Guide</p>
                <p className="text-muted-foreground">
                  Born and raised in Siwa, Ahmed has been sharing the oasis's secrets with travelers for over 15 years.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fatima Amazigh</h3>
                <p className="text-primary mb-4">Cultural Specialist</p>
                <p className="text-muted-foreground">
                  A keeper of Siwan traditions, Fatima ensures every cultural experience is authentic and respectful.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Omar Desert</h3>
                <p className="text-primary mb-4">Adventure Coordinator</p>
                <p className="text-muted-foreground">
                  An expert in desert navigation and safety, Omar leads our most adventurous expeditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Siwa?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us for an authentic journey through one of Egypt's most magical destinations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              View Our Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
