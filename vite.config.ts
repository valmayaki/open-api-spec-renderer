import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { build } from 'vite';

const copyManifestPlugin = () => ({
  name: 'copy-manifest',
  closeBundle() {
    const manifestPath = path.resolve(__dirname, 'manifest.json');
    const distPath = path.resolve(__dirname, 'dist/manifest.json');
    fs.copyFileSync(manifestPath, distPath);
  },
});

export default defineConfig({
  plugins: [copyManifestPlugin()],
  build: {
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/index.ts'),
        ui: path.resolve(__dirname, 'src/ui/index.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return 'src/[name]/index.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // This is tricky because we want 'es' for UI but 'iife' for content.
        // Vite's default is 'es'.
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
