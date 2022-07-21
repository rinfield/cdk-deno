// cdk-lib
import awsCdkLib from "https://esm.sh/aws-cdk-lib@2.32.1?deps=constructs@10.1.49";
export const cdk = awsCdkLib;
export const { aws_s3: s3, aws_logs: logs } = awsCdkLib;

export { default as firehose } from "https://esm.sh/@aws-cdk/aws-kinesisfirehose-alpha@2.32.1-alpha.0?deps=constructs@10.1.49";
export { default as firehoseTo } from "https://esm.sh/@aws-cdk/aws-kinesisfirehose-destinations-alpha@2.32.1-alpha.0?deps=constructs@10.1.49";

// cdk-cli
export { default as cdkCliLib } from "https://esm.sh/aws-cdk@2.32.1/lib";

// test
export { assertSnapshot } from "https://deno.land/std@0.148.0/testing/snapshot.ts";
export const { Template } = awsCdkLib.assertions;
