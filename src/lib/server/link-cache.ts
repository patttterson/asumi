const CACHE_TTL_SECONDS = 300; // 5 minutes
const CACHE_BASE_URL = 'https://asumi-cache.internal';

type CachedLink = {
	id: string;
	slug: string;
	url: string;
};

const buildCacheUrl = (slug: string) => `${CACHE_BASE_URL}/links/${encodeURIComponent(slug)}`;

const getEdgeCache = (platform: App.Platform | undefined) => {
	if (platform?.caches?.default) return platform.caches.default;

	const globalCacheStorage = globalThis.caches as (CacheStorage & { default?: Cache }) | undefined;
	return globalCacheStorage?.default;
};

export const getCachedLinkBySlug = async (
	platform: App.Platform | undefined,
	slug: string
): Promise<CachedLink | null> => {
	const cache = getEdgeCache(platform);
	if (!cache) return null;

	const cacheRequest = new Request(buildCacheUrl(slug), { method: 'GET' });
	const cached = await cache.match(cacheRequest);
	if (!cached) return null;

	try {
		return (await cached.json()) as CachedLink;
	} catch {
		return null;
	}
};

export const setCachedLinkBySlug = async (
	platform: App.Platform | undefined,
	link: CachedLink
): Promise<void> => {
	const cache = getEdgeCache(platform);
	if (!cache) return;

	const cacheRequest = new Request(buildCacheUrl(link.slug), { method: 'GET' });
	const response = new Response(JSON.stringify(link), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, max-age=${CACHE_TTL_SECONDS}`
		}
	});

	await cache.put(cacheRequest, response);
};

export const deleteCachedLinkBySlug = async (
	platform: App.Platform | undefined,
	slug: string
): Promise<void> => {
	const cache = getEdgeCache(platform);
	if (!cache) return;

	const cacheRequest = new Request(buildCacheUrl(slug), { method: 'GET' });
	await cache.delete(cacheRequest);
};
