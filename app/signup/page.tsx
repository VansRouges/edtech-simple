"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { useAuthStore } from "@/store/auth" // Import Zustand store

export default function SignupPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore() // Zustand function to store user state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const userData = {
        name: `${formData.get("firstName")} ${formData.get("lastName")}`,
        email: formData.get("email"),
        password: formData.get("password"),
    };

    try {
        const response = await fetch("https://edtech-saas-backend.vercel.app/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Signup failed. Please try again.");
        }

        console.log("Signup successful:", result);

        // Split full name into first and last name
        const [firstName, ...lastNameParts] = result.user.name.split(" ");
        const lastName = lastNameParts.join(" ") || ""; // Handles cases where there's only a first name

        // Store user in Zustand
        setUser({
            $id: result.user.$id,
            firstName,
            lastName,
            email: result.user.email,
        });
        setToken(result.token);
        console.log("User:", result.user);
        console.log("Token:", result.token)
        router.push("/role-selection");
    } catch (err) {
        const error = err as Error;
        setError(error.message || "An error occurred");
        console.error("Error:", error);
    } finally {
        setIsLoading(false);
    }
}


  return (
    <AuthLayout title="Create an account" description="Enter your details to get started">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input name="firstName" id="firstName" placeholder="John" disabled={isLoading} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input name="lastName" id="lastName" placeholder="Doe" disabled={isLoading} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" placeholder="name@example.com" type="email" autoComplete="email" disabled={isLoading} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" disabled={isLoading} required />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Already have an account? Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
