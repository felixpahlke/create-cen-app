import Header from "./Header";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div
        // every pages content goes here
        className={styles.content}
      >
        {children}
      </div>
    </>
  );
}
