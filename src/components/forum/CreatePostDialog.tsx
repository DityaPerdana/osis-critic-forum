import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatePostDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: {
    title: string;
    content: string;
    categoryId: string;
  }) => void;
  categories?: { id: string; name: string }[];
}

const CreatePostDialog = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  categories = [],
}: CreatePostDialogProps) => {
  const [title, setTitle] = React.useState("Sample Discussion Title");
  const [content, setContent] = React.useState("Write your thoughts here...");
  const [categoryId, setCategoryId] = React.useState("");

  const handleSubmit = () => {
    onSubmit({ title, content, categoryId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] bg-white h-full">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1">
          <div className="space-y-4">
            <Input
              placeholder="Enter discussion title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <Tabs defaultValue="write" className="flex-1">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="flex-1">
              <ScrollArea className="h-[350px]">
                <Textarea
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="flex-1">
              <ScrollArea className="h-[350px] border rounded-md p-4">
                <div className="prose">
                  <h2>{title}</h2>
                  <div className="whitespace-pre-wrap">{content}</div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Publish Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
