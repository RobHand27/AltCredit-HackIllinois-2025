"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"
import { gapi } from "gapi-script" // needs to be included in the package json

const CLIENT_ID = "YOUR_CLIENT_ID"

export function GoogleAuthButton() {
  const router = useRouter()

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: "profile email",
      })
    }
    gapi.load("client:auth2", start)
  }, [])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate brief loading
      navigate("/upload")
    } catch (error) {
      console.error("Navigation error:", error)
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

