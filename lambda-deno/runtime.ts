import * as lib from "./lib.ts";
import { LambdaRuntimeApi } from "./runtime_api.ts";

const reservedEnvVarNames = [
  "_HANDLER",
  "AWS_REGION",
  "AWS_LAMBDA_FUNCTION_NAME",
  "AWS_LAMBDA_FUNCTION_MEMORY_SIZE",
  "AWS_LAMBDA_FUNCTION_VERSION",
  "AWS_LAMBDA_INITIALIZATION_TYPE",
  "AWS_LAMBDA_LOG_GROUP_NAME",
  "AWS_LAMBDA_LOG_STREAM_NAME",
  lib.runtimeApiEnvVarName,
  "LAMBDA_TASK_ROOT",
  "LAMBDA_RUNTIME_DIR",
  "TZ",
] as const;

type ReservedEnv = {
  [key in typeof reservedEnvVarNames[number]]: string;
};

interface LambdaRuntimeContext {
  env: ReservedEnv;
}

export class LambdaRuntime {
  static async initialize(): Promise<LambdaRuntime> {
    try {
      return new LambdaRuntime(LambdaRuntime.getContext());
    } catch (e) {
      await LambdaRuntimeApi.initializationError(e);
      throw e;
    }
  }

  private constructor(private runtimeContext: LambdaRuntimeContext) {
  }

  async run(handler: (event: unknown, context: unknown) => Promise<unknown>) {
    for await (const invocationEvent of this.nextEvent()) {
      try {
        const response = await handler(
          invocationEvent.event,
          this.runtimeContext,
        );
        await LambdaRuntimeApi.invocationResponse(
          invocationEvent.awsRequestId,
          response,
        );
      } catch (e) {
        await LambdaRuntimeApi.invocationError(invocationEvent.awsRequestId, e);
      }
    }
  }

  private static getContext(): LambdaRuntimeContext {
    const env = Object.fromEntries(
      reservedEnvVarNames.map((k) => {
        const v = Deno.env.get(k);
        if (!v) throw new Error(`Env '${k}' is not provided`);
        return [k, v];
      }),
    ) as ReservedEnv;
    return { env };
  }

  private async *nextEvent() {
    while (true) {
      console.log("event loop..."); // XXX
      try {
        yield LambdaRuntimeApi.nextInvocation();
      } catch (e) {
        console.error(e);
        try {
          // await LambdaRuntimeApi.initializationError(e);
        } catch (e2) {
          console.error("runtime error recovering failed.");
          console.error("first error:");
          console.error(e);
          console.error("error on recovery:");
          console.error(e2);
        }
      }
    }
  }
}
