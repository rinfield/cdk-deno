import { LambdaRuntime } from "./lambda-deno/runtime.ts";

async function handler(event: unknown, context: unknown) {
  console.log(JSON.stringify(context, null, 2));
  console.log(JSON.stringify(event, null, 2));
}

const runtime = await LambdaRuntime.initialize();
console.log("initialize completed. event loop");
await runtime.run(handler);
