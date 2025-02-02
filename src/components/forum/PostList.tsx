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
  userVotes?: { [key: string]: "up" | "down" };
  onVote?: (postId: string, type: "up" | "down") => void;
  onCommentClick?: (postId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const PostList = ({
  posts = [],
  onVote = () => {},
  onCommentClick = () => {},
  sortBy = "newest",
  onSortChange = () => {},
  userVotes = {},
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
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
              userVote={userVotes?.[post.id]}
              onCommentClick={() => onCommentClick(post.id)}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PostList;
