import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v7 as uuidv7 } from 'uuid';
import { deleteCachedLinkBySlug } from '$lib/server/link-cache';

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.nanao;
	if (!db) throw error(500, { message: 'Database not available' });

	const { slug, url } = Object.fromEntries(await request.formData()) as {
		slug: string;
		url: string;
	};

	if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
		throw error(400, { message: 'Invalid slug format' });
	}

	const id = uuidv7();

	const res = await db
		.prepare(`INSERT OR IGNORE INTO links (id, slug, url) VALUES (?1, ?2, ?3)`)
		.bind(id, slug, url)
		.run();

	if ((res.meta?.changes ?? 0) === 0) {
		throw error(409, { message: 'Slug already exists' });
	}

	platform?.context.waitUntil(deleteCachedLinkBySlug(platform, slug));

	redirect(303, '/admin');
};
