export async function POST() {
  const res = new Response(JSON.stringify({ message: "Logged out" }), { status: 200 });
  res.headers.append(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure"
  );
  return res;
}
