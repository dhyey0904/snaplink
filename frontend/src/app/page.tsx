import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
        Snap<span className="text-blue-600">Link</span>
      </h1>
      <p className="mt-4 text-xl text-gray-600 max-w-2xl">
        The simplest and most powerful way to shorten your URLs, track clicks, and manage your links.
      </p>
      
      <div className="mt-8 flex gap-4">
        <Link 
          href="/register" 
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
        <Link 
          href="/login" 
          className="px-8 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Login
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Shorten Links</h3>
          <p className="mt-2 text-gray-600">Create memorable, custom aliases for your long URLs in seconds.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Track Analytics</h3>
          <p className="mt-2 text-gray-600">See exactly how many people click your links, and where they come from.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Secure Links</h3>
          <p className="mt-2 text-gray-600">Add passwords to keep your links private and safe.</p>
        </div>
      </div>
    </div>
  );
}
