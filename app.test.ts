import { assertSnapshot } from "https://deno.land/std@0.141.0/testing/snapshot.ts";
import assertions from "https://esm.sh/aws-cdk-lib@2.26.0/assertions?deps=constructs@10.1.23";
import { stack } from "./app.ts";

Deno.test("snapshot", async (t) => {
  await assertSnapshot(t, assertions.Template.fromStack(stack).toJSON());
});
