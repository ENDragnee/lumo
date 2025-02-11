import Image from "next/image"

export default function ContentGrid( {content}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {content.map((item: any) => (
        <div
          key={item.id}
          className="rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-video">
            <Image
              src={`/placeholder.svg?height=160&width=320&text=${item.title}`}
              alt={item.title}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
              <button className="text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                ▶️ Play
              </button>
              <button className="text-white bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300">
                💾 Save
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">
              {item.views} Views | {item.passRate} Pass Rate
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}