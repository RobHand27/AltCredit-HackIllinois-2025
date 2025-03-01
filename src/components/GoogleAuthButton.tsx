"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const token = "dummy token"
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      })
      if (response.ok) {
        const data = await response.json()
        const { authToken } = data
        if (authToken) {
          localStorage.setItem("authToken", authToken)
          router.push("/upload")
        } else {
          console.error("Authentication token missing")
        }
      } else {
        console.error("Authentication failed")
      }

    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-bold py-8 px-20 rounded-lg text-3xl shadow-lg transition-all disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <FcGoogle className="h-12 w-12" />
          <span>Try It Out</span>
        </div>
      )}
    </button>
  )
}

