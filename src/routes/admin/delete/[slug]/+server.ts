import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteCachedLinkBySlug } from '$lib/server/link-cache';
import { resolve } from '$app/paths';

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const deleteBySlug = async (platform: App.Platform | undefined, slug: string) => {
	const db = platform?.env?.nanao;
	if (!db) throw error(500, { message: 'Database not available' });

	if (!SLUG_PATTERN.test(slug)) {
		throw error(400, { message: 'Invalid slug format' });
	}

	const res = await db.prepare('DELETE FROM links WHERE slug = ?1').bind(slug).run();

	if ((res.meta?.changes ?? 0) === 0) {
		throw error(404, { message: 'Slug not found' });
	}

	platform?.context.waitUntil(deleteCachedLinkBySlug(platform, slug));

	return { slug };
};

export const POST: RequestHandler = async ({ platform, params }) => {
	await deleteBySlug(platform, params.slug);
	redirect(303, resolve('/admin'));
};

export const DELETE: RequestHandler = async ({ platform, params }) => {
	const { slug } = await deleteBySlug(platform, params.slug);

	return json({ slug, deleted: true });
};
