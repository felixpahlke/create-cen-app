import type { NextPage } from "next";
import Head from "next/head";
import styles from "./index.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>IBM - [project-name]</title>
        <meta name="description" content="MVP Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles["centering-container"]}>
          <div className={styles["inner-container"]}>
            <h1>[project-name]</h1>
            <p>Let&apos;s Build!</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
