import * as lib from "./lib.ts";

interface InvocationContext {
  awsRequestId: string;
  event: unknown;
}

const errorTypeHeaderName = "Lambda-Runtime-Function-Error-Type";
interface ErrorRequestHeader {
  [errorTypeHeaderName]:
    | InitializationErrorType
    | InvocationErrorType;
}

type InitializationErrorType =
  | "Runtime.NoSuchHandler"
  | "Runtime.APIKeyNotFound"
  | "Runtime.ConfigInvalid"
  | "Runtime.UnknownReason";
type InvocationErrorType =
  | "Runtime.NoSuchHandler"
  | "Runtime.APIKeyNotFound"
  | "Runtime.ConfigInvalid"
  | "Runtime.UnknownReason";

interface ErrorRequest {
  errorMessage: string;
  errorType: string;
  stackTrace: string[];
}

type InitializationErrorResponseCodes =
  | 202 // Accepted
  | 403 // Forbidden
  | 500; // Container error. Non-recoverable state. Runtime should exit promptly.
type InvocationErrorResponseCodes =
  | 202 // Accepted
  | 400 // Bad Request
  | 403 // Forbidden
  | 500; // Container error. Non-recoverable state. Runtime should exit promptly.

type HttpMethod = "GET" | "POST";
interface LambdaRuntimeApiResquest {
  headers?: HeadersInit;
  body?: BodyInit;
}

const nextInvocationResponseHeaderNames = [
  "Lambda-Runtime-Aws-Request-Id",
  "Lambda-Runtime-Deadline-Ms",
  "Lambda-Runtime-Invoked-Function-Arn",
  "Lambda-Runtime-Trace-Id",
  "Lambda-Runtime-Client-Context",
  "Lambda-Runtime-Cognito-Identity",
] as const;
type NextInvocationResponseHeaders = {
  [key in typeof nextInvocationResponseHeaderNames[number]]: string;
};

export class LambdaRuntimeApi {
  static async initializationError(e: Error) {
    const path = "/runtime/init/error";
    const errorType: InitializationErrorType = "Runtime.UnknownReason";
    const response = await this.callApi("POST", path, {
      body: JSON.stringify(this.toErrorRequest(e)),
      headers: {
        [errorTypeHeaderName]: errorType,
      },
    });
    await LambdaRuntimeApi.handleErrorApiResponse(response);
  }

  static async nextInvocation(): Promise<InvocationContext> {
    const response = await this.callApi("GET", "/runtime/invocation/next");

    await this.handleApiResponse(response);

    const headers = Object.fromEntries(
      nextInvocationResponseHeaderNames.map((
        envName,
      ) => [envName, response.headers.get(envName)]),
    ) as NextInvocationResponseHeaders;

    return {
      awsRequestId: headers["Lambda-Runtime-Aws-Request-Id"],
      event: await response.json(),
    };
  }

  static async invocationResponse(
    awsRequestId: string,
    handlerResponse: unknown,
  ) {
    const response = await this.callApi(
      "POST",
      `/runtime/invocation/${awsRequestId}/response`,
      {
        body: JSON.stringify(handlerResponse),
      },
    );
    this.handleApiResponse(response);
  }

  static async invocationError(awsRequestId: string, e: Error) {
    const path = `/runtime/invocation/${awsRequestId}/error`;
    const errorType: InitializationErrorType = "Runtime.UnknownReason";
    const response = await this.callApi("POST", path, {
      body: JSON.stringify(this.toErrorRequest(e)),
      headers: {
        [errorTypeHeaderName]: errorType,
      },
    });
    await LambdaRuntimeApi.handleErrorApiResponse(response);
  }

  private static callApi(
    method: HttpMethod,
    path: string,
    options?: LambdaRuntimeApiResquest,
  ) {
    const url = `http://${
      Deno.env.get(lib.runtimeApiEnvVarName)
    }/2018-06-01${path}`;
    console.log(url); // XXX
    return fetch(url, {
      method,
      headers: options?.headers,
      body: options?.body,
    });
  }

  private static toErrorRequest(e: Error): ErrorRequest {
    return {
      errorMessage: e.message,
      errorType: e.name,
      stackTrace: e.stack ? [e.stack] : [],
    };
  }

  private static async handleApiResponse(response: Response) {
    if (response.ok) {
      return;
    }
    console.error(
      `[${response.url}] => ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  private static async handleErrorApiResponse(response: Response) {
    await this.handleApiResponse(response);
    if (response.status === 500) {
      console.error(
        `[${response.url}] shutting down lambda runtime since Runtime API responds container error & non-recoverable state.`,
      );
      Deno.exit(1);
    }
  }
}
