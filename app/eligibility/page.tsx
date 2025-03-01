"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LoanCard } from "@/components/LoanCard"
import { useRouter } from "next/navigation"

interface LoanOption {
  id: number
  title: string
  description: string
  imageUrl: string
  threshold: number
  interestRate: string
  loanAmount: string
  term: string
}

export default function EligibilityPage() {
  const [threshold, setThreshold] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Sample loan options
  // idealy would be read from a table or API but not yet...
  const loanOptions: LoanOption[] = [
    {
      id: 1,
      title: "Personal Starter Loan",
      description: "Perfect for those beginning their credit journey. Low entry requirements with competitive rates.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      threshold: 1,
      interestRate: "8.99%",
      loanAmount: "$5,000",
      term: "36 months",
    },
    {
      id: 2,
      title: "Premium Credit Builder",
      description: "Designed for those with emerging credit profiles. Better rates with flexible payment options.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      threshold: 3,
      interestRate: "6.99%",
      loanAmount: "$10,000",
      term: "48 months",
    },
    {
      id: 3,
      title: "Elite Financial Solution",
      description: "Our premium offering for qualified borrowers. Best rates and highest loan amounts available.",
      imageUrl: "/placeholder.svg?height=200&width=200",
      threshold: 5,
      interestRate: "4.99%",
      loanAmount: "$25,000",
      term: "60 months",
    },
  ]

  // Fetch threshold from API
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const response = await fetch("/api/user-threshold")
        const data = await response.json()
        setThreshold(data.threshold)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching threshold:", error)
        setIsLoading(false)
      }
    }

    fetchThreshold()
  }, [])

  const handleAccept = async (loanId: number) => {
    try {
      await fetch("/api/accept-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loanId }),
      })
      // Handle success (e.g., show confirmation, redirect, etc.)
    } catch (error) {
      console.error("Error accepting loan:", error)
    }
  }

  const handleDecline = async (loanId: number) => {
    try {
      await fetch("/api/decline-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loanId }),
      })
      // Handle decline (e.g., show other options, feedback form, etc.)
    } catch (error) {
      console.error("Error declining loan:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00CED1] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Header */}
      <div className="w-full bg-gradient-to-b from-[#00008B] via-[#00008B] to-white py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-8"
        >
          Your Personalized Loan Options
        </motion.h1>
      </div>

      {/* Content Section */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`space-y-6 ${threshold >= 4 ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 gap-6"}`}>
          {loanOptions
            .filter((loan) => loan.threshold <= threshold)
            .map((loan) => (
              <LoanCard
                key={loan.id}
                title={loan.title}
                description={loan.description}
                imageUrl={loan.imageUrl}
                interestRate={loan.interestRate}
                loanAmount={loan.loanAmount}
                term={loan.term}
                onAccept={() => handleAccept(loan.id)}
                onDecline={() => handleDecline(loan.id)}
              />
            ))}
        </div>
      </main>
    </div>
  )
}

