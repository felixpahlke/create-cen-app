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
        <title>IBM - [project-name]</title>
        <meta name="description" content="MVP Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.centeringContainer}>
          <div className={styles.innerContainer}>
            <h1>
              IBM - <strong>[project-name]</strong>
            </h1>
            <p>Let&apos;s Build!</p>
            <p className={styles.showcaseText}>{data ? data.message : "Loading query"}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
