// components/mainPage/UserIcon.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Settings, LogOut, User as UserAvatarIcon } from 'lucide-react'; // Renamed User to avoid conflict
import Link from 'next/link';

const UserIcon = () => {
    const { data: session } = useSession();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    const handleToggleMenu = () => {
        setIsUserMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsUserMenuOpen(false);
    }

    if (!session) {
        return null;
    }

    return (
        // Removed ml-3, parent containers will handle margin/spacing
        <div className="relative">
            {/* User Profile Avatar Button */}
            <button
                ref={avatarRef}
                onClick={handleToggleMenu}
                // Adjusted size slightly for potentially smaller mobile targets
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 hover:opacity-90 transition-opacity"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
            >
                {session.user?.image ? (
                    <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-lg font-semibold text-gray-700 dark:text-white">
                        {session.user?.name ? session.user.name.charAt(0).toUpperCase() : <UserAvatarIcon size={20} />}
                    </span>
                )}
            </button>

            {/* Dropdown Menu - Added responsive positioning */}
            {isUserMenuOpen && (
                <div
                    ref={userMenuRef}
                    // Default: bottom-full (above), mb-2 (margin below button)
                    // On md+: top-full (below), mt-2 (margin above button)
                    className="absolute bottom-full right-0 mb-2 md:top-full md:bottom-auto md:mt-2 md:mb-0 w-72 bg-white dark:bg-[#282828] rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 py-2"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden shrink-0">
                             {session.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover"/>
                            ) : (
                                <span className="text-lg font-semibold text-gray-700 dark:text-white">
                                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : <UserAvatarIcon size={20}/>}
                                </span>
                            )}
                        </div>
                        <div className="text-sm truncate">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{session.user?.name || 'User'}</p>
                            <p className="text-gray-600 dark:text-gray-400 truncate">{session.user?.email || ''}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    {/* <div className="py-1" role="none">
                         <Link
                            href="/settings"
                            onClick={closeMenu}
                            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            role="menuitem"
                        >
                            <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                            <span>Settings</span>
                        </Link>
                    </div> */}

                    {/* Separator */}
                     <hr className="my-1 border-gray-200 dark:border-gray-700" />

                    {/* Logout Button */}
                     <div className="py-1" role="none">
                        <button
                            onClick={() => {
                                closeMenu();
                                signOut();
                            }}
                            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            role="menuitem"
                        >
                            <LogOut size={18} className="text-gray-500 dark:text-gray-400" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserIcon;