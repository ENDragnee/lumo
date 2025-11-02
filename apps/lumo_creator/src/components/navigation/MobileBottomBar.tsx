"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LucideIcon, LogOut, Settings, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"; // Assuming you have Drawer from shadcn/ui
import { ThemeToggle } from "../theme-toggle";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileBottomBarProps {
  navigation: NavigationItem[];
}

export function MobileBottomBar({ navigation }: MobileBottomBarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around z-50">
      {/* Page Navigation Links */}
      {navigation.map((item) => (
        <Link
          key={`mobile-${item.name}`}
          href={item.href}
          className={cn(
            "flex-1 flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors",
            (pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href)))
              ? "text-primary bg-muted"
              : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <item.icon className="h-5 w-5 mb-1" aria-hidden="true" />
          <span>{item.name}</span>
        </Link>
      ))}

      {/* User Profile Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <button className="flex-1 flex flex-col items-center justify-center p-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
            <UserIcon className="h-5 w-5 mb-1" />
            <span>Profile</span>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                  {session?.user?.image ? (
                    <AvatarImage src={session.user.image} alt={session.user.name || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 font-bold">
                      {session?.user?.name ? getInitials(session.user.name) : <UserIcon />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-base font-semibold">{session?.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-2">
               <ThemeToggle />
               <Button variant="ghost" disabled className="w-full justify-start text-muted-foreground cursor-not-allowed">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
               </Button>
               <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
               </Button>
            </div>
            <DrawerFooter>
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Close</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
