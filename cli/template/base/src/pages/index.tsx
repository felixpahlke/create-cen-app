import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import useCounter from "~/atoms/useCounter";

const Home: NextPage = () => {
  const [counter] = useCounter();

  return (
    <>
      <Head>
        <title>CEN - [project-name]</title>
        <meta name="description" content="[project-name]" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1>
          CEN - <strong>[project-name]</strong>
        </h1>
        <p>counter: {counter}</p>
      </main>
    </>
  );
};

export default Home;
