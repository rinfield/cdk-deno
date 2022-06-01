import { cdk, firehose, firehoseTo, lambdaNodejs, logs, s3 } from "./deps.ts";

const app = new cdk.App();
export const stack = new cdk.Stack(app, "MyStack");
new logs.LogGroup(stack, "MyLogGroup");

const firehoseDestBucket = new s3.Bucket(stack, "FirehoseDestBucket", {});
new firehose.DeliveryStream(stack, "FirehoseStream", {
  destinations: [
    new firehoseTo.S3Bucket(firehoseDestBucket),
  ],
});

// npm install --save-dev esbuild@0
new lambdaNodejs.NodejsFunction(stack, "LambdaNodejsFunction", {
  entry: "./app.LambdaNodejsFunction.ts",
  bundling: {
    dockerImage: new cdk.DockerImage(""),
  },
});

app.synth();
