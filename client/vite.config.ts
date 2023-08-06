import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		// cors: false,
		proxy: {
			'/api': {
				target: 'https://momentify-server.onrender.com',
				// changeOrigin: true,
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
