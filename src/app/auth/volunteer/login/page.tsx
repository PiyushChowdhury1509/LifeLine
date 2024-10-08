"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Loader2 } from "lucide-react"; // Import loading icon

export default function VolunteerSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"volunteer" | "hospital">("volunteer");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        role,
      });

      if (result && !result.error) {
        setIsLoading(false);
        const redirectUrl = role === "volunteer" ? "/volunteer/dashboard" : "/hospital/dashboard";
        router.push(redirectUrl);
        toast.success("Signed in successfully");
      } else {
        setIsLoading(false);
        toast.error(result?.error || "Sign-in failed");
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error("Sign-in failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
      <BackgroundBeamsWithCollision>
        <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full border border-white/40"> {/* Updated glassy form */}
          <h2 className="text-3xl font-extrabold mb-6 text-center text-white">🔒 Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-white text-sm font-bold mb-2">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-transparent border-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="password" className="block text-white text-sm font-bold mb-2">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-transparent border-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="role" className="block text-white text-sm font-bold mb-2">Role</Label>
              <Select onValueChange={(value) => setRole(value as "volunteer" | "hospital")} defaultValue={role}>
                <SelectTrigger className="w-full bg-transparent text-white border-none">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </BackgroundBeamsWithCollision>

      <ToastContainer />
    </div>
  );
}
