// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { writeRouter } from "./write";
import { learnRouter } from "./learn";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("protected.", protectedExampleRouter)
  .merge("write.", writeRouter)
  .merge("learn.", learnRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
