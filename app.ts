import cdk from "https://esm.sh/aws-cdk-lib@2.26.0";
import logs from "https://esm.sh/aws-cdk-lib@2.26.0/aws-logs";

const app = new cdk.App();
export const stack = new cdk.Stack(app, "MyStack");
new logs.LogGroup(stack, "MyLogGroup");

app.synth();
