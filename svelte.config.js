import adapter from '@sveltejs/adapter-cloudflare';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		paths: {
			base: dev ? '' : '/s'
		},
		adapter: adapter({
			// See below for an explanation of these options
			config: undefined,
			platformProxy: {
				configPath: undefined,
				environment: undefined,
				persist: undefined
			},
			fallback: 'plaintext',
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	}
};

export default config;
