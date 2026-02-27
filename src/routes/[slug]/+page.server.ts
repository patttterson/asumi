import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCachedLinkBySlug, setCachedLinkBySlug } from '$lib/server/link-cache';

export const load: PageServerLoad = async ({ params, platform, url }) => {
	const db = platform?.env?.nanao;
	if (!db) throw error(500, { message: 'Database not available' });

	const slug = params.slug;
	const shouldRedirect = url.searchParams.get('redirect') !== 'no';

	const cachedLink = await getCachedLinkBySlug(platform, slug);

	if (cachedLink) {
		db.prepare(
			"UPDATE links SET clicks = clicks + 1, last_clicked_at = datetime('now') WHERE id = ?"
		)
			.bind(cachedLink.id)
			.run()
			.catch(() => {});

		if (shouldRedirect) {
			redirect(302, cachedLink.url);
		}

		return {
			slug,
			url: cachedLink.url,
			redirect: false
		};
	}

	const link = await db
		.prepare('SELECT id, url FROM links WHERE slug = ?')
		.bind(slug)
		.first<{ id: string; url: string }>();

	if (!link) throw error(404, { message: 'Not Found' });

	platform?.context.waitUntil(setCachedLinkBySlug(platform, { id: link.id, slug, url: link.url }));

	db.prepare("UPDATE links SET clicks = clicks + 1, last_clicked_at = datetime('now') WHERE id = ?")
		.bind(link.id)
		.run()
		.catch(() => {});

	if (shouldRedirect) {
		redirect(302, link.url);
	}

	return {
		slug,
		url: link.url,
		redirect: false
	};
};
