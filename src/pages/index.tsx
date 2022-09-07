import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { prisma } from "../server/db/client";
import Set from "../components/Set";
import { signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { getSession } from "next-auth/react";

const getServerSideProps = async (ctx: any) => {
  const sets = prisma.set.findMany({ take: 20 });

  return {
    props: {
      sets: await sets,
      session: JSON.stringify(await unstable_getServerSession(ctx.req, ctx.res, authOptions)),
    },
  };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return (
    <>
      <button className='text-2xl' onClick={() => signIn()}>
        LOGIN
      </button>
      {props.sets.map((set) => {
        return <Set {...set} key={set.id} />;
      })}
      {props.session}
      {JSON.stringify(getSession())}
    </>
  );
};

export default Home;
export { getServerSideProps };
