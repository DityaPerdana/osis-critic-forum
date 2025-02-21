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

interface EditPostDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: { title: string; content: string }) => void;
  post?: {
    title: string;
    content: string;
  };
}

interface ValidationErrors {
  title?: string;
  content?: string;
}

const EditPostDialog = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  post = {
    title: "",
    content: "",
  },
}: EditPostDialogProps) => {
  const [title, setTitle] = React.useState(post.title);
  const [content, setContent] = React.useState(post.content);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  React.useEffect(() => {
    if (open) {
      setTitle(post.title);
      setContent(post.content);
      setErrors({});
    }
  }, [open, post]);

  const validate = () => {
    const newErrors: ValidationErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    onSubmit({ title, content });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] bg-white h-full">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1">
          <div>
            <Input
              placeholder="Enter post title"
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

          <Tabs defaultValue="write" className="flex-1">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="flex-1">
              <ScrollArea className="h-[350px]">
                <div>
                  <Textarea
                    placeholder="Write your post content here..."
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
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
