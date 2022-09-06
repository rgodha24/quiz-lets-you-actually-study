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
  const term = trpc.useQuery(["write.next-term", { setId: props.id }]);
  const [answer, setAnswer] = useState("");
  const [lastCorrect, setLastCorrect] = useState<boolean | undefined>(undefined);

  const handleSubmit = () => {
    term.refetch();
    if (answer === term.data?.definition) {
      setLastCorrect(true);
    } else {
      setLastCorrect(false);
    }
    setAnswer("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes("\n")) {
      handleSubmit();
    }
    else {
      setAnswer(e.target.value);
    }
  }

  return (
    <>
      term: {term.data?.term}
      <br />
      <input type='text' value={answer} onChange={handleChange} />
      <br />
      <button
        type='submit'
        onClick={handleSubmit}>
        submit
      </button>
      <br />
      <p className={lastCorrect ? "text-green-500" : "text-red-500"}>
        {lastCorrect !== undefined
          ? lastCorrect
            ? "The last answer was correct"
            : "the last answer was incorrect"
          : null}
      </p>
      <br />
      answer: {term.data?.definition}
    </>
  );
};

export default WritePage;
