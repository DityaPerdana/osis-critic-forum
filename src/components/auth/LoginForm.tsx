import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [nisn, setNisn] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateInput = () => {
    // Validate NISN (10 digits)
    if (!/^\d{10}$/.test(nisn)) {
      throw new Error("NISN must be exactly 10 digits");
    }

    // Validate name (no numbers)
    if (/\d/.test(name)) {
      throw new Error("Name cannot contain numbers");
    }

    if (name.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      validateInput();
      // Check if NISN is valid (10 digits)
      if (!/^\d{10}$/.test(nisn)) {
        throw new Error("NISN must be exactly 10 digits");
      }

      // First check if user exists
      const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("nisn", nisn)
        .single();

      if (existingUser) {
        // If user exists, verify name matches
        if (existingUser.name.toLowerCase() !== name.toLowerCase()) {
          throw new Error("Incorrect name for this NISN");
        }
        localStorage.setItem("user", JSON.stringify(existingUser));
      } else {
        // If user doesn't exist, create new user
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({ nisn, name })
          .select()
          .single();

        if (createError) throw createError;
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      window.location.reload(); // Refresh to update UI
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[400px] bg-white">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
      <CardHeader>
        <CardTitle className="text-center">OSIS Forum</CardTitle>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nisn">NISN</Label>
            <Input
              id="nisn"
              required
              maxLength={10}
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="Enter your NISN"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (mode === "login" ? "Logging in..." : "Signing up...") : (mode === "login" ? "Login" : "Sign Up")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
