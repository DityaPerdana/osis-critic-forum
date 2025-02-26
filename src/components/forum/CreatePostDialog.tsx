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
    isAnonymous: boolean;
  }) => void;
  categories?: { id: string; name: string }[];
}

interface ValidationErrors {
  title?: string;
  category?: string;
  content?: string;
}

const CreatePostDialog = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  categories = [],
}: CreatePostDialogProps) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  const validate = () => {
    const newErrors: ValidationErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!categoryId) newErrors.category = "Category is required";
    if (!content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    onSubmit({ title, content, categoryId, isAnonymous });
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
            <div>
              <Input
                placeholder="Write a title for your discussion..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                className={`text-lg font-semibold ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={`w-full p-2 border rounded-md ${errors.category ? "border-red-500" : ""}`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-600">
                Post Anonymously
              </label>
            </div>
          </div>

          <Tabs defaultValue="write" className="flex-1">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="flex-1">
              <ScrollArea className="h-[350px]">
                <div>
                  <Textarea
                    placeholder="Share your thoughts, ideas, or questions here..."
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setErrors((prev) => ({ ...prev, content: undefined }));
                    }}
                    className={`min-h-[300px] resize-none ${errors.content ? "border-red-500" : ""}`}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.content}
                    </p>
                  )}
                </div>
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
