// vite.config.js
import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  base: 'https://maximiliano-santana.github.io/github-pages',
  // build: [
  //   {
  //     from: '/resources/textures',
  //     to: '/assets'
  //   }
  // ]
});