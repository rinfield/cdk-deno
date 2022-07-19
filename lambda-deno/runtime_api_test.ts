import {
  assertEquals,
  assertInstanceOf,
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

// Deno.test("Without Runtime API env", async () => {
//   await TempEnv.replaced({}, async () => {
//     const actual = await LambdaRuntimeApi.nextInvocation();
//   });
// });

Deno.test("With Runtime API env", async (testContext) => {
  const tmpEnv = TempEnv.replace(
    { [ENV_VAR_NAME_RUNTIME_API]: "localhost:9999" },
  );

  await testContext.step("Next API: 202", async () => {
    await mockSessionAsync(async () => {
      // Given
      const fetchStub = fetchReturns(
        new Response(JSON.stringify({ type: "Test Event" }), {
          status: 202,
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
        event: { type: "Test Event" },
        awsRequestId: "8476a536-e9f4-11e8-9739-2dfe598c3fcd",
        deadlineMs: 1542409706888,
        invokedFunctionArn:
          "arn:aws:lambda:us-east-2:123456789012:function:custom-runtime",
      });
      assertSpyCalls(fetchStub, 1);
      assertSpyCall(fetchStub, 0, {
        args: ["http://localhost:9999/2018-06-01/runtime/invocation/next", {
          method: "GET",
          headers: undefined,
          body: undefined,
        }],
      });
    })();
  });

  await testContext.step("Next API: 500", async () => {
    await mockSessionAsync(async () => {
      // Given
      const fetchStub = fetchReturns(new Response(undefined, { status: 500 }));
      stub(
        LambdaRuntimeApi,
        "exitRuntime",
        () => {
          throw new Error();
        },
      );

      // When

      try {
        await LambdaRuntimeApi.nextInvocation();
      } catch (e) {
        assertInstanceOf(e, Error);
      }

      // Then
      assertSpyCalls(fetchStub, 1);
      assertSpyCall(fetchStub, 0, {
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
