"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Leaf, Award, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="text-center border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
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
    <motion.div
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
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        <Image
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop"
          alt="Siwa Oasis landscape with palm trees and desert"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Tamazight Siwa
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Preserving the authentic spirit of Siwa Oasis through sustainable
            tourism
          </motion.p>
        </div>
      </section>
      <section className="py-20 px-4">
        {" "}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {" "}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {" "}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {" "}
              Our Story{" "}
            </h2>{" "}
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {" "}
              Tamazight Siwa was born from a deep love for the mystical Siwa
              Oasis and its rich Amazigh heritage. Founded by local guides who
              grew up among the palm groves and salt lakes, we are dedicated to
              sharing the authentic beauty of our homeland while preserving its
              cultural integrity.{" "}
            </p>{" "}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {" "}
              Our name "Tamazight" honors the ancient Berber language still
              spoken in Siwa, connecting visitors to thousands of years of
              desert wisdom and tradition. Every experience we offer is crafted
              to respect both our environment and our ancestors' legacy.{" "}
            </p>{" "}
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {" "}
              Learn More About Siwa{" "}
            </Button>{" "}
          </motion.div>{" "}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {" "}
            <Image
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=500&fit=crop"
              alt="Traditional Siwa mud-brick architecture"
              width={600}
              height={500}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              className="rounded-lg shadow-lg"
            />{" "}
          </motion.div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Values */}{" "}
      <section className="py-20 bg-muted/30">
        {" "}
        <div className="max-w-6xl mx-auto px-4">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {" "}
              Our Values{" "}
            </h2>{" "}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {" "}
              Every journey with us is guided by principles that honor both our
              guests and our homeland{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            <ValueCard
              icon={Leaf}
              title="Sustainability"
              description="Protecting Siwa's fragile ecosystem through responsible tourism practices"
            />{" "}
            <ValueCard
              icon={Heart}
              title="Authenticity"
              description="Genuine experiences that connect you with real Siwan culture and traditions"
            />{" "}
            <ValueCard
              icon={Users}
              title="Community"
              description="Supporting local families and preserving traditional livelihoods"
            />{" "}
            <ValueCard
              icon={Award}
              title="Excellence"
              description="Delivering unforgettable experiences with attention to every detail"
            />{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Team */}{" "}
      <section className="py-20 px-4">
        {" "}
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {" "}
              Meet Our Team{" "}
            </h2>{" "}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {" "}
              Local experts passionate about sharing the magic of Siwa Oasis{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid md:grid-cols-3 gap-8">
            {" "}
            <TeamCard
              icon={Users}
              name="Ahmed Al-Siwi"
              role="Founder & Head Guide"
              bio="Born and raised in Siwa, Ahmed has been sharing the oasis's secrets with travelers for over 15 years."
            />{" "}
            <TeamCard
              icon={MapPin}
              name="Fatima Amazigh"
              role="Cultural Specialist"
              bio="A keeper of Siwan traditions, Fatima ensures every cultural experience is authentic and respectful."
            />{" "}
            <TeamCard
              icon={Clock}
              name="Omar Desert"
              role="Adventure Coordinator"
              bio="An expert in desert navigation and safety, Omar leads our most adventurous expeditions."
            />{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* CTA */}{" "}
      <section className="py-20 bg-primary text-primary-foreground">
        {" "}
        <div className="max-w-4xl mx-auto text-center px-4">
          {" "}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {" "}
            Ready to Experience Siwa?{" "}
          </h2>{" "}
          <p className="text-xl mb-8 opacity-90">
            {" "}
            Join us for an authentic journey through one of Egypt&apos;s most
            magical destinations{" "}
          </p>{" "}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {" "}
            <Button
              size="lg"
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
            >
              {" "}
              View Our Tours{" "}
            </Button>{" "}
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              {" "}
              Contact Us{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
      </section>
      <Footer />
    </div>
  );
}
