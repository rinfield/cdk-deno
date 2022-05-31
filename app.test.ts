import { assertSnapshot, Template } from "./deps.ts";
import { stack } from "./app.ts";

Deno.test("snapshot", async (t) => {
  await assertSnapshot(t, Template.fromStack(stack).toJSON());
});
