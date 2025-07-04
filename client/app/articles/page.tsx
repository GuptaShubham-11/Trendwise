'use client';

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Flame, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { sendUserToBackend } from "@/lib/sendUserToBackend";
import debounce from "lodash.debounce";
import Spinner from "@/components/Spinner";

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
    const limit = 10;

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

                setArticles(prev => [...prev, ...newArticles]);
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
            <main className="bg-bg min-h-screen px-4 sm:px-8 lg:px-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <h1 className="text-3xl font-bold text-pri">Trending Articles</h1>
                    <Input
                        type="text"
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="max-w-sm bg-sur text-txt border border-border placeholder:text-sec"
                    />
                </div>

                {/* Articles Grid */}
                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(isLoading && articles.length === 0
                        ? [...Array(limit)]
                        : displayedArticles
                    ).map((article, index) =>
                        article ? (
                            <Link
                                key={article._id}
                                href={`/articles/${article.slug}`}
                                target="_blank"
                                className="group bg-sur border border-border hover:border-pri rounded-xl p-5 transition-all duration-200 flex flex-col justify-between h-full no-underline"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-acc transition line-clamp-2">
                                        {article.title}
                                    </h2>
                                    {index < 2 ? (
                                        <Flame className="text-red-500 w-5 h-5 ml-2" />
                                    ) : index < 5 ? (
                                        <ArrowUpRight className="text-acc w-5 h-5 ml-2" />
                                    ) : null}
                                </div>

                                <p className="text-sm text-mt mb-4 line-clamp-3">{article.metaDescription}</p>

                                <span className="text-xs text-mt mt-auto">
                                    {new Date(article.createdAt || "").toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </Link>
                        ) : (
                            <Skeleton key={index} className="h-48 rounded-xl bg-sur border border-border" />
                        )
                    )}
                </section>

                {/* Load More / No Results */}
                {query === "" && hasMore && (
                    <div className="mt-10 mb-10 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={isLoading}
                            className="bg-bg border border-border hover:border-pri cursor-pointer"
                        >
                            {isLoading ? <Spinner /> : "Load More"}
                        </Button>
                    </div>
                )}

                {displayedArticles.length === 0 && !isLoading && (
                    <p className="text-center text-sec mt-16 text-sm">No matching articles found.</p>
                )}
            </main>
        </Layout>
    );
}
