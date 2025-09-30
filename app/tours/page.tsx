import { Metadata } from "next"
import ToursContent from "./ToursContent"

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Siwa Tours & Experiences | Tamazight Siwa",
  description:
    "Discover the magic of Siwa Oasis through our cultural, adventure, wellness, and photography tours. Authentic experiences crafted for every traveler.",
  openGraph: {
    title: "Siwa Tours & Experiences",
    description:
      "Explore carefully crafted Siwa tours: culture, adventure, wellness, photography, and more.",
    images: ["/siwa-oasis-tours-desert-adventure.jpg"],
  },
}

export default function ToursPage() {
  return <ToursContent />
}
