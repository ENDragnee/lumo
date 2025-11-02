import { Sparkles, Brain, Rocket } from 'lucide-react'
import { NavigationBar } from './NavigationBar'

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className='mb-20'>
        <NavigationBar/>
      </header>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-lumo-accent mb-4">
          Empowering Students to Learn, Anytime, Anywhere.
        </h1>
        <p className="text-xl text-lumo-muted">
          At Lumo, we believe every student deserves a chance to understand and succeed.
        </p>
      </div>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-lg leading-relaxed mb-8">
          But sometimes learning feels overwhelming—like climbing a mountain without a map. That's where we come in.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lumo-accent/10 mb-4">
              <Sparkles className="h-8 w-8 text-lumo-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-lumo-muted">
              We transform textbooks and lessons into interactive, fun, and simple tools.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lumo-accent/10 mb-4">
              <Brain className="h-8 w-8 text-lumo-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Tutor</h3>
            <p className="text-lumo-muted">
              Need help? Our AI tutor is ready to explain anything, like your smartest study buddy.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lumo-accent/10 mb-4">
              <Rocket className="h-8 w-8 text-lumo-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn Anywhere</h3>
            <p className="text-lumo-muted">
              With Lumo, you can learn at home, in class, or anywhere your phone goes.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 mb-8">
          <p className="text-xl font-medium mb-4">
            We're here to help you focus, explore, and grow—one step at a time.
          </p>
          <p className="text-lg text-lumo-muted mb-8">
            Because learning isn't about memorizing; it's about understanding.
          </p>
          <div className="inline-block border-b-2 border-lumo-accent pb-1 text-2xl font-semibold">
            Welcome to Lumo. Your journey starts here.
          </div>
        </div>
      </div>
    </div>
  )
}

