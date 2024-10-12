// cdk-lib
import "constructs";
import * as awsCdkLib from "npm:aws-cdk-lib";

export const cdk = awsCdkLib;

export const { aws_s3: s3, aws_logs: logs } = awsCdkLib;

export { default as firehose } from "npm:@aws-cdk/aws-kinesisfirehose-alpha";
export { default as firehoseTo } from "npm:@aws-cdk/aws-kinesisfirehose-destinations-alpha";

// test
export { assertSnapshot } from "jsr:@std/testing/snapshot";
export const { Template } = awsCdkLib.assertions;
