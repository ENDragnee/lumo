import Image from "next/image"
import { Creator } from "@/types/users"

export default function Header( { creator }: {creator: Creator}) {
  return (
    <header className="relative h-[200px] md:h-[250px] lg:h-[300px]">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center md:items-end h-full">
          {
            creator.profileImage ? (
              <Image
                src={creator.profileImage}
                alt="Profile Avatar"
                width={120}
                height={120}
                className="rounded-full border-4 border-white mb-4 md:mb-0 md:mr-6"
              />
            ) : (
              <div className=" flex flex-col items-center justify-center rounded-full border-4 bg-blue-500 border-white mb-4 md:mb-0 md:mr-6 w-32 h-32">
                <h1 className="text-gray-100 text-6xl">{creator.name[0].toUpperCase()}</h1>
              </div>
            )
          }
          <div className="text-white text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">{creator.name}</h1>
            {/* <p className="text-sm mb-2">10th-grade chemistry lessons with interactive simulations...</p> */}
            <div className="flex space-x-2 justify-center md:justify-start">
              { creator?.tags?.length ? (
                  creator.tags.map((tag, index) =>(
                  <span key={index} className="bg-blue-500 text-xs px-2 py-1 rounded-full">{tag}</span>
              ))) : (
                <span className="text-gray-300 text-xs">No tags available</span>
              )
              }
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
              Subscribe
            </button>
            <button className="border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition duration-300">
              Share
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
