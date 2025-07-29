'use client';

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Flame, ArrowUpRight, Search,  ArrowDown,  ChevronRight } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { sendUserToBackend } from "@/lib/sendUserToBackend";
import debounce from "lodash.debounce";
import Spinner from "@/components/Spinner";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
    _id: string;
    title: string;
    metaDescription: string;
    slug: string;
    createdAt?: string;
}

export default function Page() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const limit = 9;

    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) sendUserToBackend(session);
    }, [session]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get("/articles/all", {
                    params: { page, limit },
                });

                const newArticles = res.data?.data?.articles || [];
                const isLastPage = newArticles.length < limit;

                setArticles((prev) => {
                    const combined = [...prev, ...newArticles];
                    const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
                    return unique;
                });

                setHasMore(!isLastPage);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [page]);

    // Search functionality
    useEffect(() => {
        const debounced = debounce(() => {
            const q = query.toLowerCase();
            const result = articles.filter((a) =>
                a.title.toLowerCase().includes(q) ||
                a.metaDescription.toLowerCase().includes(q) ||
                a.slug.toLowerCase().includes(q)
            );
            setFiltered(result);
        }, 300);

        debounced();

        return () => debounced.cancel();
    }, [query, articles]);

    const displayedArticles = query ? filtered : articles;

    return (
        <Layout>
            <main className="bg-bg min-h-screen px-4 sm:px-8 lg:px-16 pb-20">
                {/* Hero Section */}
                <div className="relative py-16 text-center mb-16 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pri/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-acc/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.h1
                                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri to-acc">
                                    Discover Insights
                                </span> That Matter
                            </motion.h1>

                            <motion.p
                                className="text-xl text-txt/80 max-w-2xl mx-auto mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                AI-powered analysis of the latest trends and topics
                            </motion.p>
                        </motion.div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <ArrowDown className="h-6 w-6 text-pri" />
                            <h2 className="text-2xl font-bold text-txt">Explore All Articles</h2>
                        </div>

                        <motion.div
                            className={`relative max-w-md w-full ${isSearchFocused ? 'z-10' : ''}`}
                            animate={{
                                y: isSearchFocused ? -10 : 0,
                                scale: isSearchFocused ? 1.02 : 1
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-txt/60" />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full pl-10 pr-4 py-6 rounded-xl bg-sur/80 backdrop-blur-sm text-txt border border-pri/20 focus:border-pri transition-colors"
                                />
                            </div>

                            <AnimatePresence>
                                {isSearchFocused && (
                                    <motion.div
                                        className="absolute top-full left-0 w-full bg-sur/90 backdrop-blur-xl rounded-xl shadow-lg mt-2 p-4 border border-pri/20"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <p className="text-sm text-txt/70">
                                            Search by title, description, or topic
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Articles Grid */}
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {(isLoading && articles.length === 0
                                ? [...Array(limit)]
                                : displayedArticles
                            ).map((article, index) =>
                                article ? (
                                    <motion.div
                                        key={article._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={`/articles/${article.slug}`}
                                            key={article._id}
                                            target="_blank"
                                            className="group block no-underline"
                                        >
                                            <div className="bg-sur/80 backdrop-blur-sm rounded-xl border border-pri/20 p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-lg  font-semibold text-txt group-hover:text-acc transition-colors line-clamp-2">
                                                        {article.title}
                                                    </h3>

                                                    <div className="flex-shrink-0 ml-3">
                                                        {index < 2 ? (
                                                            <div className="bg-acc/20 text-acc rounded-full p-1">
                                                                <Flame className="w-4 h-4" />
                                                            </div>
                                                        ) : index < 5 ? (
                                                            <div className="bg-pri/20 text-pri rounded-full p-1">
                                                                <ArrowUpRight className="w-4 h-4" />
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <p className="text-sm hover:underline  text-txt/80 mb-6 flex-grow line-clamp-3">
                                                    {article.metaDescription}
                                                </p>

                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-xs text-txt/60">
                                                        {new Date(article.createdAt || "").toLocaleDateString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                    <div className="text-xs text-pri flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        <span>Read more</span>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <div key={index} className="bg-sur/80 backdrop-blur-sm rounded-xl border border-pri/20 p-6 h-full">
                                        <Skeleton className="h-6 w-3/4 mb-4 rounded" />
                                        <Skeleton className="h-4 w-full mb-2 rounded" />
                                        <Skeleton className="h-4 w-5/6 mb-4 rounded" />
                                        <Skeleton className="h-4 w-1/3 mt-6 rounded" />
                                    </div>
                                )
                            )}
                        </AnimatePresence>
                    </section>

                    {/* Load More / No Results */}
                    {query === "" && hasMore && (
                        <motion.div
                            className="mt-14 mb-10 flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                variant="outline"
                                onClick={() => setPage(prev => prev + 1)}
                                disabled={isLoading}
                                className="bg-sur/80 backdrop-blur-sm border border-pri/20 hover:border-pri rounded-xl px-8 py-6 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Articles</span>
                                        <ArrowDown className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {displayedArticles.length === 0 && !isLoading && (
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="bg-sur/50 backdrop-blur-sm rounded-xl border border-pri/20 p-12 max-w-md mx-auto">
                                <Search className="h-12 w-12 text-pri mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-txt mb-2">No articles found</h3>
                                <p className="text-txt/70">
                                    We couldn&apos;t find any articles matching {query}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </Layout>
    );
}