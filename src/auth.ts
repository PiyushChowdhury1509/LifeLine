import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Volunteer } from "./models/volunteer";
import { Hospital } from "./models/hospital";
import { compare } from "bcryptjs";
import connectDB from "./utils/connectDB";

connectDB();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, 
      },
      authorize: async (credentials) => {
        const { email, password, role } = credentials;

        if (!email || !password || !role) throw new Error("Invalid credentials");

        let user;
        if (role === "volunteer") {
          user = await Volunteer.findOne({ email }).select("+password");
        } else if (role === "hospital") {
          user = await Hospital.findOne({ email }).select("+password");
        }

        if (!user) throw new Error("Invalid email or password");

        console.log("Fetched user:", user);

        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        return { ...user.toObject(), role }; 
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', 
  },
  callbacks: {
    async redirect({ url, baseUrl, user }) {
      if (user && user.role === 'hospital') return `${baseUrl}/hospital/dashboard`;
      if (user && user.role === 'volunteer') return `${baseUrl}/volunteer/dashboard`;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;  
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
