import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "react-query";

const Home: NextPage = () => {
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
      <main className={styles.container}>
        <h1>
          CEN - <strong>[project-name]</strong>
        </h1>
        <p className={styles.showcaseText}>{data ? data.message : "Loading query"}</p>
      </main>
    </>
  );
};

export default Home;
