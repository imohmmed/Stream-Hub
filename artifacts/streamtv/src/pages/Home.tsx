import { useGetMovies, useGetSeries, useGetChannels } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MediaCarousel } from "@/components/shared/MediaCarousel";
import { LoadingScreen } from "@/components/ui/Loading";
import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  const { data: moviesData, isLoading: moviesLoading } = useGetMovies({ page: 1 });
  const { data: seriesData, isLoading: seriesLoading } = useGetSeries({ page: 1 });
  const { data: liveData, isLoading: liveLoading } = useGetChannels();

  if (moviesLoading || seriesLoading || liveLoading) {
    return <LoadingScreen />;
  }

  // Use the first movie as the Hero feature
  const featuredMovie = moviesData?.movies?.[0];
  const heroImage = featuredMovie?.stream_icon || `${import.meta.env.BASE_URL}images/hero-fallback.png`;

  return (
    <AppLayout>
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-start overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt={featuredMovie.name} 
              className="w-full h-full object-cover transform scale-105"
            />
            {/* Gradients to blend into the background */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 md:px-8 relative z-10 w-full pt-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-md shadow-lg shadow-primary/30 uppercase tracking-wider">
                  حصرياً
                </span>
                {featuredMovie.rating && (
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-md">
                    ⭐ {featuredMovie.rating}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 text-shadow-lg leading-tight">
                {featuredMovie.name}
              </h1>
              
              {featuredMovie.plot && (
                <p className="text-lg md:text-xl text-gray-300 mb-8 line-clamp-3 text-shadow-sm max-w-xl">
                  {featuredMovie.plot}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  href={`/play/movie/${featuredMovie.stream_id}`}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-white/10"
                >
                  <Play className="w-6 h-6 fill-black" />
                  تشغيل الآن
                </Link>
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary/80 backdrop-blur-md text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-secondary hover:scale-105 transition-all duration-300">
                  <Info className="w-6 h-6" />
                  مزيد من المعلومات
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Carousels Section */}
      <div className="relative z-20 -mt-20 md:-mt-32 pb-20 space-y-8 md:space-y-12">
        <MediaCarousel 
          title="أحدث الأفلام" 
          items={moviesData?.movies || []} 
          type="movie" 
        />
        
        <MediaCarousel 
          title="مسلسلات تستحق المشاهدة" 
          items={seriesData?.series || []} 
          type="series" 
        />
        
        <MediaCarousel 
          title="قنوات البث المباشر" 
          items={liveData?.channels?.slice(0, 20) || []} 
          type="live" 
        />
      </div>
    </AppLayout>
  );
}
