import { LambdaRuntime } from "./lambda-deno/runtime.ts";

const runtime = await LambdaRuntime.initialize();
await runtime.run((event: unknown, context: unknown) => {
  console.log(JSON.stringify(context, null, 2));
  console.log(JSON.stringify(event, null, 2));
});
