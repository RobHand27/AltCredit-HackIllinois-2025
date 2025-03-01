"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiCheckCircle, HiUpload } from "react-icons/hi"

interface DocumentUploadCardProps {
  title: string
  acceptedFileTypes: string
  isCompleted: boolean
  onComplete: () => void
  userId: string
}

export function DocumentUploadCard({ title, acceptedFileTypes }: DocumentUploadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handleFiles(files)
  }

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0]
      if (file.type === "application/pdf") {
        setFileName(file.name)
        // Here you would typically upload the file to your server
        setTimeout(() => {
          setIsCompleted(true)
          setIsExpanded(false)
        }, 1000)
      } else {
        alert("Please upload a PDF file")
      }
    }
  }

  return (
    <div
      onClick={() => !isCompleted && setIsExpanded(!isExpanded)}
      className={`
        relative rounded-lg border border-gray-200 bg-white transition-all duration-300
        ${isExpanded ? "md:col-span-2" : ""}
        ${isCompleted ? "cursor-default" : "cursor-pointer hover:shadow-lg"}
      `}
    >
      {/* Card Header */}
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        {isCompleted && <HiCheckCircle className="h-8 w-8 text-green-500" />}
      </div>

      {/* Expanded Upload Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center
                ${isDragging ? "border-[#00CED1] bg-[#00CED1]/10" : "border-gray-300"}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept={acceptedFileTypes}
                onChange={handleFileInput}
                className="hidden"
              />
              <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">
                Drag and drop your PDF here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#00CED1] hover:text-[#00CED1]/90"
                >
                  browse
                </button>
              </p>
              {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center rounded-lg">
          <HiCheckCircle className="h-16 w-16 text-green-500" />
        </div>
      )}
    </div>
  )
}

