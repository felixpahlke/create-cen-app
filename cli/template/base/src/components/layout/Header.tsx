import styles from "./Layout.module.css";
import Link from "next/link";
import useCounter from "~/atoms/useCounter";

export default function Header() {
  const [counter, setCounter] = useCounter();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.appName}>
        CEN&nbsp;<strong>[project-name]</strong>
      </Link>
      <button className={styles.counterButton} onClick={() => setCounter(counter + 1)}>
        +
      </button>
    </header>
  );
}
