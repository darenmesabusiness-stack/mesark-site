import assert from "node:assert/strict";
import { supportInput } from "../src/lib/playerSupport";

function form(over: Record<string, string> = {}) {
  const f = new FormData();
  for (const [key, value] of Object.entries({request_id: "a8b761ba-6bde-4eb1-8310-cd618a2031de", body: "Please help", type: "general", cluster: "Duo", map: "Ragnarok", channel: "123", ...over})) f.set(key, value);
  return f;
}
assert.equal(supportInput(form())?.body, "Please help");
assert.equal(supportInput(form({body: "  hello  "}), true)?.body, "hello");
const invalid: Record<string, string>[] = [{type: "hof"}, {cluster: "other"}, {body: ""}, {body: "a".repeat(1801)}, {map: "a".repeat(61)}, {request_id: "other"}];
for (const over of invalid) assert.equal(supportInput(form(over)), null);
for (const channel of ["123/other", "1e5", "-1", "a".repeat(21)]) assert.equal(supportInput(form({channel}), true), null);
assert.equal("actor" in supportInput(form({actor: "forged identity"}))!, false);
console.log("player support input validation tests passed");
