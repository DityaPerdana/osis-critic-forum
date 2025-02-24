import React from "react";
import { Button } from "@/components/ui/button";
import { PenSquare, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ForumHeaderProps {
  onCreatePost?: () => void;
  user?: {
    name: string;
    avatar: string;
  };
}

const ForumHeader = ({
  onCreatePost = () => {},
  user = {
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
}: ForumHeaderProps) => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(() => {
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const allowedRoles = [
              "Kepala Sekolah",
              "Waka Sekolah",
              "Ketua OSIS",
              "Ketua MPK",
              "Developer",
              "Admin",
            ];
            if (allowedRoles.includes(userData.role)) {
              return (
                <Link
                  to="/dashboard"
                  className="text-xl font-bold hover:text-blue-600 transition-colors"
                >
                  OSIS
                </Link>
              );
            }
            return <h1 className="text-xl font-bold">OSIS</h1>;
          })()}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              onClick={onCreatePost}
              className="flex items-center gap-2"
            >
              <PenSquare className="h-4 w-4" />
              Create Post
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
                className="text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ForumHeader;
