<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.redirect === false}
	<p>Redirect disabled.</p>
	<p>
		Destination:
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={data.url} rel="noreferrer" target="_blank">{data.url}</a>
	</p>
{:else}
	<p>Redirecting…</p>
{/if}
