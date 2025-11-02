//@/components/media/MediaCard
"use client";

import Image from "next/image";
import { IMediaData } from "@/models/Media";
import { Maximize } from "lucide-react";

interface MediaCardProps {
  media: IMediaData;
  onClick: () => void;
}

export function MediaCard({ media, onClick }: MediaCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <Image
        src={media.path}
        alt={media.filename}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
        <Maximize className="h-8 w-8 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-xs font-medium truncate">{media.filename}</p>
      </div>
    </div>
  );
}
