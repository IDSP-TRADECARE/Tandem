import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="flex flex-col justify-center items-center">
        <h1>
          Tandem
        </h1>
        <p>
          Project frontpage
        </p>
      </header>

      <main className="min-h-screen flex flex-col justify-center items-center text-center">
        <Link href="/test" className="text-blue-500 hover:text-blue-700 underline">
          Test Page
        </Link>
        
        <Link href="/testApi" className="text-blue-500 hover:text-blue-700 underline">
          Api usage example
        </Link>
      </main>
    </div>
  );
}
