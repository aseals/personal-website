import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectList from "@/components/project-list";
import MinimalDataAIRoadmap from "@/components/admin/minimal-data-ai-roadmap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PASSWORD_KEY = "admin_password_hash";

type Mode = "loading" | "create" | "login" | "authenticated";

async function hashPassword(password: string) {
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return password;
}

export default function Admin() {
  const [mode, setMode] = useState<Mode>("loading");
  const [storedHash, setStoredHash] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(PASSWORD_KEY);
    setStoredHash(saved);
    setMode(saved ? "login" : "create");
  }, []);

  useEffect(() => {
    if (mode === "create" || mode === "login") {
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setIsProcessing(false);
    }
  }, [mode]);

  useEffect(() => {
    if (authenticated) {
      setMode("authenticated");
    }
  }, [authenticated]);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: authenticated,
  });

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsProcessing(true);
    try {
      const hashed = await hashPassword(password);
      window.localStorage.setItem(PASSWORD_KEY, hashed);
      setStoredHash(hashed);
      setAuthenticated(true);
    } catch (err) {
      console.error("Failed to create password", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!storedHash) {
      setMode("create");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    setIsProcessing(true);
    try {
      const hashed = await hashPassword(password);
      if (hashed === storedHash) {
        setAuthenticated(true);
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      console.error("Failed to verify password", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && window.confirm("Reset admin password?")) {
      window.localStorage.removeItem(PASSWORD_KEY);
      setStoredHash(null);
      setAuthenticated(false);
      setMode("create");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setMode(storedHash ? "login" : "create");
  };

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading admin view…</span>
      </div>
    );
  }

  if (mode === "create" || mode === "login") {
    const isCreate = mode === "create";
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Admin Access</h1>
            <p className="text-sm text-muted-foreground">
              {isCreate
                ? "Create a password to secure the admin area. This password is stored locally in your browser."
                : "Enter the admin password to view the private roadmap."}
            </p>
          </div>
          <form className="space-y-4" onSubmit={isCreate ? handleCreate : handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {isCreate && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Please wait…" : isCreate ? "Create password" : "Unlock admin view"}
            </Button>
          </form>
          {mode === "login" && (
            <Button variant="ghost" className="w-full" onClick={handleReset}>
              Reset password
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 grid lg:grid-cols-[300px_1fr] gap-x-32">
        <div className="order-2 lg:order-1 mt-8 lg:mt-[240px] lg:ml-[120px]">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 bg-muted rounded mb-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 grid lg:grid-cols-[300px_1fr] gap-x-32">
      <div className="order-1 lg:order-2 mt-[240px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-medium mb-1">Ayanna Seals, PhD</h1>
            <p className="text-muted-foreground text-base">
              Adventurer and UX Strategist Turning Complex Data into Clear, Actionable Insights
            </p>
            <div className="mt-4 space-x-6">
              <a
                href="https://www.linkedin.com/in/ayannaseals/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="https://scholar.google.com/citations?user=-XXuiGkAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Scholar
              </a>
              <a
                href="mailto:seals.pro@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Email
              </a>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Lock
          </Button>
        </div>
        <div className="mt-10">
          <MinimalDataAIRoadmap />
        </div>
      </div>
      <div className="order-2 lg:order-1 mt-8 lg:mt-[240px] lg:ml-[120px]">
        <ProjectList projects={projects || []} />
      </div>
    </div>
  );
}
