import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'miApp',
  webDir: 'dist',
  // La API de la actividad corre en el PC por HTTP (http://<IP-del-PC>:3000).
  // Con esto la app en Android puede llamarla sin que el WebView la bloquee.
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
