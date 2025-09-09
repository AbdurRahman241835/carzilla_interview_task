import { connectDB } from "../../../libs/db";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export type User = {
  id: number;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }

    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const user = rows[0] as User;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful", userId: user.id }), { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
