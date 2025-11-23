"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from 'lucide-react'
import { useState } from "react"

export default function AdminFilters() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>
      {showFilters && (
        <div className="flex gap-2">
          <Input placeholder="Search by name or email..." className="max-w-xs" />
        </div>
      )}
    </div>
  )
}
