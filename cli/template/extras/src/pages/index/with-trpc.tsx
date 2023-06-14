import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>CEN - APP</title>
        <meta name="description" content="MVP Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1>
          CEN - <strong>APP</strong>
        </h1>
        <p className={styles.showcaseText}>
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
      </main>
    </>
  );
};

export default Home;
