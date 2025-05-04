import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Concert Buddy</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Concert Buddy 🎵</h1>
      </main>
    </>
  );
}
