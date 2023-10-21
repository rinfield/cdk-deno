// cdk-lib
import "constructs";
import * as awsCdkLib from "aws-cdk-lib";

export const cdk = awsCdkLib;

export const { aws_s3: s3, aws_logs: logs } = awsCdkLib;

export { default as firehose } from "firehose";
export { default as firehoseTo } from "firehoseTo";

// test
export { assertSnapshot } from "deno_std/testing/snapshot.ts";
export const { Template } = awsCdkLib.assertions;
