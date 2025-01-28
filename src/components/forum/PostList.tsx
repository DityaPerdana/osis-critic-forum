import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostCard from "./PostCard";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  votes: number;
  commentCount: number;
}

interface PostListProps {
  sortBy?: "newest" | "mostLiked";
  onSortChange?: (sort: "newest" | "mostLiked") => void;
  posts?: Post[];
  onVote?: (postId: string, type: "up" | "down") => void;
  onCommentClick?: (postId: string) => void;
}

const PostList = ({
  posts = [
    {
      id: "1",
      title: "Introducing New Study Groups Initiative",
      content:
        "We're launching weekly study groups for different subjects. Join us to enhance your learning experience!",
      author: {
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      timestamp: "3 hours ago",
      votes: 56,
      commentCount: 23,
    },
    {
      id: "2",
      title: "Upcoming School Events Calendar",
      content:
        "Check out the schedule for this month's activities, including sports tournaments and cultural festivals.",
      author: {
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      },
      timestamp: "5 hours ago",
      votes: 34,
      commentCount: 15,
    },
    {
      id: "3",
      title: "Feedback on New Cafeteria Menu",
      content:
        "Let's discuss the recent changes to our cafeteria menu and share our thoughts on the new options.",
      author: {
        name: "Lisa Wong",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      },
      timestamp: "1 day ago",
      votes: 89,
      commentCount: 45,
    },
  ],
  onVote = () => {},
  onCommentClick = () => {},
  sortBy = "newest",
  onSortChange = () => {},
}: PostListProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg">
      <div className="mb-4 flex justify-end">
        <select
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as "newest" | "mostLiked")
          }
          className="p-2 border rounded-md bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>
      <ScrollArea className="h-[800px] w-full pr-4">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              timestamp={post.timestamp}
              votes={post.votes}
              commentCount={post.commentCount}
              onVote={(type) => onVote(post.id, type)}
              onCommentClick={() => onCommentClick(post.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PostList;
