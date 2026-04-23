import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import {readFileSync} from 'fs';
import {join} from 'path';

const {dependencies = {}, peerDependencies = {}, camelCaseName} = JSON.parse(readFileSync('package.json').toString());

export default defineConfig(({mode}) => {
	const isUmdBuild = mode === 'umd';

	return {
		plugins: isUmdBuild
			? []
			: [
					dts({
						tsconfigPath: './tsconfig.lib.json',
					}),
				],
		test: {
			globals: true,
		},
		build: {
			emptyOutDir: !isUmdBuild,
			sourcemap: true,
			lib: {
				formats: isUmdBuild ? ['umd'] : ['cjs', 'es'],
				entry: join('src', 'lib', 'index.ts'),
				name: camelCaseName,
				fileName: (format) => {
					switch (format) {
						case 'cjs':
							return `index.cjs`;
						case 'umd':
							return `index.umd.js`;
						case 'es':
							return `index.js`;
					}
				},
			},
			rollupOptions: {
				// Externalize deps for ESM/CJS like tsup, but keep UMD more self-contained.
				external: isUmdBuild ? Object.keys(peerDependencies) : [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
				output: {
					// Provide global variables to use in the UMD build
					// for externalized deps
					globals: {
						// for example react: 'React'
					},
				},
			},
		},
	};
});
