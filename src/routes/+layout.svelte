<script lang="ts">
	import '$lib/css/fonts.css';
	import { dev } from '$app/environment';

	let { children } = $props();

	const title = 'asumi' + (dev ? ' [dev]' : '');
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>{title}</title>
	<meta name="description" property="og:description" content="patty's personal link shortener" />
	<link rel="dns-prefetch" href="https://minji.love/" />
</svelte:head>

<div>
	{@render children()}
</div>

<style>
	:global(body) {
		font-family: 'Comfortaa', system-ui, sans-serif;
		background-color: oklch(20.5% 0 0);
		color: oklch(0.9031 0.0468 261.36);
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		margin: 0;
	}

	:global(::selection),
	:global(::-moz-selection) {
		background: rgba(255, 255, 255, 0.3);
	}

	:global(a) {
		color: oklch(0.9031 0.0468 261.36);
		text-decoration: none;
		font-weight: bold;
	}

	:global(a:hover) {
		text-decoration: underline;
	}
</style>
