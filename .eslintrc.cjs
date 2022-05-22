module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019,
		project: 'tsconfig.json',
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'prettier/prettier': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'warn',
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
		'@typescript-eslint/no-misused-promises': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/switch-exhaustiveness-check': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{varsIgnorePattern: '^_', argsIgnorePattern: '^_'},
		],
	},
};
