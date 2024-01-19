"use server";

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { prisma } from "@/pages/lib/prismaDB";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

interface UserLogin {
  id: string;
  name: string;
  sub_name: string;
  role: string;
  company_id: number;
  branch_id: number;
  branch_name: string;
  accessToken: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (!username || !password) {
          throw new Error("Invalid Username Or Password!!!");
        }

        const user = await prisma.employee.findUnique({
          where: {
            userName: username,
          },
          include: {
            branch: true
          }
        });

        if (!user) {
          throw new Error("Invalid User!!!");
        }

        const isPasswordValid = await compare(password, user.passWord);

        if (!isPasswordValid) {
          throw new Error("Invalid Password!!!");
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.userName,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8 ชั่วโมง
          },
          process.env.SECRET_KEY!
        );

        const userLogin: UserLogin = {
          id: user.id.toString(),
          name: user.name,
          sub_name: user.subname,
          role: user.role,
          company_id: user.companyId,
          branch_id: user.branchId,
          branch_name: user.branch.name,
          accessToken: token,
        };

        return userLogin;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
