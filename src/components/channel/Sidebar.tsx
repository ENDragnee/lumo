import Image from "next/image"
import { Stats } from "@/types/stats"
import { Creator } from "@/types/users"

interface SideBarProp {
  creator: Creator;
  stats: Stats;
}

export default function Sidebar( { creator, stats}: SideBarProp) {
  return (
    <aside className=" bg-opacity-70 backdrop-blur-md rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="font-bold text-xl mb-4">About</h2>
      <p className="text-sm mb-4">
        {
          creator.bio || `No Biography`
        }
      </p>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Credentials</h3>
        <ul className="text-sm">
          { 
            creator?.credentials?.length ? (
              creator.credentials.map((credits) =>(
              <li>{credits}</li>
            ))
          ): (
              <li>{`Ther are no mentioned credits`}</li>
            )
          }
        </ul>
      </div>
      {/* <div className="mb-6">
        <h3 className="font-semibold mb-2">Featured Content</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Featured Lesson"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-sm">Introduction to Organic Chemistry</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Featured Playlist"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-sm">AP Chemistry Prep</span>
          </div>
        </div>
      </div> */}
      <div>
        <h3 className="font-semibold mb-2">Statistics</h3>
        <ul className="text-sm">
          <li>{stats?.subscribersCount?.toString() || "0" } Subscribers</li>
          <li>{stats?.totalViews?.toString() || "0"} Total Views</li>
          <li>⭐️ {stats?.averageRating?.toString()+`/5` || "1/5"} Rating</li>
        </ul>
      </div>
    </aside>
  )
}