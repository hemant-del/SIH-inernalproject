import React, { useState } from 'react';
import { FileText, Download, Check } from 'lucide-react';

export default function Report() {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#171717] tracking-[-0.01em]">Project Report Generator</h1>
        <p className="text-sm text-[#6B7280] mt-1">Generate estimated business project reports for loan applications.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white border border-[#E8E8E6] rounded-lg p-6 self-start">
          <h2 className="text-base font-semibold text-[#171717] mb-4">Business Details</h2>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); setGenerated(true); }}>
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-1.5">Business Type</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-[#E8E8E6] rounded-md text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                defaultValue="Garment Manufacturing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-1.5">Total Investment</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white border border-[#E8E8E6] rounded-md text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                defaultValue={1500000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-1.5">Expected Monthly Revenue</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white border border-[#E8E8E6] rounded-md text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                defaultValue={250000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-1.5">Loan Required</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white border border-[#E8E8E6] rounded-md text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                defaultValue={1000000}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#171717] text-white text-sm font-medium rounded-md hover:bg-[#2D2D2D] transition-colors mt-2"
            >
              Generate Report
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          {!generated ? (
            <div className="bg-[#F5F5F3] border border-[#E8E8E6] rounded-lg relative min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
              <FileText className="w-12 h-12 text-[#D4D4D2] mb-4" />
              <p className="text-sm text-[#9CA3AF]">Fill the details and generate report to see preview</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E8E8E6] p-8 font-serif">
              <div className="flex justify-between items-start border-b border-[#E8E8E6] pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#171717]">ESTIMATED PROJECT REPORT</h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">Garment Manufacturing Unit</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9CA3AF]">Date: {new Date().toLocaleDateString()}</p>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded-sm mt-1 font-sans">
                    ESTIMATION ONLY
                  </span>
                </div>
              </div>

              <div className="space-y-6 text-[#171717] text-sm leading-relaxed" contentEditable suppressContentEditableWarning>
                <div>
                  <h3 className="text-sm font-semibold text-[#171717] border-b border-[#E8E8E6] pb-1 mb-2">1. Executive Summary</h3>
                  <p>
                    This report outlines the financial estimation for setting up a Garment Manufacturing Unit. The total estimated project cost is ₹15,00,000, out of which ₹5,00,000 will be promoter's contribution and ₹10,00,000 is proposed as a term loan.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#171717] border-b border-[#E8E8E6] pb-1 mb-2">2. Investment Breakdown</h3>
                  <table className="w-full mt-2 border-collapse border border-[#E8E8E6] text-sm text-left">
                    <thead>
                      <tr className="bg-[#F5F5F3] text-[#6B7280]">
                        <th className="border border-[#E8E8E6] px-3 py-1.5 font-medium">Particulars</th>
                        <th className="border border-[#E8E8E6] px-3 py-1.5 font-medium text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-[#E8E8E6] px-3 py-1.5">Machinery & Equipment</td>
                        <td className="border border-[#E8E8E6] px-3 py-1.5 text-right">8,00,000</td>
                      </tr>
                      <tr>
                        <td className="border border-[#E8E8E6] px-3 py-1.5">Working Capital (3 months)</td>
                        <td className="border border-[#E8E8E6] px-3 py-1.5 text-right">5,00,000</td>
                      </tr>
                      <tr>
                        <td className="border border-[#E8E8E6] px-3 py-1.5">Pre-operative Expenses</td>
                        <td className="border border-[#E8E8E6] px-3 py-1.5 text-right">2,00,000</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="border border-[#E8E8E6] px-3 py-1.5">Total</td>
                        <td className="border border-[#E8E8E6] px-3 py-1.5 text-right">15,00,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#171717] text-white text-sm font-medium rounded-md hover:bg-[#2D2D2D] transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
