"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExpandableCard } from "../components/ExpandableCard"
import { DocumentUploadCard } from "../components/DocumentUploadCard"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  dob: string
  ssn: string
  income: string
}

export default function DocumentUpload() {
  const [completedSections, setCompletedSections] = useState({
    personalInfo: false,
    financialInfo: false,
    idDocument: false,
    proofOfIncome: false,
  })

  const allSectionsCompleted = Object.values(completedSections).every((section) => section === true)

  const handleSubmitAll = async () => {
    if (!allSectionsCompleted) return

    try {
      // API call would go here
      console.log("Submitting all data to API...")
    } catch (error) {
      console.error("Error submitting data:", error)
    }
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
          Upload documentation and see your eligibility
        </motion.h1>
      </div>

      {/* Content Section */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Form */}
          <ExpandableCard
            title="Personal Information"
            isCompleted={completedSections.personalInfo}
            onComplete={() => setCompletedSections((prev) => ({ ...prev, personalInfo: true }))}
            formFields={[
              { name: "firstName", label: "First Name", type: "text" },
              { name: "lastName", label: "Last Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone Number", type: "tel" },
              { name: "address", label: "Address", type: "text" },
            ]}
          />

          {/* Financial Information Form */}
          <ExpandableCard
            title="Financial Information"
            isCompleted={completedSections.financialInfo}
            onComplete={() => setCompletedSections((prev) => ({ ...prev, financialInfo: true }))}
            formFields={[
              { name: "income", label: "Annual Income", type: "number" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "ssn", label: "SSN (last 4 digits)", type: "password" },
            ]}
          />

          {/* Document Upload Sections */}
          <DocumentUploadCard
            title="Government ID"
            isCompleted={completedSections.idDocument}
            onComplete={() => setCompletedSections((prev) => ({ ...prev, idDocument: true }))}
            acceptedFileTypes=".pdf"
          />

          <DocumentUploadCard
            title="Proof of Income"
            isCompleted={completedSections.proofOfIncome}
            onComplete={() => setCompletedSections((prev) => ({ ...prev, proofOfIncome: true }))}
            acceptedFileTypes=".pdf"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSubmitAll}
            disabled={!allSectionsCompleted}
            className={`
              px-8 py-4 text-xl font-bold rounded-lg shadow-lg transition-all
              ${
                allSectionsCompleted
                  ? "bg-[#00CED1] hover:bg-[#00CED1]/90 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Show My Eligibility
          </button>
        </div>
      </main>
    </div>
  )
}

