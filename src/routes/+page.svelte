<script lang="ts">
  const showSource = typeof window !== 'undefined' && ['minji.love', 'localhost'].includes(window.location.hostname);
</script>

<div class="home">
	<div style="display: flex; align-items: baseline; gap: 0.5rem;">
		<h1 style="margin: 0;">asumi</h1>
		{#if showSource}
		  <h3 style="margin: 0;"><a href="https://github.com/patttterson/asumi">(source)</a></h3>
		{/if}
	</div>
	<p>patty's personal link shortener</p>
	<p class="tip">tip: add ?redirect=no to the URL to see the destination</p>
</div>

<style>
	.home {
		position: relative;
	}

	.tip {
		position: absolute;
		top: 100%;
		left: 0;
		margin: 0.5rem 0 0;
	}
</style>
