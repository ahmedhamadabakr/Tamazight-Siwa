import { Card, CardContent } from "@/components/ui/card"
import { Hotel, Car, Utensils, Compass } from "lucide-react"

const services = [
  {
    icon: Hotel,
    title: "Hotels",
    description: "Comfortable accommodations ranging from eco-lodges to luxury desert camps",
  },
  {
    icon: Car,
    title: "Transportation",
    description: "Safe and reliable transport services with experienced local drivers",
  },
  {
    icon: Utensils,
    title: "Restaurant",
    description: "Authentic Siwan cuisine featuring traditional dishes and local ingredients",
  },
  {
    icon: Compass,
    title: "Desert Safari Tour",
    description: "Guided adventures through the Great Sand Sea with sandboarding and camping",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive travel services designed to make your Siwa experience seamless, comfortable, and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group text-center hover:shadow-xl transition-all duration-300 border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-balance">{service.title}</h3>
                <p className="text-muted-foreground text-pretty">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
