'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, Bookmark, History, Library, GraduationCap, Eye, Star, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

type RecommendedItem = {
  _id: string;
  title: string;
  thumbnail: string;
  subject: string;
  institution: string;
  views: number;
  passRate: number;
};

function SidebarRecommendations() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = session?.user?.id;
        const url = new URL('/api/recommendations', window.location.origin);
        if (userId) url.searchParams.set('userId', userId);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user?.id]);

  const formatViews = (views: number) => {
    if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M views`;
    if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatPassRate = (rate: number) => {
    return `${Math.round(rate * 100)}% pass rate`;
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Recommended Content
      </h2>
      <div className="space-y-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton height={100} />
              <Skeleton count={2} />
            </div>
          ))
        ) : recommendations.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            No recommendations available
          </div>
        ) : (
          recommendations.map((item) => (
            <Link
              key={item._id}
              href={`/content?id=${item._id}`}
              className="group block border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                {item.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{item.institution}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {formatViews(item.views)}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {formatPassRate(item.passRate)}
                </div>
              </div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                {item.subject}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function NewLeftSidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Home', href: '/main', icon: Home, current: pathname === '/' },
    { name: 'History', href: '/history', icon: History, current: pathname === '/history' },
    { name: 'Library', href: '/library', icon: Library, current: pathname === '/library' },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark, current: pathname === '/bookmarks' },
    { name: 'Recent', href: '/recent', icon: Clock, current: pathname === '/recent' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
  className={cn(
    "fixed left-0 top-0 h-full flex flex-col bg-white dark:bg-[#2b2d36] border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
    isOpen ? "w-64" : "md:w-16 w-0 overflow-hidden"
  )}
>
  {/* Toggle button and logo */}
  <div className={cn("flex items-center", isOpen ? "justify-between p-4" : "justify-center p-2")}>
    <button onClick={toggleSidebar} className="p-2">
      {isOpen ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
    {isOpen && <h1 className="text-xl font-bold dark:text-white">Lumo</h1>}
  </div>

  {/* Search form, hidden when collapsed */}
  {isOpen && (
    <form onSubmit={handleSearchSubmit} className="p-4 border-b dark:border-gray-700 bg-white dark:bg-[#2b2d36]">
      <div className="max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search content..."
          className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
    </form>
  )}

  {/* Navigation */}
  <nav className="space-y-2 p-2">
    {navigation.map((item) => (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center rounded-lg transition-colors",
          isOpen ? "p-3" : "p-2 justify-center",
          item.current
            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        )}
      >
        <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
        {isOpen && <span className="text-sm font-medium">{item.name}</span>}
      </Link>
    ))}
  </nav>

  {/* Recommendations, hidden when collapsed */}
  {isOpen && (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <SidebarRecommendations />
      </div>
    </div>
  )}

  {/* User section */}
  <div className={cn("border-t dark:border-gray-700", isOpen ? "p-4" : "p-2")}>
    <div className={cn("flex flex-col items-center space-y-4", !isOpen && "space-y-2")}>
      <ThemeToggle />
      {session?.user && (
        <button
          onClick={() => {
            if (isOpen) {
              setIsUserMenuOpen(!isUserMenuOpen);
            } else {
              router.push("/profile");
            }
          }}
          className={cn(
            "w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold",
            isOpen && "mb-2"
          )}
        >
          {session.user.name?.charAt(0).toUpperCase()}
        </button>
      )}
    </div>
    {isUserMenuOpen && isOpen && (
      <div className="absolute bottom-full left-0 w-full mb-2 rounded-md shadow-lg bg-white dark:bg-[#404552] border dark:border-gray-600">
        <div className="py-1">
          <button
            onClick={() => router.push("/profile")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] dark:text-gray-300"
          >
            Profile
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] dark:text-gray-300"
          >
            Settings
          </button>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] dark:text-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    )}
  </div>
</div>
  );
}