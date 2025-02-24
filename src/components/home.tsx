import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import ForumHeader from "./forum/ForumHeader";
import PostList from "./forum/PostList";
import CreatePostDialog from "./forum/CreatePostDialog";
import EditPostDialog from "./forum/EditPostDialog";
import CommentSection from "./forum/CommentSection";
import LoginForm from "./auth/LoginForm";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const { setIsLoading } = useLoading();
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(
    null,
  );
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "mostLiked">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const POSTS_PER_PAGE = 30;
  const [userVotes, setUserVotes] = useState<{ [key: string]: "up" | "down" }>(
    {},
  );
  const [userCommentVotes, setUserCommentVotes] = useState<{
    [key: string]: "up" | "down";
  }>({});
  const [editingComment, setEditingComment] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // First get total count
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      setTotalPages(Math.ceil((count || 0) / POSTS_PER_PAGE));

      // Then get paginated data
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const query = supabase
        .from("posts")
        .select(
          `
          *,
          users:user_id (*)
        `,
        )
        .range(from, to);

      // Apply sorting
      if (sortBy === "newest") {
        query.order("created_at", { ascending: false });
      } else if (sortBy === "mostLiked") {
        query.order("votes", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        return;
      }

      if (!data) {
        setPosts([]);
        return;
      }

      // Fetch comment counts for each post
      const commentCounts = await Promise.all(
        data.map(async (post) => {
          try {
            const { count } = await supabase
              .from("comments")
              .select("id", { count: "exact" })
              .eq("post_id", post.id);
            return { postId: post.id, count };
          } catch (err) {
            console.error(`Error fetching comments for post ${post.id}:`, err);
            return { postId: post.id, count: 0 };
          }
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
            id: post.user_id,
            name: post.is_anonymous
              ? "Anonymous"
              : post.users?.name || "Unknown User",
            avatar: post.is_anonymous
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous${post.id}`
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.users?.name || "unknown"}`,
            role: post.is_anonymous ? "Anonymous" : post.users?.role,
          },
          timestamp: formatDistanceToNow(new Date(post.created_at), {
            addSuffix: true,
          }),
          votes: post.votes || 0,
          commentCount: commentCountMap[post.id] || 0,
        })),
      );
    } catch (err) {
      console.error("Error in fetchPosts:", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, currentPage]);

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
      try {
        const { data, error } = await supabase.from("categories").select("*");

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
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
    isAnonymous: boolean;
  }) => {
    if (!data.title.trim() || !data.content.trim() || !data.categoryId) {
      console.error("All fields are required");
      return;
    }

    setIsLoading(true);
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
        is_anonymous: data.isAnonymous,
      });

      if (error) throw error;
      fetchPosts(); // Refresh posts instead of reloading
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsLoading(false);
      setIsCreatePostOpen(false);
    }
  };

  const handleEditPost = async (data: { title: string; content: string }) => {
    if (!editingPost?.id) return;

    if (!data.title.trim() || !data.content.trim()) {
      console.error("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: data.title,
          content: data.content,
        })
        .eq("id", editingPost.id);

      if (error) throw error;

      // Update local state immediately
      setPosts(
        posts.map((post) => {
          if (post.id === editingPost.id) {
            return {
              ...post,
              title: data.title,
              content: data.content,
            };
          }
          return post;
        }),
      );

      // Close the dialog
      setEditingPost(null);
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (postId: string, type: "up" | "down") => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentClick = async (postId: string) => {
    setIsLoading(true);
    setSelectedPost(postId);
    try {
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
            id: comment.user_id,
            name: comment.users.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.users.name}`,
            role: comment.users.role,
          },
          timestamp: formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
          }),
          votes: comment.votes || 0,
          parent_id: comment.parent_id,
          replies: [], // Will be populated by the CommentSection component
        })),
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentVote = async (commentId: string, type: "up" | "down") => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ForumHeader onCreatePost={() => setIsCreatePostOpen(true)} user={user} />

      <div className="container mx-auto px-4 py-8">
        <PostList
          posts={posts}
          onVote={handleVote}
          onCommentClick={handleCommentClick}
          sortBy={sortBy}
          onSortChange={setSortBy}
          userVotes={userVotes}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={(post) => setEditingPost(post)}
          onDelete={(postId) => setDeletingPostId(postId)}
          currentUserId={
            user ? JSON.parse(localStorage.getItem("user") || "{}").id : null
          }
        />
      </div>

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        onSubmit={handleCreatePost}
        categories={categories}
      />

      {editingPost && (
        <EditPostDialog
          open={true}
          onOpenChange={() => setEditingPost(null)}
          onSubmit={handleEditPost}
          post={editingPost}
        />
      )}

      <Dialog
        open={selectedPost !== null}
        onOpenChange={() => setSelectedPost(null)}
      >
        <DialogContent className="max-w-3xl">
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onVote={handleCommentVote}
            userVotes={userCommentVotes}
            onEdit={(commentId, content) =>
              setEditingComment({ id: commentId, content })
            }
            onDelete={(commentId) => setDeletingCommentId(commentId)}
            currentUserId={
              user ? JSON.parse(localStorage.getItem("user") || "{}").id : null
            }
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingPostId !== null}
        onOpenChange={(open) => !open && setDeletingPostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={async () => {
                if (!deletingPostId) return;
                setIsLoading(true);
                try {
                  // First delete all comments
                  await supabase
                    .from("comments")
                    .delete()
                    .eq("post_id", deletingPostId);

                  // Then delete the post
                  const { error } = await supabase
                    .from("posts")
                    .delete()
                    .eq("id", deletingPostId);

                  if (error) throw error;

                  // Update local state
                  setPosts(posts.filter((post) => post.id !== deletingPostId));
                  setDeletingPostId(null);
                } catch (err) {
                  console.error("Error deleting post:", err);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deletingCommentId !== null}
        onOpenChange={(open) => !open && setDeletingCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={async () => {
                if (!deletingCommentId) return;
                setIsLoading(true);
                try {
                  const { error } = await supabase
                    .from("comments")
                    .delete()
                    .eq("id", deletingCommentId);

                  if (error) throw error;

                  // Update local state
                  setComments(
                    comments.filter(
                      (comment) => comment.id !== deletingCommentId,
                    ),
                  );
                  setDeletingCommentId(null);
                } catch (err) {
                  console.error("Error deleting comment:", err);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={editingComment !== null}
        onOpenChange={(open) => !open && setEditingComment(null)}
      >
        <DialogContent className="max-w-[500px]">
          <div className="py-4">
            <Textarea
              value={editingComment?.content || ""}
              onChange={(e) =>
                setEditingComment((prev) =>
                  prev ? { ...prev, content: e.target.value } : null,
                )
              }
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingComment(null)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!editingComment) return;
                setIsLoading(true);
                try {
                  const { error } = await supabase
                    .from("comments")
                    .update({ content: editingComment.content })
                    .eq("id", editingComment.id);

                  if (error) throw error;

                  // Update local state
                  setComments(
                    comments.map((comment) =>
                      comment.id === editingComment.id
                        ? { ...comment, content: editingComment.content }
                        : comment,
                    ),
                  );
                  setEditingComment(null);
                } catch (err) {
                  console.error("Error updating comment:", err);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
