import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a6d7339433a343ed91295b77db5224a0',
  appName: 'connectfit',
  webDir: 'dist',
  server: {
    url: 'https://a6d73394-33a3-43ed-9129-5b77db5224a0.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    Geolocation: {
      permissions: ['location'],
    },
  },
};

export default config;
