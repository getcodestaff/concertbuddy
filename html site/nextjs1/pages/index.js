import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Head>
        <title>Concert Buddy</title>
      </Head>

      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">🎶 Concert Buddy</h1>
          <p className="mt-1 text-lg">Find friends to go to concerts with!</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-semibold mb-4">📅 Post Your Concert Plans</h2>
          <p>Let others know what shows you’re attending. Add dates, locations, and favorite artists.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">🔍 Find Like-Minded Fans</h2>
          <p>Browse posts from others looking for a concert buddy. Filter by genre, artist, or city.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">💬 Start Chatting</h2>
          <p>Create an account to message other users, coordinate meetups, and enjoy the show together.</p>
        </section>

        <div className="mt-12 text-center">
          <a href="https://concertbuddy.example.com" className="inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">Get Started</a>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-8">
        &copy; {new Date().getFullYear()} Concert Buddy. All rights reserved.
      </footer>
    </div>
  );
}
