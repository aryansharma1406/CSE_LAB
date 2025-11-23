"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ExperimentProgressProps {
  experimentId: string
  totalSteps: number
}

export function ExperimentProgress({ experimentId, totalSteps }: ExperimentProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadProgress()
  }, [experimentId])

  const loadProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Use localStorage for unauthenticated users
        const localProgress = localStorage.getItem(`experiment_progress_${experimentId}`)
        if (localProgress) {
          const parsed = JSON.parse(localProgress)
          const completedCount = parsed.completedSteps?.length || 0
          const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0
          setProgress(progressPercent)
          setIsStarted(completedCount > 0)
          setIsCompleted(parsed.isCompleted || false)
        }
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/progress?experiment_id=${experimentId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.progress && data.progress.length > 0) {
          const userProgress = data.progress[0]
          const completedSteps = userProgress.completed_steps || []
          const progressPercent = Math.round((completedSteps.length / totalSteps) * 100)
          
          setProgress(progressPercent)
          setIsStarted(completedSteps.length > 0)
          setIsCompleted(userProgress.is_completed || false)
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error)
      // Fallback to localStorage on error
      const localProgress = localStorage.getItem(`experiment_progress_${experimentId}`)
      if (localProgress) {
        const parsed = JSON.parse(localProgress)
        const completedCount = parsed.completedSteps?.length || 0
        const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0
        setProgress(progressPercent)
        setIsStarted(completedCount > 0)
        setIsCompleted(parsed.isCompleted || false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const startExperiment = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Use localStorage for unauthenticated users
        localStorage.setItem(
          `experiment_progress_${experimentId}`,
          JSON.stringify({
            completedSteps: [],
            isCompleted: false,
            startedAt: new Date().toISOString(),
          })
        )
        setIsStarted(true)
        setProgress(0)
        toast({
          title: "Experiment started!",
          description: "Your progress will be tracked locally. Sign in to sync across devices.",
        })
        return
      }

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experiment_id: experimentId,
          completed_steps: [],
          is_completed: false,
        }),
      })

      if (response.ok) {
        setIsStarted(true)
        setProgress(0)
        toast({
          title: "Experiment started!",
          description: "Your progress will be tracked as you complete steps.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to start experiment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error starting experiment:", error)
      // Fallback to localStorage on error
      localStorage.setItem(
        `experiment_progress_${experimentId}`,
        JSON.stringify({
          completedSteps: [],
          isCompleted: false,
          startedAt: new Date().toISOString(),
        })
      )
      setIsStarted(true)
      setProgress(0)
      toast({
        title: "Experiment started!",
        description: "Your progress will be tracked locally.",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={0} className="w-full" />
            <div className="text-sm text-muted-foreground">Loading...</div>
            <Button className="w-full" disabled>
              <Play className="mr-2 h-4 w-4" />
              Start Experiment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            {isCompleted ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                {progress}% Complete - Experiment Finished!
              </span>
            ) : (
              `${progress}% Complete`
            )}
          </div>
          {!isStarted ? (
            <Button className="w-full" onClick={startExperiment}>
              <Play className="mr-2 h-4 w-4" />
              Start Experiment
            </Button>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              {isCompleted ? "Experiment Completed" : "In Progress"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

