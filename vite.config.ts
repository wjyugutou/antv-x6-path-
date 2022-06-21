import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'
import Unocss from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    Unocss({
      presets: [
        presetAttributify(),
        presetIcons(),
        presetUno(),
        presetWebFonts()],
    })],
})
