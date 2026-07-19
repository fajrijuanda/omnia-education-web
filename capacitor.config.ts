import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.omnia.mobile',
  appName: 'Omnia Super App',
  webDir: 'out',
  server: {
    allowNavigation: [
      'omnia-portal.vercel.app',
      'omnia-cafe-web.vercel.app',
      'omnia-hris-web.vercel.app',
      'omnia-retail-web.vercel.app',
    ],
  },
};

export default config;
