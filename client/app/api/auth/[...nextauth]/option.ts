import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

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
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
        async jwt({ token }: { token: JWT }) {
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
