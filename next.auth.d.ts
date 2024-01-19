import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      sub_name: string;
      company_id: number;
      branch_id: number;
      branch_name: string;
      accessToken: string;
    };
 
  }

  export interface User {
    id: string;
    role: string;
    name: string;
    sub_name: string;
    company_id: number;
    branch_id: number;
    branch_name: string;
    accessToken: string;
  }
}
