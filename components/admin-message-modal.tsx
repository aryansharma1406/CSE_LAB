"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Trash2 } from 'lucide-react'

export default function AdminMessageModal({ submission }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(submission.status)
  const [notes, setNotes] = useState(submission.response_notes || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/contact-submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, response_notes: notes }),
      })
      if (response.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this submission?")) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/contact-submissions/${submission.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setIsOpen(false)
          window.location.reload()
        }
      } catch (error) {
        console.error("Error deleting submission:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
          <DialogDescription>{new Date(submission.created_at).toLocaleString()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* From */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">From</p>
              <p className="text-gray-900">{submission.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <a href={`mailto:${submission.email}`} className="text-green-600 hover:underline">
                {submission.email}
              </a>
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="text-sm font-medium text-gray-600">Subject</p>
            <p className="text-gray-900">{submission.subject}</p>
          </div>

          {/* Category */}
          {submission.category && (
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <Badge>{submission.category}</Badge>
            </div>
          )}

          {/* Message */}
          <div>
            <p className="text-sm font-medium text-gray-600">Message</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-1">
              <p className="text-gray-900 whitespace-pre-wrap">{submission.message}</p>
            </div>
          </div>

          {/* Response Notes */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Response Notes</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your response..."
              className="min-h-24"
            />
          </div>

          {/* Status */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Status</p>
            <div className="flex gap-2">
              {["new", "read", "responded"].map((s) => (
                <Button
                  key={s}
                  variant={status === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate(s)}
                  disabled={isLoading}
                  className={status === s ? "bg-green-600" : ""}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm" className="ml-auto">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
