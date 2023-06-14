import styles from "./Layout.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.appName}>
        CEN&nbsp;<strong>APP</strong>
      </Link>
    </header>
  );
}
