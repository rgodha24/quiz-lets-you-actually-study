import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { prisma } from "../server/db/client";
import Set from "../components/Set";
import { signIn } from "next-auth/react";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { InferProps } from "../types";
import Navbar from "../components/Navbar";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const sets = prisma.set.findMany({ take: 20 });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      sets: await sets,
      session: session,
    },
  };
};

const Home: NextPage<InferProps<typeof getServerSideProps>> = (props) => {
  const session = useSession();
  return (
    <>
      <Navbar />
      
      {props.sets.map((set) => {
        return (
          <div key={set.id}>
            <br />
            <Set {...set} />
          </div>
        );
      })}
    </>
  );
};

export default Home;
