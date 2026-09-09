import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, FileCheck } from 'lucide-react';
import ReadinessBar from '../components/ui/ReadinessBar';

export default function Documents() {
  const [readiness, setReadiness] = useState(40);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const docsList = [
    { name: 'Aadhaar Card', req: true, has: true },
    { name: 'PAN Card', req: true, has: true },
    { name: 'Udyam Registration', req: true, has: false, tip: 'Required for MSME benefits.' },
    { name: 'Bank Statement (6 months)', req: true, has: false, tip: 'Ensure clear transaction history.' },
    { name: 'Project Report', req: false, has: false }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(true);
      setTimeout(() => {
        setExtractedData({
          name: 'Rajesh Kumar',
          income: '₹ 4,50,000',
          certificateNumber: 'UDYAM-MH-19-XXXXXXX',
          confidence: 94
        });
        setReadiness(75);
        setIsScanning(false);
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 grid lg:grid-cols-2 gap-8">
      {/* Readiness */}
      <div className="bg-white border border-[#E8E8E6] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileCheck className="w-4 h-4 text-[#6B7280]" />
          <h2 className="text-base font-semibold text-[#171717]">Document Readiness</h2>
        </div>
        
        <div className="mb-6">
          <ReadinessBar score={readiness} label="Application Readiness Score" colorScheme={readiness > 70 ? 'success' : 'saffron'} />
        </div>

        <h3 className="text-sm font-medium text-[#171717] mb-3">Required Documents Checklist</h3>
        <div className="space-y-3">
          {docsList.map((doc, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[#FAFAF8] rounded-md border border-[#E8E8E6]">
              {doc.has ? (
                <CheckCircle className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#D97706] mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-[#171717]">
                  {doc.name} {doc.req && <span className="text-[#DC2626]">*</span>}
                </p>
                {doc.tip && !doc.has && <p className="text-xs text-[#9CA3AF] mt-1">{doc.tip}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OCR Scanner */}
      <div className="bg-white border border-[#E8E8E6] rounded-lg p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <UploadCloud className="w-4 h-4 text-[#6B7280]" />
          <h2 className="text-base font-semibold text-[#171717]">Document Scanner (OCR)</h2>
        </div>
        <p className="text-sm text-[#6B7280] mb-6">
          Upload your documents. Our AI will extract key fields automatically to save you time. (Information Extraction only, not verification)
        </p>
        
        <label className="border border-dashed border-[#D4D4D2] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAFAF8] transition-colors group mb-6">
          <FileText className="w-10 h-10 text-[#D4D4D2] group-hover:text-[#9CA3AF] mb-3 transition-colors" />
          <p className="text-sm font-medium text-[#171717]">Click or drag files here</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Supports PDF, JPG, PNG up to 5MB</p>
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>

        {isScanning && (
          <div className="flex-grow flex flex-col items-center justify-center py-6">
            <div className="w-8 h-8 border-2 border-[#E8E8E6] border-t-[#171717] rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-[#6B7280]">Extracting document information...</p>
          </div>
        )}

        {extractedData && !isScanning && (
          <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-lg p-4 flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-[#059669]">Extracted Data</h3>
              <span className="text-[11px] font-medium bg-[#D1FAE5] text-[#059669] px-1.5 py-0.5 rounded-sm">
                {extractedData.confidence}% Confidence
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-[#6B7280] mb-0.5">Applicant Name</p>
                <p className="text-sm font-medium text-[#171717]">{extractedData.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280] mb-0.5">Declared Income</p>
                <p className="text-sm font-medium text-[#171717]">{extractedData.income}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-[#6B7280] mb-0.5">Udyam Number</p>
                <p className="text-sm font-medium text-[#171717]">{extractedData.certificateNumber}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
