import { prisma } from "../../../server/db/client";
import type { GetServerSideProps } from "next";
import { z } from "zod";
import { inferAsyncReturnType } from "@trpc/server";

// TODO: make a page for if the set doesn't exist
export const getServerSideProps: GetServerSideProps = async (context) => {
  const setSchema = z.number();
  const set = setSchema.safeParse(Number(context.params?.set));

  if (!set.success) {
    console.log(context.params?.set);
    console.log(set);
    return {
      redirect: {
        destination: "/sets/1",
        permanent: false,
      },
    };
  }

  const setData = await getSetData(set.data);
  if (!setData) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...setData,
    },
  };
};
async function getSetData(set: number) {
  const data = prisma.set.findFirst({
    where: {
      id: set,
    },
    include: {
      terms: true,
      createdBy: true,
      // TODO: add user progress with getserversession from next auth
      // UserProgress: {
      //     where
      // }
    },
  });
  return data;
}

const SetPage = (props: NonNullable<inferAsyncReturnType<typeof getSetData>>) => {
  return <>
  <h1>
    title: {props.title}
  </h1>
  {props.terms.map((term) => {
    return <p key={term.id}>{term.term} | {term.definition}</p>
  })}
  </>;
};
export default SetPage;
