"use client"
import { Lightbulb, Zap, Rocket } from 'lucide-react'
import { useRouter } from "next/navigation";


export default function LandingPage() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Welcome to <span className="text-blue-500">Lumo</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    The educational system that makes learning fun and interactive. Ignite your curiosity and unlock your potential.
                  </p>
                </div>
              </div>
            </section>
            <section id="features" className="w-full py-12 md:py-24 lg:py-32">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Why Choose Lumo?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                <div className="flex flex-col items-center text-center max-w-xs">
                  <Lightbulb className="h-12 w-12 mb-4 text-blue-500" />
                  <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
                  <p className="text-gray-500 dark:text-gray-400">Engage with content through quizzes, games, and simulations.</p>
                </div>
                <div className="flex flex-col items-center text-center max-w-xs">
                  <Zap className="h-12 w-12 mb-4 text-blue-500" />
                  <h3 className="text-xl font-bold mb-2">Personalized Experience</h3>
                  <p className="text-gray-500 dark:text-gray-400">Adaptive learning paths tailored to your unique needs.</p>
                </div>
                <div className="flex flex-col items-center text-center max-w-xs">
                  <Rocket className="h-12 w-12 mb-4 text-blue-500" />
                  <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                  <p className="text-gray-500 dark:text-gray-400">Monitor your growth with detailed analytics and insights.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

