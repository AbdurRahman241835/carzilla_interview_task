"use client";
export default function Home() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login"; // Redirect to login page after logout
  }
  return (
      <div className="flex flex-col items-center gap-6 justify-center min-h-screen p-24">
        <h1 className="md:text-4xl text-2xl font-bold text-center ">
          Welcome to CarZilla Dashboard 
        </h1>
        <button onClick={() => handleLogout()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Logout
        </button>
      </div>
  );
}
