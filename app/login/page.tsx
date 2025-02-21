"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useAuthStore() // Zustand function to store user state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    console.log("FormData", formData);
  
    try {
      // Step 1: Login Request
      const authResponse = await fetch("https://edtech-saas-backend.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!authResponse.ok) throw new Error("Invalid credentials");
  
      const authData = await authResponse.json();
      console.log("Auth Result:", authData);
  
      const token = authData.token;
      setToken(token);
  
      setUser({
        $id: authData.session.$id,
        firstName: "",
        lastName: "",
        email: authData.session.providerUid,
      });
  
      // Step 2: Fetch Profile by Email
      const profileResponse = await fetch(`https://edtech-saas-backend.vercel.app/api/profile/${formData.email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!profileResponse.ok) throw new Error("Failed to fetch user profile");
  
      const profileData = await profileResponse.json();
      console.log("Profile Data:", profileData);
  
      if (profileData.profile) {
        // Store profile in Zustand
        useProfileStore.getState().setProfile(profileData.profile);
        router.push("/dashboard");
      } else {
        router.push("/role-selection");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <AuthLayout title="Welcome back" description="Enter your credentials to access your account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            required
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            disabled={isLoading}
            required
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
          Don&#39;t have an account? Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
