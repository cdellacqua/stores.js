import {defineConfig} from 'vite';
import {readFileSync} from 'fs';
import {resolve, join, dirname} from 'path';
import {fileURLToPath} from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

const {devDependencies, peerDependencies, camelCaseName} = JSON.parse(readFileSync(join(currentDir, 'package.json')));

export default defineConfig({
	build: {
		lib: {
			formats: ['cjs', 'umd', 'es'],
			entry: resolve(currentDir, 'src', 'lib', 'index.ts'),
			name: camelCaseName,
			fileName: (format) => (format === 'cjs' ? 'index.cjs' : `index.${format}.js`),
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [...Object.keys(devDependencies || {}), ...Object.keys(peerDependencies || {})],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					// for example react: 'React'
				},
			},
		},
	},
});
