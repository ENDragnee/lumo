"use client"

import { useState } from "react"

const tabs = ["Home", "Lessons", "Books", "Playlists"]

export default function ContentTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-4 md:space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 dark:text-gray-200 hover:text-gray-700 hover:dark:text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

