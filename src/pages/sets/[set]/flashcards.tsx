import { prisma } from "../../../server/db/client";
import type { GetServerSideProps } from "next";
import { z } from "zod";
import { inferAsyncReturnType } from "@trpc/server";
import type { Term } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";

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

const WritePage = (props: NonNullable<inferAsyncReturnType<typeof getSetData>>) => {
  const [termIndex, setTermIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const lastTerm = () => {
    if (termIndex !== 0) {
      setTermIndex((t) => t - 1);
    }
  };
  const nextTerm = () => {
    if (termIndex !== props.terms.length - 1) {
      setTermIndex((t) => t + 1);
    }
  }

  return (
    <div className="flex text-3xl justify-between  ">
      <button onClick={()=>lastTerm()}>Last Term</button>
      <button onClick={()=>setFlip(f=>!f)}>{flip ? props.terms[termIndex]?.definition : props.terms[termIndex]?.term}</button>
      <button onClick={()=>nextTerm()}>Next Term</button>
    </div>
  );
};

export default WritePage;
