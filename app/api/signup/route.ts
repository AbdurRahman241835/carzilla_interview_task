import { connectDB } from "@/libs/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }

    const db = await connectDB();

    // Check if user already exists
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!Array.isArray(existing) || existing.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    return new Response(JSON.stringify({ message: "Your account has been created" }), { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
