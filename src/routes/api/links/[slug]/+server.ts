import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Link } from '$lib/types';

export const GET: RequestHandler = async ({ platform, params }) => {
	const db = platform?.env?.nanao;
	if (!db) error(500, { message: 'Database not available' });

	const slug = params.slug;

	const link = await db.prepare('SELECT * FROM links WHERE slug = ?').bind(slug).first<Link>();

	if (!link) error(404, { message: 'Not Found' });

	return json(link);
};
