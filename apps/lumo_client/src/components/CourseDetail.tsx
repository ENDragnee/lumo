'use client';

import { useState } from 'react';
import { BookOpen, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { courseData, CourseData, CourseObject } from '@/app/hooks/courseData';
import { useRouter } from 'next/navigation';

interface CourseDetailProps {
  semester: string;
  stream: string;
  courseObject: CourseObject;
  onChapterSelect: (chapterId: string) => void;
}

export default function CourseDetail({
  courseObject,
  semester,
  stream
}: CourseDetailProps) {
  // In a real app, you would fetch this data based on the course ID
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const router = useRouter();

  const handleChapterClick = (chapterId: string) => {
    // In a real app, this would navigate to the chapter page
    setSelectedChapter(chapterId);
    console.log(`Navigating to chapter: ${chapterId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-[#c69323] text-white py-8 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
                <span>{courseObject.department || 'Department'}</span>
                {courseObject.year && (
                  <>
                    <span>•</span>
                    <span>{courseObject.year}</span>
                  </>
                )}
                {semester && (
                  <>
                    <span>•</span>
                    <span>{semester}</span>
                  </>
                )}
                {stream && (
                  <>
                    <span>•</span>
                    <span>{stream}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {courseObject.name}
              </h1>
              <p className="text-blue-100 max-w-2xl">
                {courseObject.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button className="bg-white text-[#c69323] hover:bg-blue-50" onClick={() => router.push(`${courseObject.path}`)}>
                Enroll in Course
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="flex-1 py-8 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Information</CardTitle>
                      <CardDescription>
                        Key details about this course
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <Users className="h-5 w-5 text-[#c69323] mt-0.5" />
                          <div>
                            <p className="font-medium">Instructor</p>
                            <p className="text-sm text-gray-500">
                              {courseObject.instructor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-[#c69323] mt-0.5" />
                          <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-sm text-gray-500">
                              {courseObject.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-5 w-5 text-[#c69323] mt-0.5" />
                          <div>
                            <p className="font-medium">Credits</p>
                            <p className="text-sm text-gray-500">
                              {courseObject.credits} credits
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-5 w-5 text-[#c69323] mt-0.5" />
                          <div>
                            <p className="font-medium">Students</p>
                            <p className="text-sm text-gray-500">
                              {courseObject.students} enrolled
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Prerequisites</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          {courseObject?.prerequisites?.map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Outcomes</CardTitle>
                      <CardDescription>
                        What you'll be able to do after completing this course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {courseObject?.outcomes?.map((outcome, index) => (
                          <li key={index} className="flex gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Chapters</CardTitle>
                      <CardDescription>
                        Course content breakdown
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                        <div className="divide-y">
                          {courseObject.chapters.map((chapter) => (
                            <button
                              key={chapter?.id}
                              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                              onClick={() => handleChapterClick(chapter.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-[#c69323]">
                                    {chapter.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {chapter.topics.length} topics •{' '}
                                    {chapter.duration}
                                  </p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(`${courseObject.chapters[0].path}`)}
                      >
                        Start Learning
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chapters">
              <Card>
                <CardHeader>
                  <CardTitle>Course Chapters</CardTitle>
                  <CardDescription>
                    Detailed breakdown of course content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {courseObject.chapters.map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div
                          className={`flex justify-between items-center p-4 cursor-pointer ${
                            selectedChapter === chapter.id
                              ? 'bg-blue-50'
                              : 'bg-white'
                          }`}
                          onClick={() => handleChapterClick(chapter.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-[#c69323] font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{chapter.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{chapter.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#c69323]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChapterClick(chapter.id);
                            }}
                          >
                            View Chapter
                          </Button>
                        </div>
                        {selectedChapter === chapter.id && (
                          <div className="p-4 bg-blue-50 border-t">
                            <h4 className="font-medium text-sm mb-2">
                              Topics Covered:
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {chapter.topics.map((topic, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm">Start Chapter</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Course Resources</CardTitle>
                  <CardDescription>
                    Additional materials to support your learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Lecture Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Comprehensive notes covering all topics discussed in
                          lectures.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Reference Materials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Supplementary readings and resources to deepen your
                          understanding.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm">
                          Browse
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Practice Exercises
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Additional problems and exercises to reinforce your
                          learning.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm">
                          Access
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Discussion Forum
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Engage with instructors and fellow students to discuss
                          course topics.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
