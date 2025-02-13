import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface PostCardProps {
  title?: string;
  content?: string;
  author?: {
    name: string;
    avatar: string;
  };
  timestamp?: string;
  votes?: number;
  commentCount?: number;
  userVote?: "up" | "down";
  onVote?: (type: "up" | "down") => void;
  onCommentClick?: () => void;
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
  userVote,
}: PostCardProps) => {
  return (
    <Card className="w-full mb-4 bg-white hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-3 p-3 sm:p-6">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-semibold truncate">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            Posted by {author.name} • {timestamp}
          </p>
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
