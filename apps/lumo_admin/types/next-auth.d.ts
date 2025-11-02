import "next-auth";
import { DefaultSession } from "next-auth";

type InstitutionRole = 'owner' | 'admin' | 'member'; // You can reuse your role type

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    } & DefaultSession["user"];

    // ✨ FIX: Add the role property to the institution object
    institution?: {
      id: string;
      name: string;
      portalKey: string;
      role: InstitutionRole; // The user's role within THIS institution
    };
  }
}
