import assert from "node:assert/strict";
import { test } from "node:test";
import worker from "../cloudflare/correction-worker.mjs";

const origin = "https://renaissancemapping.org";
const env = {
    ALLOWED_ORIGINS: origin,
    TURNSTILE_SECRET_KEY: "test-secret",
    GOOGLE_FORM_POST_URL: "https://docs.google.com/forms/d/e/test/formResponse",
    GOOGLE_FORM_ENTRY_EVENT_ID: "entry.123",
    GOOGLE_FORM_ENTRY_DESCRIPTION: "entry.456",
    GOOGLE_FORM_ENTRY_EMAIL: "entry.789"
};
const validVerification = {
    success: true,
    hostname: "renaissancemapping.org",
    action: "event-correction"
};

function correctionRequest(fields = {}, headers = { Origin: origin }) {
    return new Request("https://corrections.example", {
        method: "POST",
        headers,
        body: new URLSearchParams({
            event_id: "04688",
            description: "Check the date in the source.",
            email: "test@example.org",
            "cf-turnstile-response": "test-token",
            ...fields
        })
    });
}

function mockUpstream(context, verification = validVerification, googleStatus = 200) {
    return context.mock.method(globalThis, "fetch", async (url, options) => {
        if (url === env.GOOGLE_FORM_POST_URL) return new Response(null, { status: googleStatus });
        return Response.json(verification);
    });
}

test("the Worker forwards a verified correction with the exact event ID", async context => {
    const upstream = mockUpstream(context);
    const response = await worker.fetch(correctionRequest(), env);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
    const [siteverify, google] = upstream.mock.calls.map(call => call.arguments);
    assert.equal(siteverify[0], "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(siteverify[1].body.get("response"), "test-token");
    assert.equal(google[0], env.GOOGLE_FORM_POST_URL);
    assert.equal(google[1].body.get("entry.123"), "04688");
    assert.equal(google[1].body.get("entry.456"), "Check the date in the source.");
    assert.equal(google[1].body.get("entry.789"), "test@example.org");
    assert.equal(google[1].body.has("cf-turnstile-response"), false);
});

for (const mismatch of [{ success: false }, { hostname: "1520s-project.org" }, { action: "contact" }]) {
    test(`the Worker blocks a Turnstile result with ${Object.keys(mismatch)[0]} mismatch`, async context => {
        const upstream = mockUpstream(context, { ...validVerification, ...mismatch });
        const response = await worker.fetch(correctionRequest(), env);
        assert.equal(response.status, 400);
        assert.equal(upstream.mock.callCount(), 1);
    });
}

test("the Worker rejects incomplete reports and other origins before verification", async context => {
    const upstream = mockUpstream(context);
    const incomplete = await worker.fetch(correctionRequest({ description: "" }), env);
    const crossOrigin = await worker.fetch(correctionRequest({}, { Origin: "https://other.example" }), env);
    assert.equal(incomplete.status, 400);
    assert.equal(crossOrigin.status, 403);
    assert.equal(upstream.mock.callCount(), 0);
});

test("a Google Forms error yields a submission failure", async context => {
    mockUpstream(context, validVerification, 400);
    const response = await worker.fetch(correctionRequest(), env);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false });
});
