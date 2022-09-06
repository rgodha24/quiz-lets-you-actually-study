import { createRouter } from "./context";
import { z } from "zod";

export const writeRouter = createRouter().query("next-term", {
  input: z.object({ setId: z.number() }),
  resolve: async ({ ctx, input }) => {
    const termCount = await ctx.prisma.term.count({
      where: {
        setId: input.setId,
      },
    });
    const termNumber = Math.floor(Math.random() * termCount);

    return await ctx.prisma.term.findFirst({
      where: {
        setId: input.setId,
      },
      skip: termNumber,
    });
  },
});
