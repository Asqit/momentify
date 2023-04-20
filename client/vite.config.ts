import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: false,
				secure: false,
			},
		},
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'src'),
		},
	},
	plugins: [react()],
});
