import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  votes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments?: Comment[];
  userVotes?: { [key: string]: "up" | "down" };
  onAddComment?: (content: string, parentId?: string) => void;
  onVote?: (commentId: string, type: "up" | "down") => void;
}

const CommentSection = ({
  comments = [],
  onAddComment = () => {},
  onVote = () => {},
  userVotes = {},
}: CommentSectionProps) => {
  const [expandedComments, setExpandedComments] = React.useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [newComment, setNewComment] = React.useState("");

  const toggleExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div
        key={comment.id}
        className={`w-full bg-white rounded-lg p-4 mb-2 ${depth > 0 ? "ml-8" : ""}`}
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.author.avatar}
              alt={comment.author.name}
            />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-sm text-gray-500">{comment.timestamp}</span>
            </div>
            <p className="mt-1 text-gray-700">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 hover:text-blue-500 ${userVotes?.[comment.id] === "up" ? "text-blue-500" : ""}`}
                  onClick={() => onVote(comment.id, "up")}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{comment.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 hover:text-red-500 ${userVotes?.[comment.id] === "down" ? "text-red-500" : ""}`}
                  onClick={() => onVote(comment.id, "down")}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
              >
                Reply
              </Button>
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(comment.id)}
                  className="flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Hide Replies
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> Show Replies
                    </>
                  )}
                </Button>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-4">
                <Textarea
                  placeholder="Write a reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setNewComment("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onAddComment(newComment, comment.id);
                      setReplyingTo(null);
                      setNewComment("");
                    }}
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
    <div className="w-full bg-gray-50 rounded-lg p-4">
      <div className="mb-6">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end mt-2">
          <Button
            onClick={() => {
              onAddComment(newComment);
              setNewComment("");
            }}
          >
            Add Comment
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[500px] pr-4">
        {comments.map((comment) => renderComment(comment))}
      </ScrollArea>
    </div>
  );
};

export default CommentSection;
