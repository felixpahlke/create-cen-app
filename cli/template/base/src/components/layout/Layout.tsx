import Header from "./Header";
import { Theme } from "@carbon/react";
import useTheme from "~/atoms/useTheme";

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
        className="mt-12 h-[calc(100vh-48px)] overflow-y-auto"
      >
        {children}
      </div>
    </Theme>
  );
}
