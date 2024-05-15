// $with: !tailwind
import styles from "./index.module.css";
// $end: !tailwind
import { type NextPage } from "next";
import Head from "next/head";
// $with: extBackend
import { useQuery } from "@tanstack/react-query";
// $end: extBackend
// $with: recoil && !carbon
import useCounter from "~/atoms/useCounter";
// $end: recoil && !carbon
// $with: trpc
import { api } from "~/utils/api";
// $end: trpc
// $with: watsonx
import { useState } from "react";
import { useStream } from "~/hooks/useStream";
// $end: watsonx



const Home: NextPage = () => {
  // $with: recoil && !carbon
  const [counter] = useCounter();
  // $end: recoil && !carbon

  // $with: trpc
  const { data, isLoading } = api.example.hello.useQuery({ text: "from tRPC" });
  // $end: trpc

  // $with: watsonx
  const [prompt, setPrompt] = useState("");

  const getStream = async (input: { prompt: string }, signal: AbortSignal) => {
    const response = await fetch(`/api/generation/stream?prompt=${input.prompt}`, {
      signal,
    });
    return response;
  };

  const { start, stop, text, isLoading, isProcessing } = useStream({
    getStream,
    onSuccess: (text) => {
      console.log(text);
    },
  });

  // $end: watsonx


  // $with: extBackend && !watsonx
  const fetchMessage = async () => {
    const res = await fetch("/api/example/hello");
    const data = await res.json();
    return data as { message: string };
  };

  const { data, isLoading } = useQuery({ queryKey: ["message"], queryFn: fetchMessage});
  // $end: extBackend && !watsonx

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

        {/* $with: !watsonx && trpc || extBackend */}
        <p
          // $with: tailwind
          className="mt-10 text-2xl"
          // $end: tailwind
          // $with: !tailwind
          className={styles.showcaseText}
          // $end: !tailwind
        >
          {/* $with: trpc */}
          {isLoading ? "Loading tRPC query..." : data?.greeting}
          {/* $end: trpc */}
          {/* $with: extBackend */}
          {isLoading ? "Loading query" : data?.message}
          {/* $end: extBackend */}
        </p>
        {/* $end: !watsonx && trpc || extBackend */}

        {/* $with: watsonx */}
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          // $with: tailwind
          className="mt-10 w-full max-w-3xl rounded-md border border-gray-300 p-2"
          // $end: tailwind
        />

        <button
          onClick={() => start({ prompt })}
          disabled={isProcessing}
          // $with: tailwind
          className="mt-2 bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed"
          // $end: tailwind
        >
          Generate
        </button>

        <button
          onClick={() => stop()}
          disabled={!isProcessing}
          // $with: tailwind
          className="mt-2 bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed"
          // $end: tailwind
        >
          Stop
        </button>

        <p 
        // $with: tailwind
        className="my-4 w-full max-w-3xl whitespace-pre-wrap"
        // $end: tailwind
        >
          {isLoading ? "Waiting for stream to start..." : text}
        </p>
        {/* $end: watsonx */}


        {/* $with: recoil && !carbon */}
        <p>counter: {counter}</p>
        {/* $end: recoil && !carbon */}
      </main>
    </>
  );
};

export default Home;
