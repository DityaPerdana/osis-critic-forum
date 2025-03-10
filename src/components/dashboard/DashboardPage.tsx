import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { supabase } from "@/lib/supabase";
import { useLoading } from "@/contexts/LoadingContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateUserDialog from "./CreateUserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";

const ITEMS_PER_PAGE = 30;
const ALLOWED_ROLES = [
  "Kepala Sekolah",
  "Waka Sekolah",
  "Ketua OSIS",
  "Ketua MPK",
  "Developer",
  "Admin",
];

const AVAILABLE_ROLES = [
  "RPL",
  "TKJ",
  "DKV",
  "BC",
  "Kepala Sekolah",
  "Waka Sekolah",
  "Ketua OSIS",
  "Ketua MPK",
  "Developer",
  "Admin",
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortOrder, setSortOrder] = useState({ ascending: false });

  const checkAccess = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!ALLOWED_ROLES.includes(userData.role)) {
      navigate("/");
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("users").select("*");
      
      // Apply search filter if search term exists
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,nisn.ilike.%${searchTerm}%`);
      }
      
      // Count total matching results for pagination
      const { count } = await query.select("*", { count: "exact", head: true });
      
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      
      // Apply sorting
      query = query.order(sortColumn, { ascending: sortOrder.ascending });
      
      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error } = await query.range(from, to);
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
    fetchUsers();
  }, [currentPage, searchTerm, sortColumn, sortOrder]);
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sort direction if clicking the same column
      setSortOrder({ ascending: !sortOrder.ascending });
    } else {
      // Set new sort column with default descending order
      setSortColumn(column);
      setSortOrder({ ascending: false });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = async (
    userId: string,
    updates: { name?: string; nisn?: string },
  ) => {
    try {
      setIsLoading(true);

      // Validate NISN if provided
      if (updates.nisn && !/^\d{8,10}$/.test(updates.nisn)) {
        alert("NISN must be between 8-10 digits");
        fetchUsers(); // Refresh to original values
        return;
      }

      // Validate name if provided
      if (updates.name) {
        if (/\d/.test(updates.name)) {
          alert("Name cannot contain numbers");
          fetchUsers();
          return;
        }
        if (updates.name.length < 3) {
          alert("Name must be at least 3 characters long");
          fetchUsers();
          return;
        }
      }

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (error) {
        alert(error.message);
        throw error;
      }

      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <Button onClick={() => setIsCreateUserOpen(true)}>Add User</Button>
          </div>
          
          {/* Search bar */}
          <div className="mb-4 flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("nisn")}
                  >
                    NISN
                    {sortColumn === "nisn" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder.ascending ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sortColumn === "name" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder.ascending ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("role")}
                  >
                    Role
                    {sortColumn === "role" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder.ascending ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("created_at")}
                  >
                    Joined
                    {sortColumn === "created_at" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder.ascending ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          defaultValue={user.nisn}
                          onBlur={(e) => {
                            if (e.target.value !== user.nisn) {
                              handleUserUpdate(user.id, {
                                nisn: e.target.value,
                              });
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          defaultValue={user.name}
                          onBlur={(e) => {
                            if (e.target.value !== user.name) {
                              handleUserUpdate(user.id, {
                                name: e.target.value,
                              });
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder={user.role} />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this user?",
                            )
                          ) {
                            setIsLoading(true);
                            try {
                              // First delete all user's posts and their associated comments
                              const { data: userPosts } = await supabase
                                .from("posts")
                                .select("id")
                                .eq("user_id", user.id);

                              if (userPosts) {
                                for (const post of userPosts) {
                                  // Delete comments for each post
                                  await supabase
                                    .from("comments")
                                    .delete()
                                    .eq("post_id", post.id);

                                  // Delete post votes
                                  await supabase
                                    .from("post_votes")
                                    .delete()
                                    .eq("post_id", post.id);
                                }

                                // Delete all posts
                                await supabase
                                  .from("posts")
                                  .delete()
                                  .eq("user_id", user.id);
                              }

                              // Delete user's comment votes
                              await supabase
                                .from("comment_votes")
                                .delete()
                                .eq("user_id", user.id);

                              // First get all comments by this user
                              const { data: userComments } = await supabase
                                .from("comments")
                                .select("id")
                                .eq("user_id", user.id);

                              if (userComments && userComments.length > 0) {
                                // Delete votes on these comments
                                await supabase
                                  .from("comment_votes")
                                  .delete()
                                  .in(
                                    "comment_id",
                                    userComments.map((c) => c.id),
                                  );

                                // For comments with replies, update content instead of deleting
                                for (const comment of userComments) {
                                  const { data: replies } = await supabase
                                    .from("comments")
                                    .select("id")
                                    .eq("parent_id", comment.id);

                                  if (replies && replies.length > 0) {
                                    // Update content if has replies
                                    await supabase
                                      .from("comments")
                                      .update({
                                        content:
                                          "[This comment has been deleted]",
                                      })
                                      .eq("id", comment.id);
                                  } else {
                                    // Delete if no replies
                                    await supabase
                                      .from("comments")
                                      .delete()
                                      .eq("id", comment.id);
                                  }
                                }
                              }

                              // Delete user's post votes
                              await supabase
                                .from("post_votes")
                                .delete()
                                .eq("user_id", user.id);

                              // Finally delete the user
                              const { error } = await supabase
                                .from("users")
                                .delete()
                                .eq("id", user.id);

                              if (error) throw error;
                              fetchUsers(); // Refresh the list
                            } catch (err) {
                              console.error("Error deleting user:", err);
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>

        <CreateUserDialog
          open={isCreateUserOpen}
          onOpenChange={setIsCreateUserOpen}
          onSuccess={fetchUsers}
        />
      </div>
    </div>
  );
};

export default DashboardPage;