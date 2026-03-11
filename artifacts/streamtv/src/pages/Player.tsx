import { useRoute } from "wouter";
import { useGetStreamUrl } from "@workspace/api-client-react";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { LoadingScreen } from "@/components/ui/Loading";
import { GetStreamUrlType } from "@workspace/api-client-react/src/generated/api.schemas";

export function Player() {
  const [, params] = useRoute("/play/:type/:id");
  
  // Extract query params for episode
  const searchParams = new URLSearchParams(window.location.search);
  const episodeId = searchParams.get("episode") || undefined;
  
  const type = params?.type as GetStreamUrlType;
  const id = params?.id || "";

  const { data, isLoading, error } = useGetStreamUrl({
    type,
    id,
    episode_id: episodeId
  });

  if (isLoading) return <LoadingScreen />;

  if (error || !data?.url) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white flex-col gap-4">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-2xl font-bold">!</div>
        <h2 className="text-2xl font-bold">عذراً، لا يمكن تشغيل هذا المحتوى</h2>
        <p className="text-gray-400">الرابط غير متوفر أو حدث خطأ في الخادم.</p>
        <button onClick={() => window.history.back()} className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-bold">
          العودة
        </button>
      </div>
    );
  }

  // Construct a generic title based on type (would ideally come from a context or previous API call)
  const title = type === 'live' ? 'بث مباشر' : type === 'movie' ? 'فيلم' : 'حلقة';

  return (
    <div className="bg-black w-full h-screen overflow-hidden">
      <VideoPlayer 
        url={data.url} 
        title={title} 
        onBack={() => window.history.back()} 
      />
    </div>
  );
}
