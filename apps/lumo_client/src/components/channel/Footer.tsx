// @/components/channel/Footer.tsx

interface FooterProps {
    name: string;
}

export default function Footer({ name }: FooterProps ) {
  return (
      <footer className="bg-transparent text-gray-400 py-8 mt-16 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                  <p className="text-sm">© {new Date().getFullYear()} {name}. All rights reserved.</p>
                  <div className="flex space-x-4">
                      {/* You would populate these links from the creator's data */}
                      <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                      <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  </div>
                   <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full max-w-sm mx-auto md:mx-0">
                      <input type="email" placeholder="Join the newsletter" className="flex-grow px-3 py-2 rounded-md bg-[#2A3A3C] text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#007AFF] text-sm" aria-label="Email for newsletter"/>
                      <button type="submit" className="bg-[#007AFF] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">Subscribe</button>
                  </form>
              </div>
          </div>
      </footer>
  );
}
