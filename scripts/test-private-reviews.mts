import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { User } from "../src/lib/auth";
import { submitPrivateReview, type ReviewKind } from "../src/lib/privateReview";
import { ReviewForm } from "../src/components/staff/ReviewForm";

function form(over: Record<string, string> = {}) {
  const value = new FormData();
  for (const [key, item] of Object.entries({ id: "123", state: "confirmed", note: "Receipt reference", ...over })) value.set(key, item);
  return value;
}
const user = (role: string) => ({ steam_id: "76561198000000001", role } as User);

for (const kind of ["delivery", "ticket"] as ReviewKind[]) {
  for (const role of [null, "player", "staff", "lead", "owner"]) {
    let calls = 0;
    const result = await submitPrivateReview(kind, form({ state: kind === "delivery" ? "confirmed" : "reviewed" }), {
      user: async () => role ? user(role) : null,
      post: async (_path, actor, body) => { calls++; assert.equal(actor.role, role); assert.equal(body.note, "Receipt reference"); return { ok: true, data: { saved: true } }; },
    });
    const allowed = kind === "delivery" ? role === "owner" : ["staff", "lead", "owner"].includes(role ?? "");
    assert.equal(result.saved === true, allowed);
    assert.equal(calls, allowed ? 1 : 0, `${kind} ${role} must not bypass authorization`);
  }
}

const invalidForms: Record<string, string>[] = [{ id: "123/path" }, { id: "0" }, { id: "-1" }, { state: "replay_payment" }, { note: " " }, { note: "a".repeat(1001) }];
for (const invalid of invalidForms) {
  let calls = 0;
  const result = await submitPrivateReview("delivery", form(invalid), { user: async () => user("owner"), post: async () => { calls++; return { ok: true, data: {} }; } });
  assert.ok(result.error); assert.equal(calls, 0);
}

const note = '<script>alert("private")</script> & receipt';
const saved = await submitPrivateReview("delivery", form({ note: ` ${note} `, actor: "forged", role: "owner" }), {
  user: async () => user("owner"), post: async (path, actor, body) => {
    assert.equal(path, "/v1/finance/123/delivery"); assert.equal(actor.steam_id, "76561198000000001");
    assert.deepEqual(body, { state: "confirmed", note }); return { ok: true, data: {} };
  },
});
assert.ok(saved.saved);
const failed = await submitPrivateReview("ticket", form({ state: "hold" }), { user: async () => user("staff"), post: async () => ({ ok: false, error: "Review storage unavailable" }) });
assert.deepEqual(failed, { error: "Review storage unavailable" });

const html = renderToStaticMarkup(createElement(ReviewForm, { kind: "delivery", id: "123", state: "unknown", note }));
assert.ok(!html.includes('<script>alert("private")</script>'));
assert.ok(html.includes('&lt;script&gt;'));
assert.match(html, /maxlength="1000"/i);
assert.ok(html.includes('name="note"'));
console.log("private review authorization, POST payload, failure and note rendering tests passed");
