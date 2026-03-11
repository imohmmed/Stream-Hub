# دليل نشر StreamTV على VPS

## المتطلبات
- VPS بنظام Ubuntu 20.04+
- Node.js 20+
- منفذ 80 مفتوح

## خطوات النشر

### 1. رفع الملفات على السيرفر
```bash
# من جهازك المحلي — ارفع المجلد كله
scp -r . root@YOUR_VPS_IP:/var/www/streamtv

# أو استخدم git
git clone YOUR_REPO /var/www/streamtv
```

### 2. تثبيت Node.js (إذا لم يكن مثبتاً)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm pm2
```

### 3. تشغيل سكريبت النشر
```bash
cd /var/www/streamtv
chmod +x deploy.sh
sudo ./deploy.sh
```

> السيرفر سيشتغل على المنفذ **80** تلقائياً عبر **HTTP** بدون HTTPS

## إعدادات IPTV
يمكنك تغيير بيانات IPTV من ملف `ecosystem.config.cjs`:
```
IPTV_BASE_URL: "http://mzbrxgwh.saifdns.com"
IPTV_USERNAME: "JVC3H3LW"  
IPTV_PASSWORD: "DFYXG4N1"
```
ثم أعد التشغيل: `pm2 restart streamtv`

## الوصول للموقع
```
http://YOUR_VPS_IP/
```

## أوامر PM2 المفيدة
```bash
pm2 logs streamtv      # لرؤية السجلات
pm2 restart streamtv   # إعادة تشغيل
pm2 stop streamtv      # إيقاف
pm2 status             # حالة كل العمليات
```
