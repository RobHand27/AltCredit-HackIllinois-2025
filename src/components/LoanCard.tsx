"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { HiCheckCircle, HiXCircle } from "react-icons/hi"

interface LoanCardProps {
  title: string
  description: string
  imageUrl: string
  interestRate: string
  loanAmount: string
  term: string
  onAccept: () => void
  onDecline: () => void
}

export function LoanCard({
  title,
  description,
  imageUrl,
  interestRate,
  loanAmount,
  term,
  onAccept,
  onDecline,
}: LoanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-6">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} width={100} height={100} className="rounded-lg" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {/* Loan Details */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="text-lg font-semibold">{interestRate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="text-lg font-semibold">{loanAmount}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Term</p>
                  <p className="text-lg font-semibold">{term}</p>
                </div>
              </div>

              {/* Accept/Decline Buttons */}
              <div className="flex justify-between mt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={onAccept}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <HiCheckCircle className="h-5 w-5" />
                  Accept
                </button>
                <button
                  onClick={onDecline}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <HiXCircle className="h-5 w-5" />
                  Decline
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

