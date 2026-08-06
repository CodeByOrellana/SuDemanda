type Bucket = {
	count: number;
	resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
	key: string,
	limit: number,
	windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
	const now = Date.now();
	const entry = buckets.get(key);

	if (!entry || entry.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
	}

	entry.count += 1;
	return {
		ok: entry.count <= limit,
		remaining: Math.max(0, limit - entry.count),
		resetAt: entry.resetAt
	};
}
