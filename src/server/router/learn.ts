import { createRouter } from "./context";
import { z } from "zod";
import { rand } from "@ngneat/falso";

export function typedRandom<T extends Readonly<unknown[]>>(values: T): T[number] {
  return rand(values);
}

export const learnQuestionTypes = ["write", "true false", "multiple choice"] as const;

export const learnRouter = createRouter().query("next-term", {
  input: z.object({
    setId: z.number(),
    type: z.enum(learnQuestionTypes).optional(),
  }),
  async resolve({ ctx, input }) {
    const randType = () => typedRandom(learnQuestionTypes);

    const termCount = await ctx.prisma.term.count({
      where: {
        setId: input.setId,
      },
    });
    const termNumber = Math.floor(Math.random() * termCount);

    return {
      ...(await ctx.prisma.term.findFirst({
        where: {
          setId: input.setId,
        },
        skip: termNumber,
      })),
      type: input.type || randType(),
    };
  },
});
