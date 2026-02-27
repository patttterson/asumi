<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import blehh from '$lib/assets/blehh.webp';

	let errorCodeEl: HTMLHeadingElement;
	let errorMessageEl: HTMLHeadingElement;
	let imageEl: HTMLImageElement;
	let errorLineEl: HTMLDivElement;
	let stacked = false;

	const updateLayout = () => {
		if (!errorLineEl || !errorCodeEl || !errorMessageEl) {
			return;
		}

		const gap = 32;
		const lineWidth = errorLineEl.clientWidth;
		const codeWidth = errorCodeEl.scrollWidth;
		const messageWidth = errorMessageEl.scrollWidth;
		stacked = lineWidth < codeWidth + messageWidth + gap;
	};

	onMount(() => {
		updateLayout();
		window.addEventListener('resize', updateLayout);

		return () => {
			window.removeEventListener('resize', updateLayout);
		};
	});

	const mdnUrl = `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${page.status}`;
</script>

{#if stacked}
	<h1 id="error-code" style="margin-bottom: .5em;" bind:this={errorCodeEl}>
		<a href={mdnUrl} target="_blank" rel="noopener noreferrer">{page.status}</a>
	</h1>
{/if}
<img src={blehh} alt="Error" bind:this={imageEl} />
<div class="error-line" class:stacked bind:this={errorLineEl}>
	{#if !stacked}
		<h1 id="error-code" bind:this={errorCodeEl}>
			<a href={mdnUrl} target="_blank" rel="noopener noreferrer">{page.status}</a>
		</h1>
	{/if}
	<h1 id="error-message" bind:this={errorMessageEl}>{page.error?.message}</h1>
</div>

<style>
	img {
		width: clamp(220px, 70vw, 520px);
		height: auto;
		box-sizing: border-box;
		border: 4px solid white;
	}

	.error-line {
		display: flex;
		align-items: baseline;
		width: clamp(220px, 70vw, 520px);
		gap: 1rem;
	}

	.error-line.stacked {
		justify-content: flex-start;
	}

	#error-message {
		margin-left: auto;
		text-align: right;
		max-width: 100%;
		overflow-wrap: anywhere;
		word-break: break-word;
		white-space: normal;
	}

	.error-line.stacked #error-message {
		margin-left: 0;
		text-align: left;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
