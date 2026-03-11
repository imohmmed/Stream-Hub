import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <AlertCircle className="w-24 h-24 text-primary mb-6 animate-pulse" />
        <h1 className="text-5xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-6">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التحقق من الرابط أو العودة للرئيسية.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
        >
          العودة للرئيسية
        </Link>
      </div>
    </AppLayout>
  );
}
