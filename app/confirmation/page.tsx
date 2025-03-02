"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ConfirmationPage: React.FC = () => {
  const router = useRouter();

  const handleConfirm = () => {
    router.push("/");
  };

  const loanDetails = {
    amount: "$10,000",
    interestRate: "5%",
    term: "5 years",
    monthlyPayment: "$188.71",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Congratulations!
        </h1>
        <p className="text-lg mb-6">Your loan has been approved.</p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Loan Details</h2>
          <p className="text-lg">Amount: {loanDetails.amount}</p>
          <p className="text-lg">Interest Rate: {loanDetails.interestRate}</p>
          <p className="text-lg">Term: {loanDetails.term}</p>
          <p className="text-lg">
            Monthly Payment: {loanDetails.monthlyPayment}
          </p>
        </div>
        <button
          onClick={handleConfirm}
          className="bg-[#00CED1] hover:bg-[#00CED1]/90 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
