<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.redirect === false}
	<p>Redirect disabled.</p>
	<p>
		Destination:
		<a href={resolve(data.url)} rel="noreferrer" target="_blank">{data.url}</a>
	</p>
{:else}
	<p>Redirecting…</p>
{/if}
