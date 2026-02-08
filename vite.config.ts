import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['pwa-icon.svg'],
        manifest: {
          name: 'CEITEC - Eventos e Reuniões',
          short_name: 'CEITEC Eventos',
          description: 'Sistema de agendamento e confirmação de presença para eventos do CEITEC',
          theme_color: '#137fec',
          background_color: '#f6f7f8',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          icons: [
            {
              src: 'pwa-icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    build: {
      chunkSizeWarningLimit: Infinity,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-ai';
              }
              if (id.includes('react-router')) {
                return 'vendor-router';
              }
              return 'vendor-other';
            }
          }
        }
      }
    },
    resolve: {

      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
