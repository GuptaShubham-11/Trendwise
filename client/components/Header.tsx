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
import { LogOut, Sparkles, Settings, User, LayoutDashboard, HelpCircle, ArrowUpRightIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "@/lib/axios";

const fallbackUser = {
    name: "Anonymous",
    email: "unknown@example.com",
    avatarUrl: "https://github.com/shadcn.png",
};

export default function Header() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGetting, setIsGetting] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleGetArticles = async () => {
        try {
            setIsGetting(true);
            await axiosClient.post("/articles/generate");
            toast.success("Trending Articles loaded.");
        } catch (error) {
           console.error(error);
            toast.error("Failed to get articles"); 
        } finally {
            setIsGetting(false);
        }
    }

    const user = {
        name: session?.user?.name || fallbackUser.name,
        email: session?.user?.email || fallbackUser.email,
        image: session?.user?.image || fallbackUser.avatarUrl,
    };

    return (
        <motion.header
            className={`px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-sur/80 backdrop-blur-md shadow-lg  border-b border-pri/10"
                : "bg-transparent"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
        >
            {/* Logo with animation */}
            <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
            >
                <Sparkles className="text-acc" size={24} />
                <motion.h1
                    className="text-xl font-bold text-pri tracking-wide select-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    TrendWise
                </motion.h1>
            </motion.div>

            {/* User Dropdown */}
            <DropdownMenu onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <motion.div
                        className="relative outline-none cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Avatar className="border-2 border-pri/30 transition-all">
                            <AvatarImage
                                src={'/'}
                                alt={user.name}
                                className="w-10 h-10 object-cover"
                            />
                            <AvatarFallback className="bg-acc text-white font-medium">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Animated indicator when menu is open */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-acc border-2 border-sur"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="bg-sur/90 backdrop-blur-xl border border-pri/20 text-txt w-64 shadow-xl rounded-xl overflow-hidden"
                >
                    {/* User info section with animation */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DropdownMenuLabel className="flex flex-col bg-sur/50">
                            <h3 className="font-semibold truncate text-xl pb-0 p-2 m-1 text-mt">{user.name}</h3>
                            <p className="text-sm text-txt/70 pt-0 p-2 m-1 truncate">{user.email}</p>
                        </DropdownMenuLabel>
                    </motion.div>
                    <DropdownMenuSeparator className="bg-pri/20" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <DropdownMenuItem
                            onClick={handleGetArticles}
                            disabled={isLoading}
                            className="flex items-center gap-3 p-3 focus:bg-pri/80 focus:text-white transition-colors cursor-pointer text-sm "
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3 w-full">
                                    <Spinner />
                                    <span>Getting...</span>
                                </div>
                            ) : (
                                <>
                                    <ArrowUpRightIcon className="h-4 w-4" />
                                    <span >Get Trend Articles</span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </motion.div>

                    {/* Sign out button with animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            disabled={isLoading}
                            className="flex items-center gap-3 p-3 focus:bg-red-500/20 text-red-400 focus:text-white transition-colors cursor-pointer text-sm "
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3 w-full">
                                    <Spinner />
                                    <span>Signing out...</span>
                                </div>
                            ) : (
                                <>
                                    <LogOut className="h-4 w-4" />
                                    <span >Sign out</span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </motion.div>
                </DropdownMenuContent>
            </DropdownMenu>
        </motion.header>
    );
}