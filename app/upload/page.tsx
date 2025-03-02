"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExpandableCard } from "@/components/ExpandableCard";
import { DocumentUploadCard } from "@/components/DocumentUploadCard";
import { handleAPIRequest } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const [completedSections, setCompletedSections] = useState({
    general_info: false,
    digital_footprint: false,
    cash_flow: false,
    official_documents: false,
  });

  const [formData, setFormData] = useState({
    general_info: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    },
    digital_footprint: {
      tiktok: {
        username: "",
        followers: -1,
      },
      instagram: {
        username: "",
        followers: -1,
      },
      facebook: {
        username: "",
        followers: -1,
      },
    },
    cash_flow: null,
    official_documents: null,
  });

  const [allSectionsCompleted, setAllSectionsCompleted] = useState(false);

  useEffect(() => {
    setAllSectionsCompleted(
      Object.values(completedSections).every((section) => section === true)
    );
  }, [completedSections]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await handleAPIRequest("me");
      if (res.success) {
        const data = res.data;
        setFormData({
          general_info: data.general_info || {},
          digital_footprint: data.digital_footprint || {},
          cash_flow: data.cash_flow || null,
          official_documents: data.official_documents || null,
        });
        setCompletedSections({
          general_info: !!data.general_info,
          digital_footprint: !!data.digital_footprint,
          cash_flow: !!data.cash_flow,
          official_documents: !!data.official_documents,
        });
        console.log("filled in", JSON.stringify(data));
      } else {
        alert(res.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmitAll = async () => {
    if (!allSectionsCompleted) return;

    try {
      alert("Application submitted successfully!");
      router.push("/eligibility");
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
        <div className="flex flex-col space-y-8">
          {/* Personal Information Form */}
          <ExpandableCard
            title="Personal Information"
            isCompleted={completedSections.general_info}
            onComplete={async (jsonString) => {
              const res = await handleAPIRequest(
                "update_general_info",
                "POST",
                JSON.parse(jsonString)
              );
              if (res.success) {
                setCompletedSections((prev) => ({
                  ...prev,
                  general_info: true,
                }));
              } else {
                alert(res.message);
              }
            }}
            formFields={[
              {
                name: "firstName",
                label: "First Name",
                type: "text",
                defaultValue: formData.general_info.firstName,
              },
              {
                name: "lastName",
                label: "Last Name",
                type: "text",
                defaultValue: formData.general_info.lastName,
              },
              {
                name: "phone",
                label: "Phone Number",
                type: "tel",
                defaultValue: formData.general_info.phone,
              },
              {
                name: "address",
                label: "Address",
                type: "text",
                defaultValue: formData.general_info.address,
              },
            ]}
          />

          {/* Financial Information Form */}
          <ExpandableCard
            title="Digital Footprint Information"
            isCompleted={completedSections.digital_footprint}
            onComplete={async (jsonString) => {
              const res = await handleAPIRequest(
                "update_digital",
                "POST",
                JSON.parse(jsonString)["Tiktok Username"]
              );
              if (res.success) {
                setCompletedSections((prev) => ({
                  ...prev,
                  digital_footprint: true,
                }));
              } else {
                alert(res.message);
              }
            }}
            formFields={[
              {
                name: "Tiktok Username",
                label: "Tiktok Username",
                type: "text",
                defaultValue: formData.digital_footprint.tiktok?.username || "",
              },
              {
                name: "Instagram Username",
                label: "Instagram Username",
                type: "text",
                defaultValue:
                  formData.digital_footprint.instagram?.username || "",
              },
              {
                name: "Facebook Username",
                label: "Facebook Username",
                type: "text",
                defaultValue:
                  formData.digital_footprint.facebook?.username || "",
              },
            ]}
          />

          {/* Document Upload Sections */}
          <DocumentUploadCard
            title="Upload Payment Proof for Electricity Bill, Phone Service, Rent, or Water Bill "
            isCompleted={completedSections.cash_flow}
            onComplete={async (data: File) => {
              const formData = new FormData();
              formData.append("file", data);
              const res = await handleAPIRequest(
                "upload_cashflow",
                "POST",
                formData,
                true
              );
              if (res.success) {
                setCompletedSections((prev) => ({ ...prev, cash_flow: true }));
              } else {
                alert(res.message);
              }
            }}
            acceptedFileTypes=".pdf"
          />

          <DocumentUploadCard
            title="Upload International Credit Report, Proof of Income (W2), or value of owned property"
            isCompleted={true}
            onComplete={async (data: File) => {
              const formData = new FormData();
              formData.append("file", data);
              const res = await handleAPIRequest(
                "upload_official_document",
                "POST",
                formData,
                true
              );
              if (res.success) {
                setCompletedSections((prev) => ({
                  ...prev,
                  official_documents: true,
                }));
              } else {
                alert(res.message);
              }
            }}
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
