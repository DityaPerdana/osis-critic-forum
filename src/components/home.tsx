import React, { useState, useEffect } from "react";
import ForumHeader from "./forum/ForumHeader";
import PostList from "./forum/PostList";
import CreatePostDialog from "./forum/CreatePostDialog";
import CommentSection from "./forum/CommentSection";
import LoginForm from "./auth/LoginForm";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const [user, setUser] = useState<{
    name: string;
    avatar: string;
    role?: string;
  } | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "mostLiked">("newest");
  const [userVotes, setUserVotes] = useState<{ [key: string]: "up" | "down" }>(
    {},
  );
  const [userCommentVotes, setUserCommentVotes] = useState<{
    [key: string]: "up" | "down";
  }>({});

  useEffect(() => {
    const fetchUserVotes = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const { id: userId } = JSON.parse(userData);

      // Fetch post votes
      const { data: postVotes } = await supabase
        .from("post_votes")
        .select("post_id, vote_type")
        .eq("user_id", userId);

      if (postVotes) {
        const votes = postVotes.reduce(
          (acc, vote) => ({
            ...acc,
            [vote.post_id]: vote.vote_type,
          }),
          {},
        );
        setUserVotes(votes);
      }

      // Fetch comment votes
      const { data: commentVotes } = await supabase
        .from("comment_votes")
        .select("comment_id, vote_type")
        .eq("user_id", userId);

      if (commentVotes) {
        const votes = commentVotes.reduce(
          (acc, vote) => ({
            ...acc,
            [vote.comment_id]: vote.vote_type,
          }),
          {},
        );
        setUserCommentVotes(votes);
      }
    };

    fetchUserVotes();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const query = supabase.from("posts").select(`
          *,
          users:user_id (*)
        `);

      // Apply sorting
      if (sortBy === "newest") {
        query.order("created_at", { ascending: false });
      } else if (sortBy === "mostLiked") {
        query.order("votes", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      // Fetch comment counts for each post
      const commentCounts = await Promise.all(
        data.map(async (post) => {
          const { count } = await supabase
            .from("comments")
            .select("id", { count: "exact" })
            .eq("post_id", post.id);
          return { postId: post.id, count };
        }),
      );

      // Create a map of post ID to comment count
      const commentCountMap = commentCounts.reduce(
        (acc, { postId, count }) => ({
          ...acc,
          [postId]: count,
        }),
        {},
      );

      setPosts(
        data.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            name: post.users.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.users.name}`,
            role: post.users.role,
          },
          timestamp: new Date(post.created_at).toLocaleString(),
          votes: post.votes,
          commentCount: commentCountMap[post.id] || 0,
        })),
      );
    };

    fetchPosts();
  }, [sortBy]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsedUser.name}`,
        role: parsedUser.role,
      });
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    categoryId: string;
  }) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const { error } = await supabase.from("posts").insert({
        title: data.title,
        content: data.content,
        user_id: userId,
        category_id: data.categoryId,
        votes: 0,
      });

      if (error) throw error;
      window.location.reload(); // Refresh to show new post
    } catch (err) {
      console.error("Error creating post:", err);
    }
    setIsCreatePostOpen(false);
  };

  const handleVote = async (postId: string, type: "up" | "down") => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const { id: userId } = JSON.parse(userData);

      const existingVote = userVotes[postId];
      let voteChange = 0;

      if (existingVote === type) {
        // Remove vote if clicking same button
        await supabase
          .from("post_votes")
          .delete()
          .eq("user_id", userId)
          .eq("post_id", postId);
        voteChange = type === "up" ? -1 : 1;
        setUserVotes((prev) => {
          const newVotes = { ...prev };
          delete newVotes[postId];
          return newVotes;
        });
      } else {
        // Add or update vote
        await supabase.from("post_votes").upsert({
          user_id: userId,
          post_id: postId,
          vote_type: type,
        });
        voteChange =
          type === "up" ? (existingVote ? 2 : 1) : existingVote ? -2 : -1;
        setUserVotes((prev) => ({ ...prev, [postId]: type }));
      }

      // Update post votes
      const { data: post } = await supabase
        .from("posts")
        .select("votes")
        .eq("id", postId)
        .single();

      if (!post) return;

      const newVotes = (post.votes || 0) + voteChange;
      await supabase.from("posts").update({ votes: newVotes }).eq("id", postId);

      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, votes: newVotes } : p)),
      );
    } catch (err) {
      console.error("Error updating vote:", err);
    }
  };

  const handleCommentClick = async (postId: string) => {
    setSelectedPost(postId);
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        users:user_id (*)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(
      data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author: {
          name: comment.users.name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.users.name}`,
          role: comment.users.role,
        },
        timestamp: new Date(comment.created_at).toLocaleString(),
        votes: comment.votes || 0,
        parent_id: comment.parent_id,
        replies: [], // Will be populated by the CommentSection component
      })),
    );
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData || !selectedPost) return;

      const { id: userId } = JSON.parse(userData);
      const { error } = await supabase.from("comments").insert({
        content,
        user_id: userId,
        post_id: selectedPost,
        parent_id: parentId || null,
        votes: 0,
      });

      if (error) throw error;
      handleCommentClick(selectedPost); // Refresh comments
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleCommentVote = async (commentId: string, type: "up" | "down") => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const { id: userId } = JSON.parse(userData);

      const existingVote = userCommentVotes[commentId];
      let voteChange = 0;

      if (existingVote === type) {
        // Remove vote if clicking same button
        await supabase
          .from("comment_votes")
          .delete()
          .eq("user_id", userId)
          .eq("comment_id", commentId);
        voteChange = type === "up" ? -1 : 1;
        setUserCommentVotes((prev) => {
          const newVotes = { ...prev };
          delete newVotes[commentId];
          return newVotes;
        });
      } else {
        // Add or update vote
        await supabase.from("comment_votes").upsert({
          user_id: userId,
          comment_id: commentId,
          vote_type: type,
        });
        voteChange =
          type === "up" ? (existingVote ? 2 : 1) : existingVote ? -2 : -1;
        setUserCommentVotes((prev) => ({ ...prev, [commentId]: type }));
      }

      // Update comment votes
      const { data: comment } = await supabase
        .from("comments")
        .select("votes")
        .eq("id", commentId)
        .single();

      if (!comment) return;

      const newVotes = (comment.votes || 0) + voteChange;
      await supabase
        .from("comments")
        .update({ votes: newVotes })
        .eq("id", commentId);

      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, votes: newVotes } : c,
        ),
      );
    } catch (err) {
      console.error("Error updating comment vote:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ForumHeader user={user} onCreatePost={() => setIsCreatePostOpen(true)} />

      <main className="container mx-auto pt-24 px-4 flex gap-6">
        <div className="flex-1">
          <PostList
            posts={posts}
            onVote={handleVote}
            onCommentClick={handleCommentClick}
            sortBy={sortBy}
            onSortChange={setSortBy}
            userVotes={userVotes}
          />
        </div>

        {/* Desktop Comments */}
        {selectedPost && (
          <div className="w-[400px] hidden lg:block">
            <div className="sticky top-24">
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onVote={handleCommentVote}
                userVotes={userCommentVotes}
              />
            </div>
          </div>
        )}

        {/* Mobile Comments Dialog */}
        <div className="lg:hidden">
          <Dialog
            open={selectedPost !== null}
            onOpenChange={() => setSelectedPost(null)}
          >
            <DialogContent className="max-w-[95vw] h-[90vh]">
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onVote={handleCommentVote}
                userVotes={userCommentVotes}
              />
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        onSubmit={handleCreatePost}
        categories={categories}
      />
    </div>
  );
};

export default Home;
