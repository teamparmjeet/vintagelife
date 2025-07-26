import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await dbConnect();
          const admin = await UserModel.findOne({ email });

          if (!admin) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, admin.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: admin._id.toString(), // Convert to string for JWT storage
            email: admin.email,
            name: admin.name,
            dscode: admin.dscode,
            usertype: admin.usertype,
          };

        } catch (error) {
          console.log("Error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // Include user id
        token.usertype = user.usertype;
        token.dscode = user.dscode;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;  // Pass user id to session
      session.user.dscode = token.dscode;  // Pass user id to session
      session.user.usertype = token.usertype;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
