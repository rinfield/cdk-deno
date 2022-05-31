import awsCdkLib from "https://esm.sh/aws-cdk-lib@2.26.0?deps=constructs@10.1.23";
export const cdk = awsCdkLib;
export const { aws_s3: s3, aws_logs: logs } = awsCdkLib;

export { default as firehose } from "https://esm.sh/@aws-cdk/aws-kinesisfirehose-alpha@2.26.0-alpha.0?deps=constructs@10.1.23";
export { default as firehoseTo } from "https://esm.sh/@aws-cdk/aws-kinesisfirehose-destinations-alpha@2.26.0-alpha.0?deps=constructs@10.1.23";

// test
export { assertSnapshot } from "https://deno.land/std@0.141.0/testing/snapshot.ts";
export const { Template } = awsCdkLib.assertions;
