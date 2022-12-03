// cdk-lib
import "npm:constructs@10.1.83";
import * as awsCdkLib from "npm:aws-cdk-lib@2.50.0";

export const cdk = awsCdkLib;

export const { aws_s3: s3, aws_logs: logs } = awsCdkLib;

export { default as firehose } from "npm:@aws-cdk/aws-kinesisfirehose-alpha@2.50.0-alpha.0";
export { default as firehoseTo } from "npm:@aws-cdk/aws-kinesisfirehose-destinations-alpha@2.50.0-alpha.0";

// test
export { assertSnapshot } from "https://deno.land/std@0.165.0/testing/snapshot.ts";
export const { Template } = awsCdkLib.assertions;
