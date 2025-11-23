"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react"

interface Chapter {
  title: string
  timestamp: string
}

interface VideoPlayerProps {
  videoUrl: string
  thumbnail: string
  title: string
  chapters: Chapter[]
}

export function VideoPlayer({ videoUrl, thumbnail, title, chapters }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control the actual video
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {/* Video Thumbnail/Player */}
        <div className="absolute inset-0">
          <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button size="lg" className="w-16 h-16 rounded-full" onClick={handlePlayPause}>
                <Play className="w-6 h-6 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Video Controls */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              {/* Progress Bar */}
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="h-full w-1/3 bg-primary rounded-full"></div>
              </div>

              <div className="text-white text-sm">4:32 / 12:34</div>

              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Volume2 className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Chapter Markers */}
        <div className="absolute bottom-16 left-4 right-4">
          <div className="flex gap-1">
            {chapters.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full cursor-pointer hover:bg-white/50" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
