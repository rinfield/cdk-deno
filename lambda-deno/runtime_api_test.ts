import {
  assertEquals,
  assertSpyCall,
  assertSpyCalls,
  mockSessionAsync,
  returnsNext,
  stub,
  TempEnv,
} from "./test_deps.ts";
import { LambdaRuntimeApi } from "./runtime_api.ts";
import { ENV_VAR_NAME_RUNTIME_API } from "./types.ts";

function fetchReturns(...response: Response[]) {
  return stub(
    globalThis,
    "fetch",
    returnsNext(response.map((r) => Promise.resolve(r))),
  );
}

Deno.test("Successful API Call", async (testContext) => {
  const tmpEnv = TempEnv.replace(
    { [ENV_VAR_NAME_RUNTIME_API]: "localhost:9999" },
  );

  await testContext.step("a", async () => {
    await mockSessionAsync(async () => {
      // Given
      const stub = fetchReturns(
        new Response(JSON.stringify({ hello: 2 }), {
          headers: {
            "Lambda-Runtime-Aws-Request-Id":
              "8476a536-e9f4-11e8-9739-2dfe598c3fcd",
            "Lambda-Runtime-Deadline-Ms": "1542409706888",
            "Lambda-Runtime-Invoked-Function-Arn":
              "arn:aws:lambda:us-east-2:123456789012:function:custom-runtime",
          },
        }),
      );

      // When
      const actual = await LambdaRuntimeApi.nextInvocation();

      // Then
      assertEquals(actual, {
        awsRequestId: "8476a536-e9f4-11e8-9739-2dfe598c3fcd",
        deadlineMs: 1542409706888,
        invokedFunctionArn:
          "arn:aws:lambda:us-east-2:123456789012:function:custom-runtime",
        event: { hello: 2 },
      });
      assertSpyCalls(stub, 1);
      assertSpyCall(stub, 0, {
        args: ["http://localhost:9999/2018-06-01/runtime/invocation/next", {
          method: "GET",
          headers: undefined,
          body: undefined,
        }],
      });
    })();
  });

  tmpEnv.restore();
});
