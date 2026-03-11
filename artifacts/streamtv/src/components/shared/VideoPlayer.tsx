import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Maximize, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface VideoPlayerProps {
  url: string;
  title: string;
  poster?: string;
  onBack?: () => void;
}

export function VideoPlayer({ url, title, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setIsLoading(true);
    setError(null);

    let hls: Hls;

    const onCanPlay = () => setIsLoading(false);
    const onErrorEvent = () => {
      setIsLoading(false);
      setError("تعذر تشغيل الفيديو. قد يكون الرابط غير صالح أو محظور.");
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onErrorEvent);

    if (Hls.isSupported() && url.includes(".m3u8")) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented", e));
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError("حدث خطأ غير متوقع أثناء البث.");
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari / iOS)
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented", e));
      });
    } else {
      // MP4 fallback
      video.src = url;
    }

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onErrorEvent);
    };
  }, [url]);

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    const video = videoRef.current as any;
    
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black group">
      {/* Top Bar - Shows on hover */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors text-white">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <h1 className="text-white text-xl font-bold text-shadow-md">{title}</h1>
        </div>
      </div>

      {isLoading && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
          <div className="text-center p-6 max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive font-bold text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">عذراً</h2>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/" className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-contain"
        controls
        playsInline
        crossOrigin="anonymous"
      />

      {/* Custom Fullscreen Button for devices that might hide native controls slightly */}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-6 left-6 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Maximize className="w-5 h-5" />
      </button>
    </div>
  );
}
