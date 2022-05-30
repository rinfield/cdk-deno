import { stack } from "./app";
import { Template } from "aws-cdk-lib/assertions";

test("snapshot", () => {
  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});