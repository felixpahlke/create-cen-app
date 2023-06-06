import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>IBM - [project-name]</title>
        <meta name="description" content="MVP Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex w-full flex-col items-center">
          <div className="w-full max-w-3xl pt-10">
            <h1>MVP Starter</h1>
            <p>Let&apos;s Build!</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
