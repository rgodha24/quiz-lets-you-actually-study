import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export type InferProps<T> = T extends GetServerSideProps<infer P, never>
  ? Omit<P, "session">
  : T extends (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context?: GetServerSidePropsContext<any>
    ) => Promise<GetServerSidePropsResult<infer P>>
  ? Omit<P, "session">
  : never;
