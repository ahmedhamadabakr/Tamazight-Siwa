"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [sourcesLoaded, setSourcesLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (!sourcesLoaded) {
      setSourcesLoaded(true)
      // defer actual play to next tick after sources mount
      setTimeout(() => {
        el.play().catch(() => {/* ignore */})
        setIsPlaying(true)
      }, 0)
      return
    }
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      el.play().catch(() => {/* ignore */})
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    if (!secs || !isFinite(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Seek handler
  const handleSeek = (e: any) => {
    if (!videoRef.current) return
    const t = parseFloat(e.target.value)
    videoRef.current.currentTime = t
    setCurrentTime(t)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-secondary/10 rounded-full px-6 py-2 mb-4">
            <span className="text-secondary font-medium">🎥 Watch the Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Live the Experience Before You Start
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Watch real moments from our visitors' journeys and discover what awaits you in the magical Siwa Oasis
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-black">
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              muted={isMuted}
              loop
              playsInline
              preload="none"
              poster="/siwa-oasis-photography-golden-hour-palm-trees.jpg"
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            >
              <track kind="captions" src="/captions-en.vtt" srcLang="en" label="English captions" default />
              {sourcesLoaded && (
                <>
                  <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.15.44_a55f796c.mp4" type="video/mp4" />
                  <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.16.53_71a463c0.mp4" type="video/mp4" />
                </>
              )}
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full w-16 h-16 p-0"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
                <Button
                  size="sm"
                  onClick={toggleMute}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full w-12 h-12 p-0"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Slim progress bar + time */}
            <div className="absolute left-0 right-0 bottom-0">
              <div className="relative h-1.5 bg-white/20">
                <div
                  className="absolute left-0 top-0 h-full bg-primary"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Seek video"
                />
              </div>
              <div className="absolute -top-7 right-3 text-white/90 text-xs font-mono bg-black/40 rounded px-2 py-0.5">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Journey to the Heart of the Desert</h3>
                    <p className="text-sm opacity-80">Real experience from one of our visitors</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Video Duration</div>
                    <div className="font-medium">2:30 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Are You Ready for Adventure?</h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of visitors who have experienced an unforgettable journey in Siwa Oasis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours" passHref>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full">
                  Book Your Trip Now
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button size="lg" variant="outline" className="border-2 px-8 py-4 rounded-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}