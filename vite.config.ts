import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'path';

export default defineConfig({
	plugins: [vue(), vueDevTools()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@sysvale': path.resolve(__dirname, 'node_modules/@sysvale'),
		},
	},
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'CitizenComponents',
			formats: ['es', 'cjs'],
			fileName: format => `citizen-components.${format}.js`,
		},
		rollupOptions: {
			external: ['vue', '@sysvale/cuida', 'lodash'],
			output: {
				globals: {
					vue: 'Vue',
					'@sysvale/cuida': 'Cuida',
					lodash: '_',
				},
				assetFileNames: assetInfo => {
					if (assetInfo.name === 'style.css') {
						return 'citizen-components.css';
					}
					return assetInfo.name || '';
				},
			},
		},
		cssCodeSplit: false,
	},
});
