// $with: !tailwind
import styles from "./Layout.module.css";
// $end: !tailwind
// $with: carbon && recoil
import { BrightnessContrast } from "@carbon/icons-react";
// $end: carbon && recoil
// $with: carbon
import {
  Header as CarbonHeader,
  HeaderName,
  // $with: recoil
  HeaderGlobalAction,
  HeaderGlobalBar,
  // $end: recoil
} from "@carbon/react";
// $end: carbon
// $with: !carbon
import Link from "next/link";
// $end: !carbon
// $with: !carbon && recoil
import useCounter from "~/atoms/useCounter";
// $end: !carbon && recoil

// $with: carbon && recoil
import useTheme from "~/atoms/useTheme";

// $end: carbon && recoil

export default function Header() {
  // $with: !carbon && recoil
  const [counter, setCounter] = useCounter();
  // $end: !carbon && recoil

  // $with: carbon && recoil
  const [theme, setTheme] = useTheme();
  // $end: carbon && recoil

  return (
    <>
      {/* $with: carbon */}
      <CarbonHeader aria-label="CEN [project-name]">
        <HeaderName href="/" prefix="CEN">
          [project-name]
        </HeaderName>
        {/* $with: recoil */}
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Theme Switcher" tooltipAlignment="start">
            <BrightnessContrast
              size={20}
              onClick={() => {
                setTheme(theme === "g90" ? "white" : "g90");
              }}
            />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        {/* $end: recoil */}
      </CarbonHeader>
      {/* $end: carbon */}
      {/* $with: !carbon */}
      <header
        // $with: !tailwind
        className={styles.header}
        // $end: !tailwind
        // $with: tailwind
        className="fixed top-0 flex h-12 w-full flex-row justify-between border-b border-solid border-gray-300"
        // $end: tailwind
      >
        <Link
          href="/"
          // $with: !tailwind
          className={styles.appName}
          // $end: !tailwind
          // $with: tailwind
          className="flex h-full items-center pl-3"
          // $end: tailwind
        >
          CEN&nbsp;<strong>[project-name]</strong>
        </Link>
        {/* $with: recoil */}
        <button
          // $with: !tailwind
          className={styles.counterButton}
          // $end: !tailwind
          // $with: tailwind
          className="pr-4 text-3xl"
          // $end: tailwind
          onClick={() => setCounter(counter + 1)}
        >
          +
        </button>
        {/* $end: recoil */}
      </header>
      {/* $end: !carbon */}
    </>
  );
}
