import Link from "next/link";
import useCounter from "~/atoms/useCounter";

export default function Header() {
  const [counter, setCounter] = useCounter();

  return (
    <header className="fixed top-0 flex h-12 w-full flex-row justify-between border-b border-solid border-gray-300">
      <Link href="/" className="flex h-full items-center pl-3">
        CEN&nbsp;<span className="font-bold">[project-name]</span>
      </Link>
      <button className="pr-4 text-3xl" onClick={() => setCounter(counter + 1)}>
        +
      </button>
    </header>
  );
}
