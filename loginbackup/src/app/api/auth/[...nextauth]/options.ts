import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { CustomUser } from "@/types/customTypes";

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.PG_USER!,
  host: process.env.PG_HOST!,
  database: process.env.PG_DATABASE!,
  password: process.env.PG_PASSWORD!,
  port: parseInt(process.env.PG_PORT!) || 5432,
});

// NextAuth configuration
export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, credentials }) {
      const client = await pool.connect();
      try {
        if (credentials?.email) {
          const userRes = await client.query(
            'SELECT * FROM "users" WHERE email = $1',
            [credentials.email]
          );

          if (userRes.rows.length > 0) {
            return true;
          }

          return false;
        }

        if (credentials?.user_id && credentials?.role && credentials?.ward_id) {
          const adminRes = await client.query(
            'SELECT * FROM "admins" WHERE user_id = $1 AND role = $2 AND ward_id = $3',
            [credentials.user_id, credentials.role, credentials.ward_id]
          );

          if (adminRes.rows.length > 0) {
            return true;
          }

          return false;
        }

        return false;
      } catch (error) {
        console.error("Sign-in error: ", error);
        return false;
      } finally {
        client.release();
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user as CustomUser;
      }
      console.log("JWT Token:", token);
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Login",
      type: "credentials",

      credentials: {
        username:{ label:"Username" , type:"text"},
        wardNumber:{ label:"Ward Number" , type:"number"},
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" },
        user_id: { label: "User ID", type: "text" },
        role: { label: "Role", type: "text" },
        ward_id: { label: "Ward ID", type: "text" },
      },

      async authorize(credentials) {
        const client = await pool.connect();

        try {
          if (credentials?.email && credentials?.password) {
            const userRes = await client.query(
              'SELECT * FROM "users" WHERE email = $1',
              [credentials.email]
            );

            const user = userRes.rows[0];

            if (user && bcrypt.compareSync(credentials.password, user.password_hash)) {
              return user;
            }
          }

          if (credentials?.user_id && credentials?.role && credentials?.ward_id) {
            const adminRes = await client.query(
              'SELECT * FROM "admins" WHERE user_id = $1 AND role = $2 AND ward_id = $3',
              [credentials.user_id, credentials.role, credentials.ward_id]
            );

            const admin = adminRes.rows[0];

            if (admin) {
              return admin;
            }
          }

          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],
};
