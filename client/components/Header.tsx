'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";

const fallbackUser = {
    name: "Anonymous",
    email: "unknown@example.com",
    avatarUrl: "https://github.com/shadcn.png",
};

export default function Header() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            await signOut({ callbackUrl: "/" });
            localStorage.removeItem("user");
            toast.success("Signed out successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to sign out");
        } finally {
            setIsLoading(false);
        }
    };

    const user = {
        name: session?.user?.name || fallbackUser.name,
        email: session?.user?.email || fallbackUser.email,
        image: '',
    };

    return (
        <header className="bg-sur text-txt px-4 sm:px-8 flex items-center justify-between border-b border-border shadow-sm sticky top-0 z-50">
            {/* Logo */}
            <h1 className="text-xl font-bold text-pri tracking-wide select-none">
                TrendWise
            </h1>

            {/* User Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer transition-transform hover:scale-105">
                        <AvatarImage
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 object-cover"
                        />
                        <AvatarFallback className="bg-acc text-white">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="bg-sur border border-border text-txt w-60 shadow-lg rounded-md mr-8"
                >
                    <DropdownMenuLabel className="text-base font-semibold truncate">
                        {user.name}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="text-sm text-sec truncate">
                        {user.email}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="flex items-center gap-2 hover:bg-red-500 focus:bg-red-500 focus:text-white transition-colors cursor-pointer text-sm"
                    >
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                <LogOut className="h-4 w-4 focus:text-white" />
                                <span>Sign out</span>
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
