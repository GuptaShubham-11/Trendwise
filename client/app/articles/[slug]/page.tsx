'use client';

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import axiosClient from "@/lib/axios";
import { Article } from "@/types/article";
import { Skeleton } from "@/components/ui/skeleton";
import FormatArticle from "@/components/FormatArticle";
import Layout from "@/components/Layout";

export default function ArticlePage() {
    const { slug } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug || typeof slug !== "string") {
            notFound();
            return;
        }

        const fetchArticle = async () => {
            try {
                const res = await axiosClient.get(`/articles/${slug}`);
                setArticle(res.data.data);
                toast.success("Article loaded successfully");
            } catch (error) {
                console.error(error)
                toast.error("Failed to load article");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 animate-pulse">
                    <Skeleton className="h-10 w-3/4 rounded-lg" />
                    <Skeleton className="h-5 w-1/2 rounded" />
                    <Skeleton className="h-96 w-full rounded-xl mt-4" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                </div>
            </Layout>
        );
    }

    if (!article) return notFound();

    return (
        <Layout>
            <FormatArticle article={article} />
        </Layout>
    );
}
