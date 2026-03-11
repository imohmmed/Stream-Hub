import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  id: string;
  type: "movie" | "series" | "live";
  title: string;
  image?: string;
  rating?: string;
  className?: string;
}

export function MediaCard({ id, type, title, image, rating, className }: MediaCardProps) {
  // Determine route based on type
  const href = type === "series" ? `/series/${id}` : `/play/${type}/${id}`;
  
  const fallbackImage = `${import.meta.env.BASE_URL}images/poster-placeholder.png`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn("group relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-card cursor-pointer isolate", className)}
    >
      <Link href={href} className="absolute inset-0 z-20">
        <span className="sr-only">Play {title}</span>
      </Link>

      <img
        src={image || fallbackImage}
        alt={title}
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Live Badge */}
      {type === "live" && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">LIVE</span>
        </div>
      )}

      {/* Rating Badge */}
      {rating && type !== "live" && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-white">{rating}</span>
        </div>
      )}

      {/* Play Button Overlay (Hover) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/50 backdrop-blur-md">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 text-shadow-md leading-tight">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}
