import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CreateUserDialog from "./CreateUserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  useEffect(() => {
    checkAccess();
    fetchUsers();
  }, [currentPage]);

  const checkAccess = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!ALLOWED_ROLES.includes(userData.role)) {
      navigate("/");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Get total count
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      // Get paginated data
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user role:", err);
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nisn}</TableCell>
                    <TableCell>{user.name}</TableCell>
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
                            const { error } = await supabase
                              .from("users")
                              .delete()
                              .eq("id", user.id);
                            if (error) {
                              console.error("Error deleting user:", error);
                            } else {
                              fetchUsers();
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
