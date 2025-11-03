import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // thêm Tailwind plugin
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'), // alias src
      'lucide-react': 'lucide-react',
      'sonner': 'sonner',
      'recharts': 'recharts',
      'react-hook-form': 'react-hook-form',
      'react-day-picker': 'react-day-picker',
      'next-themes': 'next-themes',
      'input-otp': 'input-otp',
      'embla-carousel-react': 'embla-carousel-react',
      'cmdk': 'cmdk',
      'class-variance-authority': 'class-variance-authority',
      // Radix UI
      '@radix-ui/react-alert-dialog': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion': '@radix-ui/react-accordion',
      '@radix-ui/react-avatar': '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox': '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible': '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu': '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog': '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card': '@radix-ui/react-hover-card',
      '@radix-ui/react-label': '@radix-ui/react-label',
      '@radix-ui/react-menu': '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover': '@radix-ui/react-popover',
      '@radix-ui/react-progress': '@radix-ui/react-progress',
      '@radix-ui/react-radio-group': '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area': '@radix-ui/react-scroll-area',
      '@radix-ui/react-select': '@radix-ui/react-select',
      '@radix-ui/react-separator': '@radix-ui/react-separator',
      '@radix-ui/react-slider': '@radix-ui/react-slider',
      '@radix-ui/react-slot': '@radix-ui/react-slot',
      '@radix-ui/react-switch': '@radix-ui/react-switch',
      '@radix-ui/react-tabs': '@radix-ui/react-tabs',
      '@radix-ui/react-toggle': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip': '@radix-ui/react-tooltip',
      '@radix-ui/react-aspect-ratio': '@radix-ui/react-aspect-ratio',
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
