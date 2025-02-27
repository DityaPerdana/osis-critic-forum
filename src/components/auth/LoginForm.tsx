import { useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

const LoginForm = () => {
  const [mode] = useState<"login" | "signup">("login");
  const [nisn, setNisn] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("RPL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateInput = () => {
    // Validate NISN (8-10 digits)
    if (!/^\d{8,10}$/.test(nisn)) {
      throw new Error("NISN must be between 8-10 digits");
    }

    // Validate name (no numbers)
    if (/\d/.test(name)) {
      throw new Error("Name cannot contain numbers");
    }

    if (name.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
  };

  const { setIsLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsLoading(true);

    try {
      validateInput();

      // Login mode: Check if user exists and verify credentials
      const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("nisn", nisn.trim())
        .single();

      if (!existingUser) {
        throw new Error(
          "NISN not found. Please contact administrator to create an account.",
        );
      }

      if (
        existingUser.name.toLowerCase().trim() !== name.toLowerCase().trim()
      ) {
        throw new Error("Incorrect name for this NISN");
      }

      localStorage.setItem("user", JSON.stringify(existingUser));

      window.location.reload(); // Refresh to update UI
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/idk.webp')" }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 left-4 z-20">
          <Link
            to="/"
            className="text-white hover:text-blue-200 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </div>

        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <Tabs value={mode}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Login
              </CardTitle>
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="login">Login</TabsTrigger>
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
                    minLength={8}
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
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
