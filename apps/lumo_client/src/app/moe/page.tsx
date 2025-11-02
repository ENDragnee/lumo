import { Poppins } from 'next/font/google'
import { MdSchool, MdTrendingUp, MdPeople } from 'react-icons/md'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export default function Home() {
  return (
    <main className={`min-h-screen flex flex-col ${poppins.className}`}>
      {/* Header Section */}
      <header className="bg-gradient-to-r from-green-600 to-yellow-500 dark:from-green-800 dark:to-yellow-700 text-white px-6 sm:px-6 sm:text-xs md:text-base py-6 max-w-4xl mx-auto text-justify">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-fade-in-down">
          Welcome to the Ministry of Education - Ethiopia
        </h1>
        <p className="text-xl md:text-2xl animate-fade-in-up">
          Empowering education for a brighter future
        </p>
      </header>

      {/* Main Content Section */}
      <section className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The Ethiopian Ministry of Education is committed to providing quality education
              for all citizens, fostering innovation, and building a knowledge-based society.
              We strive to create opportunities for lifelong learning and empower our youth
              to become leaders of tomorrow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MdSchool className="text-4xl text-green-600" />,
                title: 'Quality Education',
                description: 'Improving access to quality education across all levels',
              },
              {
                icon: <MdTrendingUp className="text-4xl text-yellow-500" />,
                title: 'Innovation',
                description: 'Promoting innovative teaching and learning methods',
              },
              {
                icon: <MdPeople className="text-4xl text-red-600" />,
                title: 'Inclusivity',
                description: 'Ensuring inclusive and equitable education for all',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 animate-fade-in">
                <div className="flex items-center justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}

