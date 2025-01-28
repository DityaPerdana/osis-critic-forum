import React from "react";
import { Button } from "@/components/ui/button";
import { PenSquare, Bell, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
    <header className="w-full h-16 bg-white border-b border-gray-200 fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">OSIS Forum</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2">
                    <NavigationMenuLink className="block px-2 py-1 hover:bg-gray-100 rounded">
                      General Discussion
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block px-2 py-1 hover:bg-gray-100 rounded">
                      Announcements
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block px-2 py-1 hover:bg-gray-100 rounded">
                      Events
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="default"
            onClick={onCreatePost}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Create Post
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

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
