// import { mock_fetch, stub, TestEnv } from "./test_deps.ts";
// import { LambdaRuntime, RuntimeEnvVar } from "./runtime.ts";

// Deno.test(
//   "aaa",
//   async () => {
//     mock_fetch.install();

//     async function* generator() {
//       yield new Response(`Good morning!`, {
//         status: 200,
//       });
//       yield new Response(`Hello!`, {
//         status: 200,
//       });
//       yield new Response(`Good evening!`, {
//         status: 200,
//       });
//     }
//     const x1 = await generator();

//     mock_fetch.mock("GET@/:name", async (req, params) => {
//       const x2 = await x1.next();
//       const x3 = x2.value;
//       return x3 as Response;
//     });

//     console.log(await (await fetch("http://localhost:8888/aaa")).text());
//     console.log(await (await fetch("http://localhost:8888/aab")).text());
//     console.log(await (await fetch("http://localhost:8888/aac")).text());
//     console.log(await (await fetch("http://localhost:8888/aac")).text());
//     // await TestEnv.with({}, async () => {
//     //   console.log(Deno.env.toObject());

//     //   const runtime = await LambdaRuntime.initialize();
//     // });

//     mock_fetch.uninstall();
//   },
// );
