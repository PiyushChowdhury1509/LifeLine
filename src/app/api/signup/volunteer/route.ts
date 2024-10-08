import bcrypt from "bcryptjs"
import crypto from "crypto";
import { Volunteer } from "@/models/volunteer";
import connectDB from "@/utils/connectDB";

export async function POST(req: Request) {
  const { email, password, username, location } = await req.json();
  console.log('location arrived at backend',location)
  connectDB();

  const existingUser = await Volunteer.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 422,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verifyToken = crypto.randomBytes(32).toString('hex');

  const user = new Volunteer({
    username,
    email,
    password: hashedPassword,
    location, 
    verifyToken,
  });

  await user.save();

  return new Response(JSON.stringify({message: "User created"}),{status: 201});
}

