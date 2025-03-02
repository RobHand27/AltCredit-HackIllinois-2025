"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      if (localStorage.getItem("token")) {
        router.push("/upload");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-bold py-8 px-20 rounded-lg text-3xl shadow-lg transition-all"
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <span>Try It Out</span>
        </div>
      )}
    </Button>
  );
}
