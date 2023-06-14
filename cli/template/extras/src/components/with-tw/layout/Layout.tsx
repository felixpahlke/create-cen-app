import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div
        // every pages content goes here
        className="mt-12 h-[calc(100vh-48px)] overflow-y-auto"
      >
        {children}
      </div>
    </>
  );
}
