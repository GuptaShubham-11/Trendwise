'use client';

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Spinner from "./Spinner";
import axiosClient from "@/lib/axios";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User } from "lucide-react";

type Comment = {
    _id: string;
    author?: {
        name?: string;
        avatarUrl?: string;
    };
    content: string;
    createdAt: string;
};

type CommentsSectionProps = {
    articleId: string;
    user: {
        name: string;
        avatarUrl?: string;
    };
};

type UserType = {
    name: string;
    avatarUrl?: string;
    _id?: string;
};

export default function CommentsSection({ articleId, user }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [posting, setPosting] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoadingComments(true);
                const res = await axiosClient.get(`/comments/article/${articleId}`);
                setComments(res.data.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load comments");
            } finally {
                setLoadingComments(false);
            }
        };

        fetchComments();
    }, [articleId]);

    const handlePost = async () => {
        const trimmed = newComment.trim();
        if (!trimmed) return;

        try {
            setPosting(true);
            let user: UserType | null = null;
            const storedUser = localStorage.getItem("user");
            if (storedUser) user = JSON.parse(storedUser);

            const res = await axiosClient.post(`/comments/create/${articleId}/${user?._id}`, {
                comment: trimmed,
            });

            setComments((prev) => [res.data.data, ...prev]);
            setNewComment("");
            listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.log(err);
            toast.error("Failed to post comment");
        } finally {
            setPosting(false);
        }
    };

    // Handle Enter key to submit comment
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            {/* Create Comment */}
            <motion.div
                className="bg-sur/80 backdrop-blur-sm rounded-xl border border-pri/20 p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 shrink-0 border border-pri/30">
                        <AvatarImage src={'/'} alt={session?.user?.name || user.name} />
                        <AvatarFallback className="bg-acc text-white text-sm">
                            {session?.user?.name?.charAt(0) || user.name.charAt(0) || 'Me'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Share your thoughts..."
                            className="min-h-[100px] resize-none text-base bg-bg/50 backdrop-blur-sm text-txt border border-pri/20 rounded-xl"
                        />

                        <div className="flex justify-between items-center mt-3">
                            <div className="text-xs text-txt/60">
                                Press Enter to post, Shift+Enter for new line
                            </div>

                            <Button
                                onClick={handlePost}
                                disabled={posting || !newComment.trim()}
                                className="bg-acc text-white hover:bg-acc/90 px-6 py-2 rounded-xl disabled:opacity-50 flex items-center gap-2"
                            >
                                {posting ? <Spinner /> : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span>Post</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Comments List */}
            <div
                ref={listRef}
                className="mt-8 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
            >
                {loadingComments ? (
                    [...Array(3)].map((_, idx) => (
                        <motion.div
                            key={idx}
                            className="flex gap-4 p-4 bg-sur/50 backdrop-blur-sm rounded-xl border border-pri/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-1/3 h-4 rounded" />
                                <Skeleton className="w-full h-4 rounded" />
                                <Skeleton className="w-3/4 h-4 rounded" />
                            </div>
                        </motion.div>
                    ))
                ) : comments.length === 0 ? (
                    <motion.div
                        className="text-center py-12 bg-sur/30 backdrop-blur-sm rounded-xl border border-pri/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="flex flex-col items-center justify-center gap-4">
                            <User className="h-10 w-10 text-pri" />
                            <h4 className="text-lg font-semibold text-txt">No comments yet</h4>
                            <p className="text-txt/70 max-w-md mx-auto">
                                Be the first to share your thoughts on this article!
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {comments.map((comment) => (
                            <motion.div
                                key={comment._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CommentItem comment={comment} user={user} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

function CommentItem({ comment, user }: { comment: Comment; user?: UserType }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-sur/50 backdrop-blur-sm rounded-xl border border-pri/20 shadow-sm hover:shadow-md transition-all">
            <Avatar className="w-10 h-10 shrink-0 border border-pri/30">
                <AvatarImage src={'/'} alt={user?.name || comment?.author?.name} />
                <AvatarFallback className="bg-acc text-white text-sm">
                    {user?.name?.charAt(0) || comment?.author?.name?.charAt(0) || 'M'}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-txt">
                        {user?.name || comment?.author?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-txt/60 bg-sur px-2 py-1 rounded-full">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-txt/90 leading-relaxed whitespace-pre-wrap bg-bg/30 rounded-lg p-3 border border-pri/10">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}