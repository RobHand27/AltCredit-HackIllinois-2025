"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FieldValues, useForm } from "react-hook-form";
import { HiCheckCircle } from "react-icons/hi";

interface FormField {
  name: string;
  label: string;
  type: string;
}

interface ExpandableCardProps {
  title: string;
  formFields: FormField[];
  isCompleted: boolean;
  onComplete: (data: string) => void;
}

export function ExpandableCard({
  title,
  formFields,
  onComplete,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    setIsCompleted(true);
    setIsExpanded(false);
    onComplete(JSON.stringify(data));
  };

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white transition-all duration-300">
      {/* Card Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 flex justify-between items-center cursor-pointer"
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        {isCompleted && <HiCheckCircle className="h-8 w-8 text-green-500" />}
      </div>

      {/* Expanded Form Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    {...register(field.name, { required: true })}
                    className={`
                      w-full px-3 py-2 border rounded-md
                      ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm">
                      This field is required
                    </p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-[#00CED1] text-white py-2 px-4 rounded-md hover:bg-[#00CED1]/90 transition-colors"
              >
                Submit
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
