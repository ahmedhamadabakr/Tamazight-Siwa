import type React from "react";
export const dynamic = "force-static";
import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Leaf, Award, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { MotionDiv, MotionH1, MotionP } from "@/components/Motion";
import Link from "next/link";

// ♻️ Reusable Value Card
function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <Card className="text-center border-0 shadow-lg h-full group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-background/50 backdrop-blur-sm">
        <CardContent className="p-8 h-full flex flex-col">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-foreground">{title}</h3>
          <p className="text-muted-foreground flex-grow">{description}</p>
          <div className="mt-6 h-1 w-12 bg-primary/20 mx-auto group-hover:w-20 transition-all duration-300"></div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

// ♻️ Reusable Team Card
function TeamCard({
  icon: Icon,
  name,
  role,
  bio,
}: {
  icon: React.ElementType;
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="text-center border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-primary mb-4">{role}</p>
          <p className="text-muted-foreground">{bio}</p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-background">
      <ClientOnlyNavigation />
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
        <MotionDiv 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeInOut" }}
        >
          <Image
            src="/siwa-oasis-sunset-salt-lakes-reflection.jpg"
            alt="Siwa Oasis landscape with palm trees and desert"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="empty"
          />
        </MotionDiv>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-background/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20">
              Since 2010
            </span>
          </MotionDiv>
          <MotionH1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Discover the Heart of Siwa
          </MotionH1>
          <MotionP
            className="text-xl md:text-2xl text-balance max-w-3xl mx-auto text-black/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Where ancient traditions meet sustainable adventures in Egypt's most magical oasis
          </MotionP>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <a 
              href="#our-story" 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/50 hover:border-white transition-colors group"
              aria-label="Scroll to Our Story"
            >
              <span className="block w-2 h-4 border-r-2 border-b-2 border-white transform rotate-45 translate-y-1/4 group-hover:translate-y-1/2 transition-transform"></span>
            </a>
          </MotionDiv>
        </div>
      </section>
      <section id="our-story" className="py-24 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="relative z-10">
              <span className="inline-block text-sm font-medium text-primary mb-3">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                The Soul of Siwa,<br /><span className="text-primary">Our Story</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Tamazight Siwa was born from a deep love for the mystical Siwa Oasis and its rich Amazigh heritage. 
                  Founded by local guides who grew up among the palm groves and salt lakes, we are dedicated to 
                  sharing the authentic beauty of our homeland while preserving its cultural integrity.
                </p>
                <p>
                  Our name "Tamazight" honors the ancient Berber language still spoken in Siwa, connecting visitors 
                  to thousands of years of desert wisdom and tradition. Every experience we offer is crafted to 
                  respect both our environment and our ancestors' legacy.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
<Link
  href="/tours"
  className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
>
  <span className="absolute inset-0 bg-gradient-to-r from-primary/70 to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
  <span className="relative z-10 flex items-center gap-2">
    Explore Our Tours
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </span>
</Link>

<Link
  href="/contact"
  className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold rounded-xl border-2 border-white text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
>
  <span className="relative z-10 flex items-center gap-2">
    Contact Us
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4m0 0l-4 4m4-4h18" />
    </svg>
  </span>
</Link>

              </div>
            </div>
          </MotionDiv>
          
          <MotionDiv
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=500&fit=crop"
                alt="Traditional Siwa mud-brick architecture"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-1/3 h-1/3 bg-primary/10 rounded-2xl border-2 border-white shadow-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 w-1/4 h-1/4 bg-accent/10 rounded-full border-2 border-white shadow-lg -z-10"></div>
          </MotionDiv>
        </div>
      </section>
      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every journey with us is guided by principles that honor both our
              guests and our homeland
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={Leaf}
              title="Sustainability"
              description="Protecting Siwa's fragile ecosystem through responsible tourism practices"
            />
            <ValueCard
              icon={Heart}
              title="Authenticity"
              description="Genuine experiences that connect you with real Siwan culture and traditions"
            />
            <ValueCard
              icon={Users}
              title="Community"
              description="Supporting local families and preserving traditional livelihoods"
            />
            <ValueCard
              icon={Award}
              title="Excellence"
              description="Delivering unforgettable experiences with attention to every detail"
            />
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Local experts passionate about sharing the magic of Siwa Oasis
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamCard
              icon={Users}
              name="Ahmed Al-Siwi"
              role="Founder & Head Guide"
              bio="Born and raised in Siwa, Ahmed has been sharing the oasis's secrets with travelers for over 15 years."
            />
            <TeamCard
              icon={MapPin}
              name="Fatima Amazigh"
              role="Cultural Specialist"
              bio="A keeper of Siwan traditions, Fatima ensures every cultural experience is authentic and respectful."
            />
            <TeamCard
              icon={Clock}
              name="Omar Desert"
              role="Adventure Coordinator"
              bio="An expert in desert navigation and safety, Omar leads our most adventurous expeditions."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
