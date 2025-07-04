import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import CommentsSection from "./Comment";
import { useSession } from "next-auth/react";

interface ArticlePageProps {
    article: {
        _id: string;
        slug: string;
        title: string;
        metaDescription: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        headings: string[];
    };
}

export default function FormatArticle({ article }: ArticlePageProps) {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const { data: session } = useSession();

    useEffect(() => {
        async function renderMarkdown() {
            let rawText = article.content;

            // Remove the first H1 title from content
            rawText = rawText.replace(/^# .+\r?\n/, "");

            const rawHTML = await marked.parse(rawText);
            const cleanHTML = DOMPurify.sanitize(rawHTML);
            setHtmlContent(cleanHTML);
        }

        renderMarkdown();
    }, [article.content]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
            {/* Title */}
            <header className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-pri">
                    {article.title}
                </h1>

                <p className="text-lg text-sec italic">{article.metaDescription}</p>

                <div className="text-sm text-gray-500">
                    Published on{" "}
                    <time dateTime={article.createdAt.toString()}>
                        {format(new Date(article.createdAt), "MMMM d, yyyy")}
                    </time>
                </div>
            </header>

            {/* Main Content */}
            <article
                className="prose prose-lg dark:prose-invert max-w-none text-txt prose-headings:text-pri prose-a:text-acc prose-img:rounded-lg prose-img:mx-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Last Updated */}
            <footer className="border-t pt-6 text-sm text-gray-500">
                Last updated on{" "}
                <time dateTime={article.updatedAt.toString()}>
                    {format(new Date(article.updatedAt), "MMMM d, yyyy")}
                </time>
            </footer>

            {/* Comments Section */}
            <section className="border-t pt-10 space-y-4">
                <h3 className="text-xl font-semibold text-txt">💬 Leave a Comment</h3>

                <CommentsSection
                    user={{ name: session?.user?.name || 'Anonymous', avatarUrl: session?.user?.image || '/default-avatar.png' }}
                    articleId={article._id}
                />
            </section>
        </div>
    );
}
