"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

export function MainMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Menu <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Chapters</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Link href="#chapter1">Chapter 1</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#chapter2">Chapter 2</Link>
            </DropdownMenuItem>
            {/* Add more chapters as needed */}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <Link href="/flashcards">Flash Cards</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/quiz">Quiz</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

