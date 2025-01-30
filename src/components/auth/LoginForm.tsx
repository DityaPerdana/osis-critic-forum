import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

const LoginForm = () => {
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

      if (mode === "login") {
        // Login mode: Check if user exists and verify credentials
        const { data: existingUser } = await supabase
          .from("users")
          .select()
          .eq("nisn", nisn)
          .single();

        if (!existingUser) {
          throw new Error(
            "NISN not found. Please sign up if you're a new user.",
          );
        }

        if (existingUser.name.toLowerCase() !== name.toLowerCase()) {
          throw new Error("Incorrect name for this NISN");
        }

        localStorage.setItem("user", JSON.stringify(existingUser));
      } else {
        // Signup mode: Check if NISN already exists
        const { data: existingUser } = await supabase
          .from("users")
          .select()
          .eq("nisn", nisn)
          .single();

        if (existingUser) {
          throw new Error("NISN already registered. Please login instead.");
        }

        // Create new user
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
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/idk.webp')" }}
    >
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "login" | "signup")}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {mode === "login" ? "Login" : "Sign Up"}
            </CardTitle>
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
                {loading
                  ? mode === "login"
                    ? "Logging in..."
                    : "Signing up..."
                  : mode === "login"
                    ? "Login"
                    : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginForm;
