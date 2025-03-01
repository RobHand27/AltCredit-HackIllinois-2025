"use client"

import { ExpandableCard } from "@/components/expandable-card"
import { DocumentUploadCard } from "@/components/document-upload-card"
import { motion } from "framer-motion"

export default function UploadPage() {
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
            formFields={[
              { name: "income", label: "Annual Income", type: "number" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "ssn", label: "SSN (last 4 digits)", type: "password" },
            ]}
          />

          {/* Document Upload Sections */}
          <DocumentUploadCard title="Government ID" acceptedFileTypes=".pdf" />

          <DocumentUploadCard title="Proof of Income" acceptedFileTypes=".pdf" />
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {}} // Will be implemented with API
            className="px-8 py-4 text-xl font-bold rounded-lg shadow-lg transition-all bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
          >
            Show My Eligibility
          </button>
        </div>
      </main>
    </div>
  )
}

