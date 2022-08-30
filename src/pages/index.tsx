import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { prisma } from "../server/db/client";
import Set from "../component/Set";

const getServerSideProps =async () => {
  const sets = prisma.set.findMany({take: 20});

  return {
    props: {
      sets: await sets,
    }
  }
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return <>{props.sets.map((set) => {
return <Set {...set} key={set.id} /> 
  })}</>;
};

export default Home;
export {getServerSideProps}