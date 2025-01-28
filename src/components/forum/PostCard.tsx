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
}: PostCardProps) => {
  return (
    <Card className="w-full mb-4 bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">
            Posted by {author.name} • {timestamp}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-blue-500"
              onClick={() => onVote("up")}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
            </Button>
            <span className="text-sm font-medium">{votes}</span>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-red-500"
              onClick={() => onVote("down")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onCommentClick}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount} Comments</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
