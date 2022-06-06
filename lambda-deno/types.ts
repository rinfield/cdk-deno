export * from "https://esm.sh/@types/aws-lambda@8.10.97/handler.d.ts";

export const ENV_VAR_NAME_RUNTIME_API = "AWS_LAMBDA_RUNTIME_API";

export const ENV_VAR_NAMES = [
  "_HANDLER",
  "AWS_LAMBDA_FUNCTION_NAME",
  "AWS_LAMBDA_FUNCTION_MEMORY_SIZE",
  "AWS_LAMBDA_FUNCTION_VERSION",
  "AWS_LAMBDA_INITIALIZATION_TYPE",
  "AWS_LAMBDA_LOG_GROUP_NAME",
  "AWS_LAMBDA_LOG_STREAM_NAME",
  ENV_VAR_NAME_RUNTIME_API,
  "AWS_REGION",
  "LAMBDA_TASK_ROOT",
  "LAMBDA_RUNTIME_DIR",
  "TZ",
] as const;

export type RuntimeEnvVar = {
  [key in typeof ENV_VAR_NAMES[number]]: string;
};

export const REQUEST_HEADER_FUNCTION_ERROR_TYPE =
  "Lambda-Runtime-Function-Error-Type";
export interface ErrorRequestHeader {
  [REQUEST_HEADER_FUNCTION_ERROR_TYPE]:
    | InitializationErrorType
    | InvocationErrorType;
}

export type InitializationErrorType =
  | "Runtime.NoSuchHandler"
  | "Runtime.APIKeyNotFound"
  | "Runtime.ConfigInvalid"
  | "Runtime.UnknownReason";
export type InvocationErrorType =
  | "Runtime.NoSuchHandler"
  | "Runtime.APIKeyNotFound"
  | "Runtime.ConfigInvalid"
  | "Runtime.UnknownReason";

export interface ErrorRequest {
  errorMessage: string;
  errorType: string;
  stackTrace: string[];
}

export type HttpMethod = "GET" | "POST";

export type InitializationErrorResponseCodes =
  | 202 // Accepted
  | 403 // Forbidden
  | 500; // Container error. Non-recoverable state. Runtime should exit promptly.
export type InvocationErrorResponseCodes =
  | 202 // Accepted
  | 400 // Bad Request
  | 403 // Forbidden
  | 500; // Container error. Non-recoverable state. Runtime should exit promptly.

export const NEXT_API_RESPONSE_HEADERS = [
  /**
   * The request ID, which identifies the request that triggered the function invocation.
   * For example, `8476a536-e9f4-11e8-9739-2dfe598c3fcd`.
   */
  "Lambda-Runtime-Aws-Request-Id",
  /**
   * The date that the function times out in Unix time milliseconds.
   * For example, `1542409706888`.
   */
  "Lambda-Runtime-Deadline-Ms",
  /**
   * The ARN of the Lambda function, version, or alias that's specified in the invocation.
   * For example, `arn:aws:lambda:us-east-2:123456789012:function:custom-runtime`.
   */
  "Lambda-Runtime-Invoked-Function-Arn",
  /**
   * The AWS X-Ray tracing header.
   * For example, Root=1-5bef4de7-ad49b0e87f6ef6c87fc2e700;Parent=9a9197af755a6419;Sampled=1.
   */
  "Lambda-Runtime-Trace-Id",
  /** For invocations from the AWS Mobile SDK, data about the client application and device. */
  "Lambda-Runtime-Client-Context",
  /**  For invocations from the AWS Mobile SDK, data about the Amazon Cognito identity provider. */
  "Lambda-Runtime-Cognito-Identity",
] as const;

export type NextApiResponseHeaders = {
  [key in typeof NEXT_API_RESPONSE_HEADERS[number]]: string;
};
