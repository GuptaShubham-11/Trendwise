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

export default function CommentsSection({ articleId, user }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [posting, setPosting] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();


    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const res = await axiosClient.get(`/comments/article/${articleId}`);
            setComments(res.data.data);
        } catch (error) {
            toast.error("Failed to load comments");
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [articleId]);

    const handlePost = async () => {
        const trimmed = newComment.trim();
        if (!trimmed) return;

        try {
            setPosting(true);
            let user: any = localStorage.getItem("user");
            if (user) {
                user = JSON.parse(user);
            }
            const res = await axiosClient.post(`/comments/create/${articleId}/${user?._id}`, {
                comment: trimmed,
            });
            setComments((prev) => [res.data.data, ...prev]);
            setNewComment("");
            listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            toast.error("Failed to post comment");
        } finally {
            setPosting(false);
        }
    };

    console.log(comments);


    return (
        <div className="max-w-3xl mx-auto mt-10">
            {/* Create Comment */}
            <div className="bg-bg border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={''} alt={session?.user?.name || user.name} />
                        <AvatarFallback className="bg-pri text-white text-sm">
                            {session?.user?.name?.charAt(0) || 'Me'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add your comment..."
                            className="min-h-[100px] resize-none text-base bg-bg text-txt"
                        />
                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handlePost}
                                disabled={posting || !newComment.trim()}
                                className="bg-pri text-white hover:bg-pri/90 px-6 py-2 rounded-lg disabled:opacity-50"
                            >
                                {posting ? <Spinner /> : "Post Comment"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div
                ref={listRef}
                className="max-h-[500px] overflow-y-auto mt-8 space-y-6 pr-1 custom-scrollbar"
            >
                {loadingComments ? (
                    [...Array(3)].map((_, idx) => (
                        <div key={idx} className="flex gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-1/3 h-4" />
                                <Skeleton className="w-full h-4" />
                            </div>
                        </div>
                    ))
                ) : comments.length === 0 ? (
                    <div className="text-center text-sec italic">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => <CommentItem key={comment._id} user={session?.user} comment={comment} />)
                )}
            </div>
        </div>
    );
}

function CommentItem({ comment, user }: { comment: Comment; user?: any }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-bg border border-border rounded-lg shadow-sm">
            <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={''} alt={user?.name || comment?.author?.name} />
                <AvatarFallback className="bg-pri text-white text-sm">
                    {user?.name[0] || comment?.author?.name?.charAt(0) || 'M'}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-txt">{user?.name || comment?.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-sec">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-mt leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}
