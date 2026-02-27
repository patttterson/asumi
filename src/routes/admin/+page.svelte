<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	export let data: PageData;

	const resolvedRoot = resolve('/');
	const normalizedRoot = resolvedRoot.endsWith('/') ? resolvedRoot : `${resolvedRoot}/`;
	const slugPrefix = `${page.url.origin.replace(/^https?:\/\//, '')}${normalizedRoot}`;

	let armedSlug: string | null = null;

	const handleDeleteClick = (event: MouseEvent, slug: string) => {
		if (event.shiftKey) {
			armedSlug = null;
			return;
		}

		if (armedSlug !== slug) {
			event.preventDefault();
			armedSlug = slug;
			return;
		}

		armedSlug = null;
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/fontawesome.min.css"
		integrity="sha512-M5Kq4YVQrjg5c2wsZSn27Dkfm/2ALfxmun0vUE3mPiJyK53hQBHYCVAtvMYEC7ZXmYLg8DVG4tF8gD27WmDbsg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/solid.min.css"
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<h1>admin portal</h1>

<form class="create-form" method="POST" action={resolve('/admin/create')}>
	<div class="slug-field">
		<span class="prefix" id="slug-prefix">{slugPrefix}</span>
		<input
			type="text"
			name="slug"
			placeholder="newjeans"
			required
			pattern="[a-zA-Z0-9_-]+"
			aria-describedby="slug-prefix"
			style="padding-left: 0;"
		/>
	</div>

	<input type="url" name="url" placeholder="https://example.com" required />
	<button type="submit">Create</button>
</form>

<h2 style="margin-bottom: 0;">Links</h2>

{#if data.links.length === 0}
	<p>No links yet, make one above</p>
{:else}
	<ul class="links-list">
		{#each data.links as link (link.slug)}
			<li class="link-row">
				<a href={resolve(`/${link.slug}`)} target="_blank" rel="noreferrer">/{link.slug}</a>
				<div class="link-actions">
					<span>{link.clicks} click{link.clicks !== 1 ? 's' : ''}</span>
					<form method="POST" action={resolve(`/admin/delete/${encodeURIComponent(link.slug)}`)}>
						<button
							type="submit"
							class:delete-armed={armedSlug === link.slug}
							aria-label={`Delete /${link.slug}`}
							onclick={(event) => handleDeleteClick(event, link.slug)}
						>
							<i class="fa-solid fa-trash"></i>
						</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.create-form {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		margin-top: 1em;
	}

	.slug-field {
		display: flex;
		align-items: stretch;
		border: 2px solid oklch(68.583% 0.06854 260.692);
		border-radius: 4px;
		overflow: hidden;
	}

	.prefix {
		display: flex;
		align-items: center;
		padding: 0.5em;
		padding-right: 0;
		color: oklch(90.365% 0.0001 271.152);
		white-space: nowrap;
		user-select: none;
	}

	input {
		padding: 0.5em;
		font-size: 1em;
		border: 2px solid oklch(68.583% 0.06854 260.692);
		border-radius: 4px;
		background-color: transparent;
		color: inherit;
		font-family: inherit;
	}

	.slug-field input {
		border: 0;
		border-radius: 0;
		width: 100%;
		min-width: 0;
	}

	.slug-field:focus-within {
		border-color: oklch(0.9031 0.0468 261.36);
	}

	input:focus {
		outline: none;
		border-color: oklch(0.9031 0.0468 261.36);
	}

	input:focus::placeholder {
		color: transparent;
	}

	button {
		padding: 0.5em;
		font-size: 1em;
		border: none;
		border-radius: 4px;
		background-color: oklch(0.9031 0.0468 261.36);
		color: black;
		cursor: pointer;
		font-family: inherit;
	}

	button:hover {
		background-color: oklch(0.9031 0.0468 261.36 / 0.8);
	}

	.links-list {
		list-style: none;
		padding: 0;
		margin: 1em 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.link-row {
		display: flex;
		align-items: center;
		gap: 0.75em;
		flex-wrap: wrap;
	}

	.link-row form {
		margin: 0;
	}

	.link-actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.75em;
	}

	.delete-armed {
		background-color: oklch(62% 0.22 27);
		color: white;
	}

	.delete-armed:hover {
		background-color: oklch(62% 0.22 27 / 0.8);
	}
</style>
