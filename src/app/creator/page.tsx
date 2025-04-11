"use client";

import { useEffect, useState } from "react";

// Component Imports
import NewHeader from "@/components/channel/Header";
import HeroContent from "@/components/channel/HeroContent"; // Uses the updated version
import ContentCarousel from "@/components/channel/ContentCarousel";
import ContentGrid from "@/components/channel/ContentGrid";
import AboutCard from "@/components/channel/AboutCard";
import Footer from "@/components/channel/Footer";
import { Creator, ContentItem, Stats, FooterProps } from "@/types/creator";

export default function Home() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getId = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('id');
    }
    return null;
  };

  useEffect(() => {
    const id = getId();
    if (!id) {
      setError("Creator ID not found in URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/creator?id=${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Failed to load creator data" }));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Format Creator
        const formattedCreator: Creator = {
            ...data.creator,
            avatarUrl: data.creator.avatarUrl || '/default-avatar.png',
            tagline: data.creator.tagline || 'Inspiring the next generation',
            bio: data.creator.bio || `I am ${data.creator.name}. Learning and sharing knowledge!`,
            credentials: data.creator.credentials || ['PhD', 'Educator'],
            socialLinks: data.creator.socialLinks || []
        };

        // Format Content - Ensure unique key if needed (e.g., adding 'id')
        const formattedContent: ContentItem[] = (data.content || []).map((item: any) => ({
            ...item,
            id: item._id.toString(), // Ensure 'id' exists if needed for keys
            type: item.type || 'lesson',
            thumbnail: item.thumbnail || '/default-thumbnail.jpg',
        }));

        // Format Stats
        const formattedStats: Stats = {
            ...data.stats,
            rating: data.stats?.rating ?? 0,
            ratingCount: data.stats?.ratingCount ?? 0,
        };

        setCreator(formattedCreator);
        setContent(formattedContent); // Assume API returns content sorted by popularity/relevance
        setStats(formattedStats);

      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array, runs once

  // --- Loading and Error States ---
  if (loading) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p className="text-xl">Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-red-500"><p className="text-xl text-center p-4">{error}</p></div>;
  if (!creator) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p>Creator data not available.</p></div>;


  // --- Determine content for different sections ---
  // Decide how many items go into the Hero Carousel
  const heroItemCount = 5; // Display up to 5 items in the hero section

  // Select items for the Hero section (e.g., first N items, assuming sorted by popularity/feature flag)
  // You might want more sophisticated logic here based on your API data (e.g., filter by isFeatured flag)
  const heroContentItems = content.slice(0, heroItemCount);

  // Select items for the regular carousel (e.g., the next 5 items)
  const carouselItemCount = 5;
  const carouselContent = content.slice(heroItemCount, heroItemCount + carouselItemCount);

  // The rest of the content goes into the grid
  const gridContent = content.slice(heroItemCount + carouselItemCount);

  return (
    <main className="min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA] font-sans ml-2 p-2">

      <NewHeader creator={creator} stats={stats} />

      <div className="container mx-auto px-4 py-8 space-y-12">

        {/* Hero Content - Pass the array of popular videos */}
        {heroContentItems.length > 0 && (
            <HeroContent
                popularVideos={heroContentItems}
                autoScrollInterval={7000} // Optional: Set custom interval (e.g., 7 seconds)
            />
        )}

        {/* Carousel - Uses the next set of content */}
        {carouselContent.length > 0 && <ContentCarousel content={carouselContent} />}

        {/* Grid View - Uses the remaining content */}
        {gridContent.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#F5F7FA]">More Content</h2>
            <ContentGrid content={gridContent} />
          </div>
        )}

        <AboutCard creator={creator} stats={stats} />
      </div>

      <Footer name={creator.name}/>
    </main>
  );
}