import { cdk, firehose, firehoseTo, logs, s3 } from "./deps.ts";

const app = new cdk.App();
export const stack = new cdk.Stack(app, "MyStack");
new logs.LogGroup(stack, "MyLogGroup");

const firehoseDestBucket = new s3.Bucket(stack, "FirehoseDestBucket", {});
new firehose.DeliveryStream(stack, "FirehoseStream", {
  destinations: [
    new firehoseTo.S3Bucket(firehoseDestBucket),
  ],
});

app.synth();
