"use client";

import { useEffect, useState } from "react";
import Header from "@/components/channel/Header";
import ContentTabs from "@/components/channel/ContentTabs";
import ContentGrid from "@/components/channel/ContentGrid";
import Sidebar from "@/components/channel/Sidebar";
import mongoose from "mongoose";

interface Creator {
  _id: mongoose.Types.ObjectId,
  user_type: String,
  name: String,
}

export default function Home() {
  const [creator, setCreator] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get id from URL query parameter
  const getId = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('id');
    }
    return null;
  };
  
  useEffect(() => {
    const id = getId();
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/creator?id=${id}`);
        if (!res.ok) throw new Error("Failed to load creator data");

        const data = await res.json();
        setCreator(data.creator);
        setContent(data.content);
        setStats(data.stats);
      } catch (err) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <main className="min-h-screen">
      <Header creator={creator}/>
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        <div className="w-full lg:w-full lg:pr-8">
          <ContentTabs />
          <ContentGrid content={content} />
        </div>
        <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
          <Sidebar creator={creator} stats={stats}/>
        </div>
      </div>
    </main>
  );
}