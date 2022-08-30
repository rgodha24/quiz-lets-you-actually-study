import { GetServerSideProps } from "next";
import { prisma } from "../../../server/db/client";
import { z } from "zod";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = z.string();
  const example = id.parse(context.params?.example);
const a = await prisma.example.findFirst({
    where: {
        id: example 
    }
})

  return {
    props: {
       ...a
    },
  };
};

export default function Index(props: any) {
  return <>{JSON.stringify(props)}</>;
}
