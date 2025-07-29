'use client';

import { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import CommentsSection from "./Comment";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUp, BookOpen, Clock, Calendar, MessageSquare } from "lucide-react";

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
    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
    const [activeHeading, setActiveHeading] = useState<string | null>(null);
    const { data: session } = useSession();
    const contentRef = useRef<HTMLDivElement>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Calculate reading time
    const wordCount = article.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    useEffect(() => {
        async function renderMarkdown() {
            let rawText = article.content;

            // Remove the first H1 title from content
            rawText = rawText.replace(/^# .+\r?\n/, "");

            const rawHTML = await marked.parse(rawText);
            const cleanHTML = DOMPurify.sanitize(rawHTML);
            setHtmlContent(cleanHTML);

            // Extract headings for TOC
            const parser = new DOMParser();
            const doc = parser.parseFromString(cleanHTML, 'text/html');
            const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

            const headingsArray = Array.from(headingElements).map((heading) => {
                const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '';
                return {
                    id,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName.charAt(1))
                };
            });

            setToc(headingsArray);
        }

        renderMarkdown();
    }, [article.content]);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active heading detection
    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;

            const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            let currentActive = null;

            for (const heading of headings) {
                const rect = heading.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= 200) {
                    currentActive = heading.id;
                    break;
                }
            }

            setActiveHeading(currentActive);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
            {/* Table of Contents (Sidebar) */}
            {toc.length > 0 && (
                <motion.div
                    className="hidden lg:block sticky top-28 h-fit w-64 bg-sur/80 backdrop-blur-md rounded-xl border border-pri/20 p-6 shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-pri/20">
                        <BookOpen className="h-5 w-5 text-pri" />
                        <h3 className="font-bold text-lg text-txt">Table of Contents</h3>
                    </div>

                    <nav className="space-y-2">
                        {toc.map((heading) => (
                            <a
                                key={heading.id}
                                href={`#${heading.id}`}
                                className={`block cursor-text py-1.5 pl-${heading.level * 2} text-sm rounded-md transition-colors ${activeHeading === heading.id
                                        ? 'bg-acc/20 text-pri font-medium'
                                        : 'text-txt/80 hover:text-pri'
                                    }`}
                                style={{ paddingLeft: `${heading.level * 0.75}rem` }}
                            >
                                {heading.text}
                            </a>
                        ))}
                    </nav>
                </motion.div>
            )}

            {/* Main Content */}
            <div className="flex-1">
                {/* Article Header */}
                <motion.header
                    className="space-y-6 mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-pri mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {article.title}
                    </motion.h1>

                    <motion.p
                        className="text-xl text-txt/80 max-w-2xl mx-auto italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {article.metaDescription}
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-6 text-txt/60 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-pri" />
                            <span>
                                Published on{" "}
                                <time dateTime={article.createdAt.toString()}>
                                    {format(new Date(article.createdAt), "MMMM d, yyyy")}
                                </time>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-pri" />
                            <span>{readingTime} min read</span>
                        </div>
                    </motion.div>
                </motion.header>

                {/* Featured Image */}
                <motion.div
                    className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-pri/10 to-acc/10 p-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-sur rounded-xl w-full h-64 md:h-80 flex items-center justify-center">
                        <div className="text-center p-6">
                            <Sparkles className="h-12 w-12 text-pri mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-txt">TrendWise Insight</h3>
                            <p className="text-txt/70 mt-2">AI-generated analysis of trending topics</p>
                        </div>
                    </div>
                </motion.div>

                {/* Article Content */}
                <motion.div
                    ref={contentRef}
                    className="prose prose-lg dark:prose-invert max-w-none text-txt prose-headings:text-pri prose-a:text-acc prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                />

                {/* Last Updated */}
                <motion.footer
                    className="border-t border-pri/20 pt-6 mt-12 text-sm text-txt/60 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Clock className="h-4 w-4 text-pri" />
                    <span>
                        Last updated on{" "}
                        <time dateTime={article.updatedAt.toString()}>
                            {format(new Date(article.updatedAt), "MMMM d, yyyy")}
                        </time>
                    </span>
                </motion.footer>

                {/* Comments Section */}
                <motion.section
                    className="mt-16 pt-10 border-t border-pri/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <MessageSquare className="h-6 w-6 text-pri" />
                        <h3 className="text-2xl font-bold text-txt">Join the Discussion</h3>
                    </div>

                    <CommentsSection
                        user={{
                            name: session?.user?.name || 'Anonymous',
                            avatarUrl: session?.user?.image || '/default-avatar.png'
                        }}
                        articleId={article._id}
                    />
                </motion.section>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    className="fixed bottom-6 right-6 bg-acc text-white p-3 rounded-full shadow-lg z-50 hover:bg-acc/90 transition-all"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <ArrowUp className="h-5 w-5" />
                </motion.button>
            )}
        </div>
    );
}