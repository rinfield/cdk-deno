import cdk from "https://esm.sh/aws-cdk-lib@2.26.0?deps=constructs@10.1.23";
import logs from "https://esm.sh/aws-cdk-lib@2.26.0/aws-logs?deps=constructs@10.1.23";
import s3 from "https://esm.sh/aws-cdk-lib@2.26.0/aws-s3?deps=constructs@10.1.23";
import firehose from "https://esm.sh/@aws-cdk/aws-kinesisfirehose-alpha@2.26.0-alpha.0?deps=constructs@10.1.23";
import firehoseDestinations from "https://esm.sh/@aws-cdk/aws-kinesisfirehose-destinations-alpha@2.26.0-alpha.0?deps=constructs@10.1.23";

const app = new cdk.App();
export const stack = new cdk.Stack(app, "MyStack");
new logs.LogGroup(stack, "MyLogGroup");

const firehoseDestBucket = new s3.Bucket(stack, "FirehoseDestBucket", {});
new firehose.DeliveryStream(stack, "FirehoseStream", {
  destinations: [
    new firehoseDestinations.S3Bucket(firehoseDestBucket),
  ],
});

app.synth();
