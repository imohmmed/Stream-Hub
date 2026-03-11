import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetSeriesInfo } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingScreen } from "@/components/ui/Loading";
import { Play, Calendar, Star, Layers, Film } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SeriesDetails() {
  const [, params] = useRoute("/series/:id");
  const id = params?.id || "";
  
  const { data, isLoading, error } = useGetSeriesInfo({ series_id: id });
  
  // Get available seasons from the episodes object keys
  const seasons = data?.episodes ? Object.keys(data.episodes).sort((a, b) => Number(a) - Number(b)) : [];
  const [activeSeason, setActiveSeason] = useState<string>(seasons[0] || "1");

  // Ensure active season is set when data loads
  if (seasons.length > 0 && !seasons.includes(activeSeason)) {
    setActiveSeason(seasons[0]);
  }

  if (isLoading) return <LoadingScreen />;
  if (error || !data) {
    return (
      <AppLayout>
        <div className="pt-32 pb-12 flex flex-col items-center justify-center h-[60vh] text-center">
          <Film className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">عذراً، المسلسل غير متوفر</h2>
          <p className="text-muted-foreground mb-6">حدث خطأ أثناء تحميل تفاصيل المسلسل.</p>
          <Link href="/series" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            العودة للمسلسلات
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { info, episodes } = data;
  const currentEpisodes = episodes[activeSeason] || [];
  const heroImage = info.cover || `${import.meta.env.BASE_URL}images/hero-fallback.png`;

  return (
    <AppLayout>
      {/* Top Banner */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt={info.name} 
            className="w-full h-full object-cover opacity-40 blur-sm transform scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end w-full">
            {/* Poster */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-40 md:w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl shadow-black border border-white/10 hidden sm:block"
            >
              <img src={heroImage} alt={info.name} className="w-full h-auto" />
            </motion.div>

            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-shadow-md">
                {info.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-300 mb-6">
                {info.rating && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-md border border-white/10">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-white">{info.rating}</span>
                  </div>
                )}
                {info.releaseDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{info.releaseDate}</span>
                  </div>
                )}
                {info.genre && (
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>{info.genre}</span>
                  </div>
                )}
              </div>

              {info.plot && (
                <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
                  {info.plot}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="container mx-auto px-4 md:px-8 py-12 relative z-20">
        {/* Season Selector */}
        {seasons.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">المواسم</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => setActiveSeason(season)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-bold transition-all whitespace-nowrap",
                    activeSeason === season
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-white"
                  )}
                >
                  الموسم {season}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episodes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentEpisodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/play/series/${id}?episode=${episode.id}`}>
                <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer overflow-hidden relative">
                  
                  <div className="w-16 h-16 rounded-lg bg-black/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform relative overflow-hidden border border-white/5">
                    {/* Placeholder image for episode */}
                    <img src={heroImage} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <Play className="w-6 h-6 text-white relative z-10 group-hover:text-primary transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate group-hover:text-primary transition-colors">
                      {episode.title || `حلقة ${episode.episode_num}`}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      الحلقة {episode.episode_num}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {currentEpisodes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">لا توجد حلقات متوفرة في هذا الموسم.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
