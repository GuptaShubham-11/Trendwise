"use client";

import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function GoogleAuthenticateButton() {
    const handleLogin = async () => {
        await signIn("google", {
            callbackUrl: "/articles",
        });
        toast.success("Signed in successfully");
    };

    return (
        <Button
            onClick={handleLogin}
            className="bg-acc hover:bg-acc/80 cursor-pointer text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg transition-all"
        >
            Continue with Google
        </Button>
    );
}
