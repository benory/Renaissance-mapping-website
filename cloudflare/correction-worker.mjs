const siteverify = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const entryVariables = {
    event_id: "GOOGLE_FORM_ENTRY_EVENT_ID",
    description: "GOOGLE_FORM_ENTRY_DESCRIPTION",
    email: "GOOGLE_FORM_ENTRY_EMAIL"
};
const maxBodyLength = 65536;

export default {
    async fetch(request, env) {
        const origin = request.headers.get("Origin");
        const allowedOrigins = (env.ALLOWED_ORIGINS || "").split(",").map(value => value.trim());
        if (!origin || !allowedOrigins.includes(origin)) return new Response(null, { status: 403 });

        const corsHeaders = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Vary": "Origin",
            "Cache-Control": "no-store"
        };
        const json = (body, status) => Response.json(body, { status, headers: corsHeaders });
        const fail = status => json({ ok: false }, status);

        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
        if (request.method !== "POST") return fail(405);
        if (!request.headers.get("Content-Type")?.startsWith("application/x-www-form-urlencoded")) return fail(415);
        if (Number(request.headers.get("Content-Length")) > maxBodyLength) return fail(413);
        if (!env.TURNSTILE_SECRET_KEY
            || !/^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/formResponse$/.test(env.GOOGLE_FORM_POST_URL)
            || !Object.values(entryVariables).every(key => /^entry\.\d+$/.test(env[key]))) {
            return fail(503);
        }

        try {
            const body = await request.text();
            if (body.length > maxBodyLength) return fail(413);
            const data = new URLSearchParams(body);
            const eventId = data.get("event_id")?.trim();
            const description = data.get("description")?.trim();
            const email = data.get("email")?.trim();
            const token = data.get("cf-turnstile-response");
            if (!/^\d{5}$/.test(eventId) || !description || description.length > 5000
                || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(email)
                || !token || token.length > 2048) {
                return fail(400);
            }

            const verification = await fetch(siteverify, {
                method: "POST",
                body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
                signal: AbortSignal.timeout(7000)
            });
            if (!verification.ok) return fail(502);
            const result = await verification.json();
            if (!result.success || result.action !== "event-correction" || result.hostname !== new URL(origin).hostname) {
                return fail(400);
            }

            const response = await fetch(env.GOOGLE_FORM_POST_URL, {
                method: "POST",
                body: new URLSearchParams({
                    [env[entryVariables.event_id]]: eventId,
                    [env[entryVariables.description]]: description,
                    [env[entryVariables.email]]: email,
                    fvv: "1",
                    pageHistory: "0"
                }),
                redirect: "error",
                signal: AbortSignal.timeout(7000)
            });
            return response.ok ? json({ ok: true }, 200) : fail(502);
        } catch {
            return fail(502);
        }
    }
};
