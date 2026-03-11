module.exports = {
  apps: [
    {
      name: "streamtv",
      script: "./artifacts/api-server/dist/index.cjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        IPTV_BASE_URL: "http://mzbrxgwh.saifdns.com",
        IPTV_USERNAME: "JVC3H3LW",
        IPTV_PASSWORD: "DFYXG4N1",
      },
    },
  ],
};
