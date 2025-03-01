"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExpandableCard } from "@/components/ExpandableCard";
import { DocumentUploadCard } from "@/components/DocumentUploadCard";

export default function UploadPage() {
  // const [userId, setUserId] = useState<string>("")
  // const [completedSections, setCompletedSections] = useState({
  //   personalInfo: false,
  //   financialInfo: false,
  //   idDocument: false,
  //   proofOfIncome: false,
  // })
  const [userId, setUserId] = useState<string>("testUserId123"); // Mocked userId for testing
  const [completedSections, setCompletedSections] = useState({
    personalInfo: false,
    financialInfo: false,
    idDocument: false,
    proofOfIncome: false,
  });

  // // Fetch or set user ID when component mounts
  // useEffect(() => {
  //   // This would typically come from your auth system
  //   const fetchUserId = async () => {
  //     try {
  //       const response = await fetch("/api/user")
  //       const data = await response.json()
  //       setUserId(data.userId)
  //     } catch (error) {
  //       console.error("Error fetching user ID:", error)
  //     }
  //   }

  //   fetchUserId()
  // }, [])

  const allSectionsCompleted = Object.values(completedSections).every(
    (section) => section === true
  );

  const handleSubmitAll = async () => {
    if (!allSectionsCompleted) return;

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Handle successful submission
        alert("Application submitted successfully!");
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00CED1] border-t-transparent"></div>
      </div>
    );
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
            isCompleted={completedSections.personalInfo} // idk why this throws error
            onComplete={() =>
              setCompletedSections((prev) => ({ ...prev, personalInfo: true }))
            }
            formFields={[
              { name: "firstName", label: "First Name", type: "text" },
              { name: "lastName", label: "Last Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone Number", type: "tel" },
              { name: "address", label: "Address", type: "text" },
            ]}
            userId={userId}
          />

          {/* Financial Information Form */}
          <ExpandableCard
            title="Digital Footprint Information"
            isCompleted={completedSections.financialInfo}
            onComplete={() =>
              setCompletedSections((prev) => ({ ...prev, financialInfo: true }))
            }
            formFields={[
              {
                name: "Tiktok Username",
                label: "Tiktok Username",
                type: "text",
              },
              {
                name: "Instagram Username",
                label: "Instagram Username",
                type: "text",
              },
              {
                name: "Facebook Username",
                label: "Facebook Username",
                type: "text",
              },
            ]}
            userId={userId}
          />

          {/* Document Upload Sections */}
          <DocumentUploadCard
            title="Upload Payment Proof for Electricity Bill, Phone Service, Rent, or Water Bill "
            isCompleted={completedSections.idDocument}
            onComplete={() =>
              setCompletedSections((prev) => ({ ...prev, idDocument: true }))
            }
            acceptedFileTypes=".pdf"
            userId={userId}
          />

          <DocumentUploadCard
            title="Upload International Credit Report, Proof of Income (W2), or value of owned property"
            isCompleted={completedSections.proofOfIncome}
            onComplete={() =>
              setCompletedSections((prev) => ({ ...prev, proofOfIncome: true }))
            }
            acceptedFileTypes=".pdf"
            userId={userId}
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
  );
}
