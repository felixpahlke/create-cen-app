import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
            <h1>
              IBM - <strong>[project-name]</strong>
            </h1>
            <p>Let&apos;s Build!</p>
            <p className="mt-10 text-2xl">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
