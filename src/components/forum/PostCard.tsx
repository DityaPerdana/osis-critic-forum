import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";

const getBadgeColor = (role: string) => {
  switch (role) {
    case "Developer":
      return "bg-rose-100 text-rose-800";
    case "Admin":
      return "bg-violet-100 text-violet-800";
    case "RPL":
      return "bg-red-100 text-red-800";
    case "TKJ":
      return "bg-green-100 text-pink-800";
    case "DKV":
      return "bg-gray-100 text-teal-800";
    case "BC":
      return "bg-gray-200 text-gray-800";
    case "Anonymous":
      return "bg-gray-300 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface PostCardProps {
  id?: string;
  title?: string;
  content?: string;
  author?: {
    id?: string;
    name: string;
    avatar: string;
    role?: string;
  };
  timestamp?: string;
  votes?: number;
  commentCount?: number;
  userVote?: "up" | "down";
  onVote?: (type: "up" | "down") => void;
  onCommentClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

const PostCard = ({
  title = "Sample Discussion Topic",
  content = "This is a preview of the discussion content. Click to read more about this interesting topic...",
  author = {
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  timestamp = "2 hours ago",
  votes = 42,
  commentCount = 12,
  onVote = () => {},
  onCommentClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
  userVote,
  canEdit = false,
}: PostCardProps) => {
  return (
    <Card className="w-full mb-4 bg-white hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-3 p-3 sm:p-6">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold truncate">
              {title}
            </h3>
            {canEdit && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-gray-500 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="whitespace-nowrap">By {author.name}</span>
              {author.role && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${getBadgeColor(author.role)}`}
                >
                  {author.role}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap">• {timestamp}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-2 sm:px-6 sm:pb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-3 py-2 sm:px-6 sm:py-3 border-t">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 hover:text-blue-500 ${userVote === "up" ? "text-blue-500" : ""}`}
              onClick={() => onVote("up")}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[20px] text-center">
              {votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 hover:text-red-500 ${userVote === "down" ? "text-red-500" : ""}`}
              onClick={() => onVote("down")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs sm:text-sm"
            onClick={onCommentClick}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {commentCount}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
