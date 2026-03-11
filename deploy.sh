#!/bin/bash
set -e

REPO="https://github.com/imohmmed/Stream-Hub"
APP_DIR="/var/www/streamtv"
DOMAIN="codeje.me"
APP_PORT=3000

echo "=============================="
echo "   StreamTV - $DOMAIN         "
echo "=============================="

# ── Node.js ──────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "📦 تثبيت Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# ── pnpm ─────────────────────────────────────────────────
if ! command -v pnpm &>/dev/null; then
  echo "📦 تثبيت pnpm..."
  npm install -g pnpm
fi

# ── pm2 ──────────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
  echo "📦 تثبيت PM2..."
  npm install -g pm2
fi

# ── استنساخ أو تحديث الكود ───────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "🔄 تحديث الكود من GitHub..."
  git -C "$APP_DIR" pull origin main
else
  echo "📥 استنساخ المشروع..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER":"$USER" "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"

# ── تثبيت الحزم ──────────────────────────────────────────
echo ""
echo "📦 تثبيت الحزم..."
pnpm install --frozen-lockfile

# ── بناء Frontend ─────────────────────────────────────────
echo ""
echo "🔨 بناء Frontend..."
BASE_PATH=/ PORT=$APP_PORT NODE_ENV=production \
  pnpm --filter @workspace/streamtv run build

# ── بناء Backend ──────────────────────────────────────────
echo ""
echo "🔨 بناء Backend..."
pnpm --filter @workspace/api-server run build

# ── إعداد Nginx ───────────────────────────────────────────
echo ""
echo "⚙️  إعداد Nginx..."
sudo tee /etc/nginx/sites-available/streamtv > /dev/null <<NGINX
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 20M;

    # CORS للـ IPTV
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' '*' always;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/streamtv /etc/nginx/sites-enabled/streamtv
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# ── تشغيل التطبيق ─────────────────────────────────────────
echo ""
echo "🚀 تشغيل مع PM2..."
pm2 delete streamtv 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup 2>/dev/null | grep "sudo" | sudo bash || true

echo ""
echo "✅ تم النشر!"
echo "🌐 http://$DOMAIN"
