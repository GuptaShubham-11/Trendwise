import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.NEXTAUTH_SECRET
) {
    throw new Error("Missing environment variables");
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            // Send custom fields to session
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, user, account }) {
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;