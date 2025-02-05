import { useState } from "react"
import { Search } from "lucide-react"

const CentralWorkspace = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const filters = ["Grade 12", "Video", "AASTU Curriculum", "Trending"]
  const contentCards = [
    {
      id: 1,
      title: "Master Newton's Laws",
      description: "Interactive simulations to understand physics",
      thumbnail: "/images/physics-thumbnail.jpg",
      progress: 65,
      subject: "Physics",
      institution: "AASTU",
    },
    {
      id: 2,
      title: "Organic Chemistry Basics",
      description: "Learn about carbon compounds and reactions",
      thumbnail: "/images/chemistry-thumbnail.jpg",
      progress: 30,
      subject: "Chemistry",
      institution: "MCE",
    },
  ]

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-background dark:bg-dark-secondary">
      <div className="mb-8">
        <div className="relative w-full md:w-2/3 mx-auto">
          <input
            type="text"
            placeholder="Search modules, quizzes, or ask Lumo AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 rounded-lg border border-border dark:border-dark-accent dark:bg-dark-primary dark:text-dark-text focus:border-dark-highlight focus:ring focus:ring-dark-highlight focus:ring-opacity-50 transition duration-300 ease-in-out"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text" />
        </div>
      </div>

      <div className="mb-8 overflow-x-auto whitespace-nowrap">
        {filters.map((filter) => (
          <button
            key={filter}
            className="inline-block px-4 py-2 mr-2 rounded-lg bg-background dark:bg-dark-primary dark:text-dark-text text-sm font-medium hover:bg-dark-highlight hover:text-white transition duration-300 ease-in-out"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {contentCards.map((card) => (
          <div
            key={card.id}
            className="bg-background dark:bg-dark-primary rounded-lg shadow-md overflow-hidden transform hover:translate-y-[-5px] hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="relative">
              <img src={card.thumbnail || "/placeholder.svg"} alt={card.title} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 w-12 h-12">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#5294e2"
                    strokeWidth="3"
                    strokeDasharray={`${card.progress}, 100`}
                  />
                  <text x="18" y="20" textAnchor="middle" fill="#5294e2" fontSize="10">
                    {card.progress}%
                  </text>
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-bold mb-2 dark:text-dark-text">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-dark-text mb-4">{card.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-dark-highlight text-white text-xs font-bold px-2 py-1 rounded">{card.subject}</span>
                <span className="text-xs text-gray-500 dark:text-dark-text">{card.institution}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CentralWorkspace

