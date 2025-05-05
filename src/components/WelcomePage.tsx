import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, CheckCircle, MessageSquare, GraduationCap, ChevronRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-8">
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-2">
            <Image src="/images/aastu-logo.png" alt="aastu logo" width={50} height={50} />
            <span className="font-bold text-xl text-[#c69323]">AASTU</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c69323] leading-tight mb-4">
              Education creates a better future
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
              Discover the comprehensive curriculum and courses offered at Addis Ababa Science and Technology
              University. Find the right path for your academic journey.
            </p>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/aastu-gbi.jpg" alt="Students studying" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 px-6 md:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#c69323] mb-8">Explore Featured Courses</h2>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mx-auto flex justify-center mb-6">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="computing">Computing</TabsTrigger>
              <TabsTrigger value="science">Science</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Software Engineering",
                  image: "/images/software.webp",
                  students: 120,
                  duration: "5 years",
                },
                {
                  title: "Electrical Engineering",
                  image: "/images/electrical.webp",
                  students: 85,
                  duration: "5 years",
                },
                {
                  title: "Mechanical Engineering",
                  image: "/images/mechanical.webp",
                  students: 95,
                  duration: "5 years",
                },
              ].map((course, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Explore Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="engineering">
              <div className="text-center py-8">
                <p className="text-gray-500">Engineering courses content will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="computing">
              <div className="text-center py-8">
                <p className="text-gray-500">Computing courses content will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="science">
              <div className="text-center py-8">
                <p className="text-gray-500">Science courses content will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#c69323] mb-6">
                Interactive learning on our platform
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e5cc96] flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-[#c69323]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comprehensive curriculum</h3>
                    <p className="text-gray-600 text-sm">
                      We provide complete and well-structured courses for all departments.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e5cc96] flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-[#c69323]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Collaborative learning</h3>
                    <p className="text-gray-600 text-sm">
                      Engage with professors and fellow students through our platform.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e5cc96] flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-[#c69323]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Career-focused outcomes</h3>
                    <p className="text-gray-600 text-sm">
                      Our courses are designed to prepare you for real-world challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] md:h-[400px]">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-lg overflow-hidden">
                <Image
                  src="/images/interactive1.webp"
                  alt="Students collaborating"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-lg overflow-hidden border-4 border-white">
                <Image
                  src="/images/interactive2.webp"
                  alt="Professor teaching"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
