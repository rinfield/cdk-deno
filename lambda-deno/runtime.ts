import * as runtimeType from "./types.ts";
import { InvocationContext, LambdaRuntimeApi } from "./runtime_api.ts";

interface RuntimeContext {
  env: runtimeType.RuntimeEnvVar;
}

export class LambdaRuntime {
  static async initialize(): Promise<LambdaRuntime> {
    try {
      return new LambdaRuntime(LambdaRuntime.getRuntimeContext());
    } catch (e) {
      await LambdaRuntimeApi.initializationError(e);
      Deno.exit(1);
    }
  }

  private constructor(private runtimeContext: RuntimeContext) {
  }

  async run(handler: runtimeType.Handler) {
    for await (const invocationContext of this.invocations()) {
      try {
        const response = await handler(
          invocationContext.event,
          this.newHandlerContext(invocationContext),
          undefined as any,
        );

        await LambdaRuntimeApi.invocationResponse(
          invocationContext.awsRequestId,
          response,
        );
      } catch (e) {
        await LambdaRuntimeApi.invocationError(
          invocationContext.awsRequestId,
          e,
        );
      }
    }
  }

  private static getRuntimeContext(): RuntimeContext {
    const env = Object.fromEntries(
      runtimeType.ENV_VAR_NAMES.map((k) => {
        const v = Deno.env.get(k);
        if (!v) throw new Error(`Env '${k}' is not provided`);
        return [k, v];
      }),
    ) as runtimeType.RuntimeEnvVar;
    return { env };
  }

  private async *invocations() {
    while (true) {
      yield LambdaRuntimeApi.nextInvocation();
    }
  }

  private newHandlerContext(
    invocationEvent: InvocationContext,
  ): runtimeType.Context {
    const {
      AWS_LAMBDA_FUNCTION_NAME: functionName,
      AWS_LAMBDA_FUNCTION_VERSION: functionVersion,
      AWS_LAMBDA_FUNCTION_MEMORY_SIZE: memoryLimitInMB,
      AWS_LAMBDA_LOG_GROUP_NAME: logGroupName,
      AWS_LAMBDA_LOG_STREAM_NAME: logStreamName,
    } = this.runtimeContext.env;
    const { awsRequestId, invokedFunctionArn, deadlineMs } = invocationEvent;

    return {
      functionName,
      functionVersion,
      memoryLimitInMB,
      logGroupName,
      logStreamName,

      awsRequestId,
      invokedFunctionArn,
      getRemainingTimeInMillis: () => deadlineMs - Date.now(),
      clientContext: undefined, // TODO
      identity: undefined, // TODO

      callbackWaitsForEmptyEventLoop: false,

      done: undefined as any,
      fail: undefined as any,
      succeed: undefined as any,
    };
  }
}
