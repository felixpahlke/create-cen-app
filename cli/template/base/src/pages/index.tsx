import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
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
      </main>
    </>
  );
};

export default Home;
