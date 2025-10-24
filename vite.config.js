import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  
  base: '/mnist-projects/', 

  build: {
    outDir: 'dist'
  }
});