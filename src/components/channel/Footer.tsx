import { FooterProps } from "@/types/creator";

export default function Footer({ name }: FooterProps ) {
  return (
      <footer className="bg-transparent text-[#F5F7FA] py-8 mt-16"> {/* Darker Footer */}
          <div className="container mx-auto px-4 text-center">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  {/* Copyright */}
                  <p className="text-sm text-gray-400">© {new Date().getFullYear()} {name}. All rights reserved.</p>

                  {/* Social Icons */}
                  <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-[#007AFF] transition-colors">[Li]</a> {/* LinkedIn Icon */}
                      <a href="#" className="text-gray-400 hover:text-[#007AFF] transition-colors">[Tw]</a> {/* Twitter Icon */}
                      {/* Add more */}
                  </div>

                   {/* Newsletter Signup */}
                  <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full max-w-sm mx-auto md:mx-0">
                      <input
                          type="email"
                          placeholder="Join our newsletter"
                          className="flex-grow px-3 py-2 rounded-md bg-[#2A3A3C] text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#007AFF] text-sm"
                      />
                      <button type="submit" className="bg-[#007AFF] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors">
                          Subscribe
                      </button>
                  </form>
              </div>
          </div>
      </footer>
  );
}