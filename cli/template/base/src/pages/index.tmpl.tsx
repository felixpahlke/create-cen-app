// $with: !tailwind
import styles from "./index.module.css";
// $end: !tailwind
import { type NextPage } from "next";
import Head from "next/head";
// $with: extBackend
import { useQuery } from "react-query";
// $end: extBackend
// $with: recoil && !carbon
import useCounter from "~/atoms/useCounter";
// $end: recoil && !carbon
// $with: trpc
import { api } from "~/utils/api";

// $end: trpc

const Home: NextPage = () => {
  // $with: recoil && !carbon
  const [counter] = useCounter();
  // $end: recoil && !carbon

  // $with: trpc
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // $end: trpc

  // $with: extBackend
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
        // $with: !tailwind
        className={styles.container}
        // $end: !tailwind
        // $with: tailwind
        className="flex w-full flex-col items-center pt-10"
        // $end: tailwind
      >
        <h1
          // $with: tailwind
          className="text-4xl"
          // $end: tailwind
        >
          CEN - <strong>[project-name]</strong>
        </h1>
        {/* $with: trpc || extBackend */}
        <p
          // $with: tailwind
          className="text-2xl"
          // $end: tailwind
          // $with: !tailwind
          className={styles.showcaseText}
          // $end: !tailwind
        >
          {/* $with: trpc */}
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          {/* $end: trpc */}
          {/* $with: extBackend */}
          {data ? data.message : "Loading query"}
          {/* $end: extBackend */}
        </p>
        {/* $end: trpc || extBackend */}

        {/* $with: recoil && !carbon */}
        <p>counter: {counter}</p>
        {/* $end: recoil && !carbon */}
      </main>
    </>
  );
};

export default Home;
