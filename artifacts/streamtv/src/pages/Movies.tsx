import { useState } from "react";
import { useGetMovies } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MediaCard } from "@/components/shared/MediaCard";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { LoadingSpinner } from "@/components/ui/Loading";
import { motion } from "framer-motion";

export function Movies() {
  const [categoryId, setCategoryId] = useState<string>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetMovies({ 
    page, 
    category_id: categoryId 
  });

  const handleCategoryChange = (id?: string) => {
    setCategoryId(id);
    setPage(1); // Reset page on category change
  };

  return (
    <AppLayout>
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container mx-auto">
          <div className="px-4 md:px-8 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">الأفلام</h1>
            <p className="text-muted-foreground">استكشف مكتبتنا الضخمة من الأفلام بجودة عالية</p>
          </div>

          <CategoryFilter 
            type="movie" 
            selectedId={categoryId} 
            onSelect={handleCategoryChange} 
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner className="w-12 h-12" />
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-6"
              >
                {data?.movies?.map((movie, index) => (
                  <motion.div 
                    key={movie.stream_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <MediaCard
                      id={movie.stream_id}
                      type="movie"
                      title={movie.name}
                      image={movie.stream_icon}
                      rating={movie.rating}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              {!data?.movies?.length && (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">لا توجد أفلام في هذا القسم حالياً.</p>
                </div>
              )}

              {/* Simple Load More placeholder - would need infinite query for real append */}
              {data?.movies?.length === 20 && (
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={isFetching}
                    className="px-8 py-3 rounded-full bg-secondary text-white font-bold hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isFetching ? <LoadingSpinner className="w-5 h-5" /> : null}
                    الصفحة التالية
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
