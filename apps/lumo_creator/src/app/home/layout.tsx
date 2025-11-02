"use client";

import { Home, Trash2, Settings, Loader2, Image } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { MobileBottomBar } from "@/components/navigation/MobileBottomBar";
import '../globals.css';

// The single source of truth for our navigation links
const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Trash", href: "/home/trash", icon: Trash2 },
  { name: "Media", href: "/home/media", icon: Image},
  { name: "Manage", href: "/home/manage", icon: Settings},
  // You can easily add more links here in the future
  // { name: "Settings", href: "/home/settings", icon: Settings },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  // This session check remains crucial for protecting the layout
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Shows a full-page loader while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Return null to prevent a flash of content before redirecting
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Render the Desktop Sidebar, passing the navigation items */}
      <DesktopSidebar navigation={navigation} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

      {/* Render the Mobile Bottom Bar, passing the same navigation items */}
      <MobileBottomBar navigation={navigation} />
    </div>
  );
}
