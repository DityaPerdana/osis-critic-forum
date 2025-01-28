import React, { useState, useEffect } from "react";
import ForumHeader from "./forum/ForumHeader";
import PostList from "./forum/PostList";
import CreatePostDialog from "./forum/CreatePostDialog";
import CommentSection from "./forum/CommentSection";
import LoginForm from "./auth/LoginForm";
import { supabase } from "@/lib/supabase";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(
    null,
  );
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "mostLiked">("newest");

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

      setPosts(
        data.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            name: post.users.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.users.name}`,
          },
          timestamp: new Date(post.created_at).toLocaleString(),
          votes: post.votes,
          commentCount: 0,
        })),
      );
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsedUser.name}`,
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
      const { data: post } = await supabase
        .from("posts")
        .select("votes")
        .eq("id", postId)
        .single();

      if (!post) return;

      const newVotes = post.votes + (type === "up" ? 1 : -1);

      const { error } = await supabase
        .from("posts")
        .update({ votes: newVotes })
        .eq("id", postId);

      if (error) throw error;

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
        },
        timestamp: new Date(comment.created_at).toLocaleString(),
        votes: comment.votes || 0,
        parent_id: comment.parent_id,
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
      });

      if (error) throw error;
      handleCommentClick(selectedPost); // Refresh comments
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleCommentVote = async (commentId: string, type: "up" | "down") => {
    try {
      const { data: comment } = await supabase
        .from("comments")
        .select("votes")
        .eq("id", commentId)
        .single();

      if (!comment) return;

      const newVotes = (comment.votes || 0) + (type === "up" ? 1 : -1);

      const { error } = await supabase
        .from("comments")
        .update({ votes: newVotes })
        .eq("id", commentId);

      if (error) throw error;

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
          />
        </div>

        {selectedPost && (
          <div className="w-[400px] hidden lg:block">
            <div className="sticky top-24">
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onVote={handleCommentVote}
              />
            </div>
          </div>
        )}
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
