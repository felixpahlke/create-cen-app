import Header from "./Header";
// $with: !tailwind
import styles from "./Layout.module.css";
// $end: !tailwind
// $with: carbon
import { Theme } from "@carbon/react";
// $end: carbon
// $with: carbon && recoil
import useTheme from "~/atoms/useTheme";

// $end: carbon && recoil

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // $with: carbon && recoil
  const [theme] = useTheme();
  // $end: carbon && recoil

  return (
    <>
      {/* $with: carbon */}
      <Theme
        // $with: recoil
        theme={theme}
        // $end: recoil
        // $with: !recoil
        theme="white"
        // $end: !recoil
      >
        {/* $end: carbon */}
        <Header />
        <div
          // every pages content goes here
          // $with: !tailwind
          className={styles.content}
          // $end: !tailwind
          // $with: tailwind
          className="mt-12 h-[calc(100vh-48px)] overflow-y-auto"
          // $end: tailwind
        >
          {children}
        </div>
        {/* $with: carbon */}
      </Theme>
      {/* $end: carbon */}
    </>
  );
}
