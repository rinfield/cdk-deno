import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";

const app = new cdk.App();
export const stack = new cdk.Stack(app, "MyStack");
new logs.LogGroup(stack, "MyLogGroup");
