import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface CreateUserDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

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

const CreateUserDialog = ({
  open = false,
  onOpenChange = () => {},
  onSuccess = () => {},
}: CreateUserDialogProps) => {
  const [nisn, setNisn] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("RPL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateInput = () => {
    if (!/^\d{8,10}$/.test(nisn)) {
      throw new Error("NISN must be between 8-10 digits");
    }

    if (/\d/.test(name)) {
      throw new Error("Name cannot contain numbers");
    }

    if (name.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      validateInput();

      // Check if NISN already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("nisn", nisn)
        .single();

      if (existingUser) {
        throw new Error("NISN already registered");
      }

      // Create new user
      const { error: createError } = await supabase
        .from("users")
        .insert({ nisn, name, role });

      if (createError) throw createError;

      onSuccess();
      onOpenChange(false);
      setNisn("");
      setName("");
      setRole("RPL");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nisn">NISN</Label>
            <Input
              id="nisn"
              required
              maxLength={10}
              minLength={8}
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="Enter NISN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              {AVAILABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
