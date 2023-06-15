import { type NextPage } from "next";
import Head from "next/head";
import useCounter from "~/atoms/useCounter";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [counter] = useCounter();
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>CEN - [project-name]</title>
        <meta name="description" content="MVP Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-col items-center pt-10">
        <h1 className="text-4xl">
          CEN - <strong>[project-name]</strong>
        </h1>
        <p className="mt-10 text-2xl">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
        <p className="mt-6">counter: {counter}</p>
      </main>
    </>
  );
};

export default Home;
