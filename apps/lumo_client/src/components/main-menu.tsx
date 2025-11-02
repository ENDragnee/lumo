"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from 'lucide-react'
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

const courses = [
  {
    title: "Physics",
    chapters: [
      {
        title: "Chapter 1",
        subChapters: [
          { title: "1.1", href: "/physics/chapter1/1_1" },
          { title: "1.2", href: "/physics/chapter1/1_2" },
          { title: "1.3", href: "/physics/chapter1/1_3" },
        ],
      },
      {
        title: "Chapter 2",
        subChapters: [
          { title: "2.1", href: "/physics/chapter2/2_1" },
          { title: "2.2", href: "/physics/chapter2/2_2" },
          { title: "2.3", href: "/physics/chapter2/2_3" },
          { title: "2.4", href: "/physics/chapter2/2_4" },
          { title: "2.5", href: "/physics/chapter2/2_5" },
        ],
      },
      {
        title: "Chapter 3",
        subChapters: [
          { title: "3.1", href: "/physics/chapter3/3_1" },
          { title: "3.2", href: "/physics/chapter3/3_2" },
          { title: "3.3", href: "/physics/chapter3/3_3" },
          { title: "3.4", href: "/physics/chapter3/3_4" },
          { title: "3.5", href: "/physics/chapter3/3_5" },
        ],
      },
      {
        title: "Chapter 4",
        subChapters: [
          { title: "4.1", href: "/physics/chapter4/4_1" },
          { title: "4.2", href: "/physics/chapter4/4_2" },
          { title: "4.3", href: "/physics/chapter4/4_3" },
          { title: "4.4", href: "/physics/chapter4/4_4" },
          { title: "4.5", href: "/physics/chapter4/4_5" },
          { title: "4.6", href: "/physics/chapter4/4_6" },
          { title: "4.7", href: "/physics/chapter4/4_7" },
        ],
      },
      {
        title: "Chapter 5",
        subChapters: [
          { title: "5.1", href: "/physics/chapter5/5_1" },
          { title: "5.2", href: "/physics/chapter5/5_2" },
          { title: "5.3", href: "/physics/chapter5/5_3" },
          { title: "5.4", href: "/physics/chapter5/5_4" },
          { title: "5.5", href: "/physics/chapter5/5_5" },
          { title: "5.6", href: "/physics/chapter5/5_6" },
          { title: "5.7", href: "/physics/chapter5/5_7" },
        ],
      },
    ],
  },
  // Example for another course like Chemistry
  {
    title: "Chemistry",
    chapters: [
      {
        title: "Chapter 1",
        subChapters: [
          { title: "1.1", href: "/chemistry/chapter1/1_1" },
          { title: "1.2", href: "/chemistry/chapter1/1_2" },
          { title: "1.3", href: "/chemistry/chapter1/1_3" },
          { title: "1.4", href: "/chemistry/chapter1/1_4" },
          { title: "1.5", href: "/chemistry/chapter1/1_5" },
        ],
      },
      {
        title: "Chapter 2",
        subChapters: [
          { title: "2.1", href: "/chemistry/chapter2/2_1" },
          { title: "2.2", href: "/chemistry/chapter2/2_2" },
          { title: "2.3", href: "/chemistry/chapter2/2_3" },
          { title: "2.4", href: "/chemistry/chapter2/2_4" },
          { title: "2.5", href: "/chemistry/chapter2/2_5" },
        ],
      },
      {
        title: "Chapter 3",
        subChapters: [
          { title: "3.1", href: "/chemistry/chapter3/3_1" },
          { title: "3.2", href: "/chemistry/chapter3/3_2" },
          { title: "3.3", href: "/chemistry/chapter3/3_3" },
          { title: "3.4", href: "/chemistry/chapter3/3_4" },
        ],
      },
      {
        title: "Chapter 4",
        subChapters: [
          { title: "4.1", href: "/chemistry/chapter4/4_1" },
          { title: "4.2", href: "/chemistry/chapter4/4_2" },
          { title: "4.3", href: "/chemistry/chapter4/4_3" },
        ],
      },
      {
        title: "Chapter 5",
        subChapters: [
          { title: "5.1", href: "/chemistry/chapter5/5_1" },
          { title: "5.2", href: "/chemistry/chapter5/5_2" },
          { title: "5.3", href: "/chemistry/chapter5/5_3" },
          { title: "5.4", href: "/chemistry/chapter5/5_4" },
        ],
      },
    ],
  },
]

export function MainMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[50vh] overflow-y-auto p-2 bg-white dark:bg-gray-800 text-black dark:text-white">
        {courses.map((course, index) => (
          <DropdownMenuSub key={index}>
            <DropdownMenuSubTrigger>
              {course.title}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-[40vh] overflow-y-auto bg-white dark:bg-gray-800 text-black dark:text-white">
              {course.chapters.map((chapter, chapterIndex) => (
                <React.Fragment key={chapterIndex}>
                  <DropdownMenuItem asChild>
                    <Link href={`#${chapter.title.toLowerCase().replace(" ", "")}`}>
                      {chapter.title}
                    </Link>
                  </DropdownMenuItem>
                  {chapter.subChapters.map((subChapter, subIndex) => (
                    <DropdownMenuItem key={subIndex} asChild>
                      <Link href={subChapter.href}>
                        {subChapter.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </React.Fragment>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        <DropdownMenuItem asChild>
          <Link href="/flashcards">Flash Cards</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/quiz">Quiz</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

