const runtimeApiEnvVarName = "AWS_LAMBDA_RUNTIME_API";
const reservedEnvVarNames = [
  "_HANDLER",
  "AWS_REGION",
  "AWS_LAMBDA_FUNCTION_NAME",
  "AWS_LAMBDA_FUNCTION_MEMORY_SIZE",
  "AWS_LAMBDA_FUNCTION_VERSION",
  "AWS_LAMBDA_INITIALIZATION_TYPE",
  "AWS_LAMBDA_LOG_GROUP_NAME",
  "AWS_LAMBDA_LOG_STREAM_NAME",
  runtimeApiEnvVarName,
  "LAMBDA_TASK_ROOT",
  "LAMBDA_RUNTIME_DIR",
  "TZ",
] as const;

type ReservedEnvVars = {
  [key in typeof reservedEnvVarNames[number]]: string;
};

type HttpMethod = "GET" | "POST";
interface LambdaRuntimeApiResquest {
  headers?: HeadersInit;
  body?: BodyInit;
}

interface InvocationEvent {
  awsRequestId: string;
  event: unknown;
}

class LambdaRuntimeApi {
  static async initializationError(_e: Error) {
    await this.callApi("POST", "/runtime/init/error");
  }

  static async nextInvocation(): Promise<InvocationEvent> {
    const response = await this.callApi("GET", "/runtime/invocation/next");

    const knownHeaderNames = [
      "Lambda-Runtime-Aws-Request-Id",
      "Lambda-Runtime-Deadline-Ms",
      "Lambda-Runtime-Invoked-Function-Arn",
      "Lambda-Runtime-Trace-Id",
      "Lambda-Runtime-Client-Context",
      "Lambda-Runtime-Cognito-Identity",
    ] as const;
    type KnownHeaders = {
      [key in typeof knownHeaderNames[number]]: string;
    };
    const knownHeaders = Object.fromEntries(
      knownHeaderNames.map((k) => [k, response.headers.get(k)]),
    ) as KnownHeaders;

    return {
      awsRequestId: knownHeaders["Lambda-Runtime-Aws-Request-Id"],
      event: JSON.parse(response.body?.toString() ?? "{}"),
    };
  }

  static async invocationResponse(awsRequestId: string, response: unknown) {
    await this.callApi("POST", `/runtime/invocation/${awsRequestId}/response`, {
      body: JSON.stringify(response),
    });
  }

  static async invocationError(awsRequestId: string, _e: Error) {
    await this.callApi("POST", `/runtime/invocation/${awsRequestId}/error`);
  }

  private static callApi(
    method: HttpMethod,
    path: string,
    options?: LambdaRuntimeApiResquest,
  ) {
    const url = `http://${
      Deno.env.get(runtimeApiEnvVarName)
    }/2018-06-01/${path}`;
    return fetch(url, {
      method,
      headers: options?.headers,
      body: options?.body,
    });
  }
}

interface LambdaRuntimeContext {
  env: ReservedEnvVars;
}
class LambdaRuntime {
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
    ) as ReservedEnvVars;
    return { env };
  }

  private async *nextEvent() {
    while (true) {
      yield LambdaRuntimeApi.nextInvocation();
    }
  }
}

async function handler(event: unknown, context: unknown) {
  console.log(JSON.stringify(context, null, 2));
  console.log(JSON.stringify(event, null, 2));
}

const runtime = await LambdaRuntime.initialize();
await runtime.run(handler);
