"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExpandableCard } from "@/components/ExpandableCard";
import { DocumentUploadCard } from "@/components/DocumentUploadCard";
import { handleAPIRequest } from "@/lib/utils";

export default function UploadPage() {
  const [completedSections, setCompletedSections] = useState({
    personalInfo: false,
    financialInfo: false,
    idDocument: false,
    proofOfIncome: false,
  });

  const [allSectionsCompleted, setAllSectionsCompleted] = useState(
    Object.values(completedSections).every((section) => {
      return section === true;
    })
  );

  useEffect(() => {
    setAllSectionsCompleted(
      Object.values(completedSections).every((section) => section === true)
    );
  }, [completedSections]);

  const handleSubmitAll = async () => {
    if (!allSectionsCompleted) return;

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
            onComplete={async (jsonString) => {
              const res = await handleAPIRequest(
                "update_general_info",
                "POST",
                JSON.parse(jsonString)
              );
              if (res.success) {
                setCompletedSections((prev) => ({
                  ...prev,
                  personalInfo: true,
                }));
              }
            }}
            formFields={[
              { name: "firstName", label: "First Name", type: "text" },
              { name: "lastName", label: "Last Name", type: "text" },
              { name: "phone", label: "Phone Number", type: "tel" },
              { name: "address", label: "Address", type: "text" },
            ]}
          />

          {/* Financial Information Form */}
          <ExpandableCard
            title="Digital Footprint Information"
            isCompleted={completedSections.financialInfo}
            onComplete={async (jsonString) => {
              const res = await handleAPIRequest(
                "update_digital",
                "POST",
                JSON.parse(jsonString)["Tiktok Username"]
              );
              if (res.success) {
                setCompletedSections((prev) => ({
                  ...prev,
                  financialInfo: true,
                }));
              }
            }}
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
          />

          {/* Document Upload Sections */}
          <DocumentUploadCard
            title="Upload Payment Proof for Electricity Bill, Phone Service, Rent, or Water Bill "
            isCompleted={completedSections.idDocument}
            onComplete={(data: any) =>
              setCompletedSections((prev) => ({ ...prev, idDocument: true }))
            }
            acceptedFileTypes=".pdf"
          />

          <DocumentUploadCard
            title="Upload International Credit Report, Proof of Income (W2), or value of owned property"
            isCompleted={completedSections.proofOfIncome}
            onComplete={(data: any) =>
              setCompletedSections((prev) => ({ ...prev, proofOfIncome: true }))
            }
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
  );
}
