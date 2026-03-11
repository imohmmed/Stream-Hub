import { useState } from "react";
import { useGetChannels } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MediaCard } from "@/components/shared/MediaCard";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { LoadingSpinner } from "@/components/ui/Loading";
import { motion } from "framer-motion";

export function Live() {
  const [categoryId, setCategoryId] = useState<string>();
  const { data, isLoading } = useGetChannels();

  // Filter channels locally since the API doesn't seem to take category_id for channels
  const filteredChannels = data?.channels?.filter(
    ch => !categoryId || ch.category_id === categoryId
  );

  return (
    <AppLayout>
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container mx-auto">
          <div className="px-4 md:px-8 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                البث المباشر
              </h1>
              <p className="text-muted-foreground">أفضل القنوات التلفزيونية والرياضية بث مباشر</p>
            </div>
          </div>

          <CategoryFilter 
            type="live" 
            selectedId={categoryId} 
            onSelect={setCategoryId} 
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
                {filteredChannels?.map((channel, index) => (
                  <motion.div 
                    key={channel.stream_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
                  >
                    <MediaCard
                      id={channel.stream_id}
                      type="live"
                      title={channel.name}
                      image={channel.stream_icon}
                      className="aspect-[16/9]" // Live channels look better wide
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              {!filteredChannels?.length && (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">لا توجد قنوات متاحة.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
