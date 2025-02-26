import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentSkeleton from "../skeletons/CommentSkeleton";
import { Textarea } from "@/components/ui/textarea";

const getBadgeColor = (role: string) => {
  switch (role) {
    case "Developer":
      return "bg-rose-100 text-rose-800";
    case "Admin":
      return "bg-violet-100 text-violet-800";
    case "RPL":
      return "bg-red-100 text-red-800";
    case "TKJ":
      return "bg-pink-100 text-pink-800";
    case "DKV":
      return "bg-teal-100 text-teal-800";
    case "BC":
      return "bg-gray-100 text-gray-800";
    case "Anonymous":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface Comment {
  id: string;
  content: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
    role?: string;
  };
  timestamp: string;
  votes: number;
  parent_id?: string | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments?: Comment[];
  userVotes?: { [key: string]: "up" | "down" };
  onAddComment?: (content: string, parentId?: string) => void;
  onVote?: (commentId: string, type: "up" | "down") => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string | null;
}

const CommentSection = ({
  comments: rawComments = [],
  onAddComment = () => {},
  onVote = () => {},
  onEdit = () => {},
  onDelete = () => {},
  userVotes = {},
  currentUserId = null,
}: CommentSectionProps) => {
  const [expandedComments, setExpandedComments] = React.useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [newComment, setNewComment] = React.useState("");
  const [replyText, setReplyText] = React.useState("");
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(
    null,
  );
  const [editText, setEditText] = React.useState("");

  // Transform flat comments into a tree structure
  const comments = React.useMemo(() => {
    const commentMap = new Map();

    // First pass: Create all comment objects
    rawComments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      });
    });

    // Second pass: Build the tree structure
    const rootComments = [];
    rawComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        const parent = commentMap.get(comment.parent_id);
        parent.replies.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  }, [rawComments]);

  const toggleExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const canModifyComment = (authorId?: string) => {
    if (!currentUserId) return false;
    if (currentUserId === authorId) return true;
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    return userData.role === "Developer" || userData.role === "Admin";
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isEditing = editingCommentId === comment.id;

    return (
      <div
        key={comment.id}
        className={`w-full bg-white rounded-lg p-2 sm:p-4 mb-2 ${depth > 0 ? `ml-${Math.min(depth * 2, 8)}` : ""} ${depth > 0 ? "border-l-2 border-gray-100" : ""}`}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage
              src={comment.author.avatar}
              alt={comment.author.name}
            />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="font-semibold text-sm sm:text-base truncate">
                {comment.author.name}
              </span>
              {comment.author.role && (
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getBadgeColor(comment.author.role)}`}
                >
                  {comment.author.role}
                </span>
              )}
              <span className="text-xs sm:text-sm text-gray-500">
                {comment.timestamp}
              </span>
            </div>
            {isEditing ? (
              <div className="mt-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onEdit(comment.id, editText);
                      setEditingCommentId(null);
                      setEditText("");
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 sm:h-8 sm:w-8 p-0 hover:text-blue-500 ${userVotes?.[comment.id] === "up" ? "text-blue-500" : ""}`}
                  onClick={() => onVote(comment.id, "up")}
                >
                  <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="text-xs sm:text-sm font-medium min-w-[20px] text-center">
                  {comment.votes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 sm:h-8 sm:w-8 p-0 hover:text-red-500 ${userVotes?.[comment.id] === "down" ? "text-red-500" : ""}`}
                  onClick={() => onVote(comment.id, "down")}
                >
                  <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
              >
                Reply
              </Button>
              {canModifyComment(comment.author.id) && (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditText(comment.content);
                    }}
                    className="text-gray-500 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              )}
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(comment.id)}
                  className="flex items-center gap-1 h-6 px-2 text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" /> Show
                    </>
                  )}
                </Button>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-4">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!replyText.trim()) return;
                      onAddComment(replyText, comment.id);
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasReplies && isExpanded && (
          <div className="mt-4">
            {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg p-2 sm:p-4">
      <div className="mb-4 sm:mb-6">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] text-sm"
        />
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            onClick={() => {
              if (!newComment.trim()) return;
              onAddComment(newComment);
              setNewComment("");
            }}
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
        {comments.length === 0 ? (
          <>
            {[...Array(3)].map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </>
        ) : (
          comments.map((comment) => renderComment(comment, 0))
        )}
      </ScrollArea>
    </div>
  );
};

export default CommentSection;
