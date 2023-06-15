import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "react-query";
import useCounter from "~/atoms/useCounter";

const Home: NextPage = () => {
  const [counter] = useCounter();

  const fetchMessage = async () => {
    const res = await fetch("/api/example/hello");
    const data = await res.json();
    return data as { message: string };
  };

  const { data } = useQuery("message", fetchMessage);

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
        <p className="mt-10 text-2xl">{data ? data.message : "Loading query"}</p>
        <p className="mt-6">counter: {counter}</p>
      </main>
    </>
  );
};

export default Home;
