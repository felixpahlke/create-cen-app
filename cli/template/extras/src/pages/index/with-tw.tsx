import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CEN - APP</title>
        <meta name="description" content="MVP Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-col items-center pt-10">
        <h1>
          CEN - <strong>APP</strong>
        </h1>
      </main>
    </>
  );
};

export default Home;
