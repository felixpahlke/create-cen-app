// $start: !tailwind
import styles from "./index.module.css";
// $end: !tailwind
import { type NextPage } from "next";
import Head from "next/head";
// $start: extBackend
import { useQuery } from "react-query";
// $end: extBackend
// $start: recoil && !carbon
import useCounter from "~/atoms/useCounter";
// $end: recoil && !carbon
// $start: trpc
import { api } from "~/utils/api";

// $end: trpc

const Home: NextPage = () => {
  // $start: recoil && !carbon
  const [counter] = useCounter();
  // $end: recoil && !carbon

  // $start: trpc
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // $end: trpc

  // $start: extBackend
  const fetchMessage = async () => {
    const res = await fetch("/api/example/hello");
    const data = await res.json();
    return data as { message: string };
  };

  const { data } = useQuery("message", fetchMessage);
  // $end: extBackend

  return (
    <>
      <Head>
        <title>CEN - [project-name]</title>
        <meta name="description" content="[project-name]" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        // $start: !tailwind
        className={styles.container}
        // $end: !tailwind
        // $start: tailwind
        className="flex w-full flex-col items-center pt-10"
        // $end: tailwind
      >
        <h1
          // $start: tailwind
          className="text-4xl"
          // $end: tailwind
        >
          CEN - <strong>[project-name]</strong>
        </h1>
        {/* $start: trpc || extBackend */}
        <p
          // $start: tailwind
          className="text-2xl"
          // $end: tailwind
          // $start: !tailwind
          className={styles.showcaseText}
          // $end: !tailwind
        >
          {/* $start: trpc */}
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          {/* $end: trpc */}
          {/* $start: extBackend */}
          {data ? data.message : "Loading query"}
          {/* $end: extBackend */}
        </p>
        {/* $end: trpc || extBackend */}

        {/* $start: recoil && !carbon */}
        <p>counter: {counter}</p>
        {/* $end: recoil && !carbon */}
      </main>
    </>
  );
};

export default Home;
