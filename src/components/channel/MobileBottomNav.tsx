import { useState } from 'react';
// import { FaHome, FaVideo, FaBook, FaList, FaPlus, FaSearch } from 'react-icons/fa'; // Example Icons

export default function MobileBottomNav() {
    const [activeTab, setActiveTab] = useState('home'); // Example state for active tab
    const [showQuickActions, setShowQuickActions] = useState(false); // For the '+' button actions

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' /* <FaHome /> */ },
        { id: 'lessons', label: 'Lessons', icon: '🎬' /* <FaVideo /> */ },
        { id: 'books', label: 'Books', icon: '📚' /* <FaBook /> */ },
        { id: 'playlists', label: 'Playlists', icon: '📄' /* <FaList /> */ },
    ];

    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1C2526] border-t border-gray-700 px-4 py-2 flex justify-around items-center z-50">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center w-1/4 p-1 rounded-md transition-colors ${activeTab === item.id ? 'text-[#007AFF]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </nav>

             {/* Floating Action Button (+) */}
             <div className="lg:hidden fixed bottom-20 right-5 z-50"> {/* Position above nav bar */}
                 <div className="relative">
                    {/* Quick Actions Menu (optional, shown on + click) */}
                    {showQuickActions && (
                        <div className="absolute bottom-full right-0 mb-2 flex flex-col space-y-2">
                            <button className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600"> {/* [Search Icon] */ }🔍</button>
                            <button className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600"> {/* [Upload Icon] */ }➕</button>
                        </div>
                    )}
                    {/* The main + button */}
                    <button
                         onClick={() => setShowQuickActions(!showQuickActions)}
                        className="bg-[#007AFF] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110"
                    >
                        {showQuickActions ? '✕' : '+'} {/* Toggle icon */}
                    </button>
                 </div>
             </div>
        </>
    );
}