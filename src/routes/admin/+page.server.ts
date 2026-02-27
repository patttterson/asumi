import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Link } from '$lib/types';

type AdminLink = Pick<Link, 'slug' | 'url' | 'created_at' | 'clicks' | 'last_clicked_at'>;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	const db = platform?.env?.nanao;
	if (!db) throw error(500, { message: 'Database not available' });

	const links = await db
		.prepare(
			'SELECT slug, url, created_at, clicks, last_clicked_at FROM links ORDER BY created_at DESC'
		)
		.all<AdminLink>();

	return {
		links: links.results
	};
};
