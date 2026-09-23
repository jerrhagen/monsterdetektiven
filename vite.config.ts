import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build` packs the whole game (code, fonts, images, sounds)
// into a single dist/index.html that works when double-clicked.
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  server: { port: 5173, strictPort: true },
});
