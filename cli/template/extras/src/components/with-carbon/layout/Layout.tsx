import Header from "./Header";
import { Theme } from "@carbon/react";
import useTheme from "~/atoms/useTheme";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme] = useTheme();

  return (
    <Theme theme={theme}>
      <Header />
      <div
        // every pages content goes here
        className={styles.content}
      >
        {children}
      </div>
    </Theme>
  );
}
