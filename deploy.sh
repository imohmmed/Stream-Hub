#!/bin/bash
set -e

echo "=============================="
echo "   StreamTV VPS Deploy Script "
echo "=============================="

# تحقق من Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js غير مثبت. ثبته أولاً:"
  echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
  echo "   sudo apt-get install -y nodejs"
  exit 1
fi

# تحقق من pnpm
if ! command -v pnpm &> /dev/null; then
  echo "📦 تثبيت pnpm..."
  npm install -g pnpm
fi

# تحقق من pm2
if ! command -v pm2 &> /dev/null; then
  echo "📦 تثبيت PM2..."
  npm install -g pm2
fi

echo ""
echo "📦 تثبيت الحزم..."
pnpm install

echo ""
echo "🔨 بناء الـ Frontend..."
BASE_PATH=/ PORT=3000 NODE_ENV=production pnpm --filter @workspace/streamtv run build

echo ""
echo "🔨 بناء الـ Backend..."
pnpm --filter @workspace/api-server run build

echo ""
echo "🚀 تشغيل السيرفر مع PM2..."
pm2 delete streamtv 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save

echo ""
echo "✅ تم النشر بنجاح!"
echo "🌐 الموقع يعمل على: http://$(hostname -I | awk '{print $1}'):80"
echo ""
echo "أوامر مفيدة:"
echo "  pm2 logs streamtv    → لرؤية السجلات"
echo "  pm2 restart streamtv → لإعادة التشغيل"
echo "  pm2 stop streamtv    → لإيقاف السيرفر"
