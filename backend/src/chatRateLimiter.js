import { Redis } from '@upstash/redis';

const HOURLY_WINDOW_SECONDS = 60 * 60;
const DAILY_WINDOW_SECONDS = 24 * 60 * 60;
const DEFAULT_MAX_REQUESTS_PER_HOUR = 20;
const DEFAULT_MAX_TOKENS_PER_DAY = 12_000;
const ESTIMATED_MAX_COMPLETION_TOKENS = 300;

let redisClient;

const parseLimit = (value, fallback) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const getRedisClient = () => {
    if (redisClient !== undefined) return redisClient;

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    redisClient = redisUrl && redisToken
        ? new Redis({ url: redisUrl, token: redisToken })
        : null;
    return redisClient;
};

export const estimateChatTokens = (messages) => {
    const inputCharacters = messages.reduce(
        (total, message) => total + message.content.length,
        0
    );

    return Math.ceil(inputCharacters / 4) + ESTIMATED_MAX_COMPLETION_TOKENS;
};

export const checkChatRateLimit = async ({ identity, messages }) => {
    if (!identity) {
        return { status: 'unavailable', error: 'Unable to identify this request.' };
    }

    const redis = getRedisClient();
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    if (!redis) {
        if (isProduction) {
            return { status: 'unavailable', error: 'Chat rate limiting is not configured.' };
        }

        return { status: 'allowed' };
    }

    const maxRequestsPerHour = parseLimit(
        process.env.CHAT_MAX_REQUESTS_PER_HOUR,
        DEFAULT_MAX_REQUESTS_PER_HOUR
    );
    const maxTokensPerDay = parseLimit(
        process.env.CHAT_MAX_TOKENS_PER_DAY,
        DEFAULT_MAX_TOKENS_PER_DAY
    );
    const estimatedTokens = estimateChatTokens(messages);
    const requestKey = `chat:requests:${identity}`;
    const tokenKey = `chat:tokens:${identity}`;

    try {
        const results = await redis
            .pipeline()
            .incr(requestKey)
            .expire(requestKey, HOURLY_WINDOW_SECONDS)
            .incrby(tokenKey, estimatedTokens)
            .expire(tokenKey, DAILY_WINDOW_SECONDS)
            .exec();

        const requestCount = Number(results[0]);
        const tokenCount = Number(results[2]);

        if (requestCount > maxRequestsPerHour || tokenCount > maxTokensPerDay) {
            return {
                status: 'limited',
                retryAfterSeconds: requestCount > maxRequestsPerHour
                    ? HOURLY_WINDOW_SECONDS
                    : DAILY_WINDOW_SECONDS
            };
        }

        return { status: 'allowed' };
    } catch (error) {
        console.error('Chat rate limiter error:', error);
        return { status: 'unavailable', error: 'Chat protection is temporarily unavailable.' };
    }
};
