import Header from "@/components/channel/Header"
import ContentTabs from "@/components/channel/ContentTabs"
import ContentGrid from "@/components/channel/ContentGrid"
import Sidebar from "@/components/channel/Sidebar"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        <div className="w-full lg:w-full lg:pr-8">
          <ContentTabs />
          <ContentGrid />
        </div>
        <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </main>
  )
}