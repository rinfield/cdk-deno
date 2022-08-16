// cdk-lib
import awsCdkLib from "aws-cdk-lib";
export const cdk = awsCdkLib;
export const { aws_s3: s3, aws_logs: logs } = awsCdkLib;

// TODO 最新のcdk-libを参照している？
export { default as firehose } from "aws-kinesisfirehose-alpha";
export { default as firehoseTo } from "aws-kinesisfirehose-destinations-alpha";

// test
export { assertSnapshot } from "https://deno.land/std@0.150.0/testing/snapshot.ts";
export const { Template } = awsCdkLib.assertions;
