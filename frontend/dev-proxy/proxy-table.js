// local dev config when running the backend with docker compose
export const devProxy = {
  '/raster': {
    target: 'http://localhost',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/raster/, '/raster'),
  },
  '/vector': {
    target: 'http://localhost',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/vector/, '/vector'),
  },
  '/api': {
    target: 'http://localhost',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/api'),
  },
  '/pixel': {
    target: 'http://localhost',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/pixel/, '/pixel'),
  },
};
