import * as runtimeType from "./types.ts";

export interface InvocationContext {
  event: unknown;

  awsRequestId: string;
  invokedFunctionArn: string;
  deadlineMs: number;
}

interface LambdaRuntimeApiResquest {
  headers?: HeadersInit;
  body?: BodyInit;
}

export class LambdaRuntimeApi {
  static async initializationError(e: Error) {
    const path = "/runtime/init/error";
    const errorType: runtimeType.InitializationErrorType =
      "Runtime.UnknownReason";
    const response = await this.callRuntimeApi("POST", path, {
      body: JSON.stringify(this.toErrorRequest(e)),
      headers: {
        [runtimeType.REQUEST_HEADER_FUNCTION_ERROR_TYPE]: errorType,
      },
    });
    await LambdaRuntimeApi.onOk(response);
  }

  static async nextInvocation(): Promise<InvocationContext> {
    const response = await this.callRuntimeApi(
      "GET",
      "/runtime/invocation/next",
    );

    return await this.onOk(response, async () => {
      const responseHeaders = Object.fromEntries(
        runtimeType.NEXT_API_RESPONSE_HEADERS.map((
          envName,
        ) => [envName, response.headers.get(envName)]),
      ) as runtimeType.NextApiResponseHeaders;

      return {
        awsRequestId: responseHeaders["Lambda-Runtime-Aws-Request-Id"],
        invokedFunctionArn:
          responseHeaders["Lambda-Runtime-Invoked-Function-Arn"],
        deadlineMs: parseInt(responseHeaders["Lambda-Runtime-Deadline-Ms"], 10),
        event: await response.json(),
      };
    });
  }

  static async invocationResponse(
    awsRequestId: string,
    handlerResponse: unknown,
  ) {
    const response = await this.callRuntimeApi(
      "POST",
      `/runtime/invocation/${awsRequestId}/response`,
      {
        body: JSON.stringify(handlerResponse),
      },
    );
    await this.onOk(response);
  }

  static async invocationError(awsRequestId: string, e: Error) {
    const path = `/runtime/invocation/${awsRequestId}/error`;
    const errorType: runtimeType.InitializationErrorType =
      "Runtime.UnknownReason";
    const response = await this.callRuntimeApi("POST", path, {
      body: JSON.stringify(this.toErrorRequest(e)),
      headers: {
        [runtimeType.REQUEST_HEADER_FUNCTION_ERROR_TYPE]: errorType,
      },
    });
    await LambdaRuntimeApi.onOk(response);
  }

  private static callRuntimeApi(
    method: runtimeType.HttpMethod,
    path: string,
    options?: LambdaRuntimeApiResquest,
  ) {
    const url = `http://${
      Deno.env.get(runtimeType.ENV_VAR_NAME_RUNTIME_API)
    }/2018-06-01${path}`;
    return fetch(url, {
      method,
      headers: options?.headers,
      body: options?.body,
    });
  }

  private static toErrorRequest(e: Error): runtimeType.ErrorRequest {
    return {
      errorMessage: e.message,
      errorType: e.name,
      stackTrace: e.stack ? [e.stack] : [],
    };
  }

  private static async onOk<T>(
    response: Response,
    f?: () => Promise<T>,
  ): Promise<T> {
    if (response.ok) {
      return f ? await f() : undefined as any;
    }

    if (response.status === 500) {
      console.error(
        `[${response.url}] shutting down lambda runtime since Runtime API responds container error & non-recoverable state.`,
      );
      this.exitRuntime();
    }

    throw new Error(
      `[${response.url}] => ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  static exitRuntime(): never {
    Deno.exit(1);
  }
}
