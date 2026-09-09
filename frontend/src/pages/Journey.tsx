import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Journey() {
  const { journeyStep } = useAppContext();

  const steps = [
    { title: 'Eligibility Checked', desc: 'Profile analyzed by AI Navigator' },
    { title: 'Scheme Selected', desc: 'Optimal government scheme chosen' },
    { title: 'Partner Recommended', desc: 'Best matching bank identified' },
    { title: 'Documents Prepared', desc: 'OCR verification and readiness check' },
    { title: 'Application Submitted', desc: 'Form sent to channel partner' },
    { title: 'Under Verification', desc: 'Bank processing application' },
    { title: 'Approved', desc: 'Loan sanctioned' },
    { title: 'Disbursed', desc: 'Funds transferred to account' }
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[#171717] tracking-[-0.01em] text-center">
          Your Loan Journey
        </h1>
        <p className="text-sm text-[#6B7280] text-center mt-1">
          Track the progress of your credit application.
        </p>
      </div>

      <div className="relative border-l border-[#E8E8E6] ml-4 md:ml-6 space-y-6">
        {steps.map((step, i) => {
          const isCompleted = i < journeyStep;
          const isCurrent = i === journeyStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-8 md:pl-10"
            >
              <div
                className={`absolute -left-2 top-4 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-[#FAFAF8] ${
                  isCompleted
                    ? 'bg-[#059669]'
                    : isCurrent
                    ? 'bg-[#171717]'
                    : 'bg-[#E8E8E6]'
                }`}
              >
                {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
              </div>

              <div
                className={`bg-white border rounded-lg p-4 ${
                  isCurrent ? 'border-[#171717]' : 'border-[#E8E8E6]'
                } ${!isCompleted && !isCurrent ? 'opacity-50' : ''}`}
              >
                <h3 className="text-sm font-semibold text-[#171717]">{step.title}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{step.desc}</p>
                {isCompleted && (
                  <p className="text-[11px] text-[#059669] font-medium mt-2 flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Completed
                  </p>
                )}
                {isCurrent && (
                  <p className="text-[11px] text-[#D97706] font-medium mt-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> In Progress...
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
