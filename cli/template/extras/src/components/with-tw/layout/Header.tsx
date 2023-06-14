import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 h-12 w-full border-b border-solid border-gray-400">
      <Link href="/" className="flex h-full items-center pl-2">
        CEN&nbsp;<span className="font-bold">APP</span>
      </Link>
    </header>
  );
}
