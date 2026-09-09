import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { IndianRupee, Calculator as CalcIcon, Activity, Sliders, Loader2 } from 'lucide-react';
import RiskBadge from '../components/ui/RiskBadge';
import { api } from '../services/api';

export default function Calculator() {
  const [tab, setTab] = useState<'emi' | 'health' | 'whatif'>('emi');

  // EMI State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(5);

  const r = rate / 12 / 100;
  const n = tenure * 12;
  const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  const pieData = [
    { name: 'Principal', value: loanAmount, color: '#171717' },
    { name: 'Interest', value: totalInterest, color: '#D4D4D2' }
  ];

  // What-If State
  const [wiLoanAmount, setWiLoanAmount] = useState(500000);
  const [wiRate, setWiRate] = useState(8.0);
  const [wiTenure, setWiTenure] = useState(60);
  const [wiMoratorium, setWiMoratorium] = useState(0);
  const [wiIncome, setWiIncome] = useState(50000);
  const [wiExpenses, setWiExpenses] = useState(20000);
  const [wiExistingEmi, setWiExistingEmi] = useState(0);
  const [wiResult, setWiResult] = useState<any>(null);
  const [wiLoading, setWiLoading] = useState(false);
  const [wiError, setWiError] = useState('');

  const runSimulation = async () => {
    setWiLoading(true);
    setWiError('');
    try {
      const result = await api.whatIfSimulate({
        loan_amount: wiLoanAmount,
        interest_rate: wiRate,
        tenure_months: wiTenure,
        moratorium_months: wiMoratorium,
        monthly_income: wiIncome,
        monthly_expenses: wiExpenses,
        existing_emi: wiExistingEmi,
      });
      setWiResult(result);
    } catch (err: any) {
      setWiError(err.message || 'Simulation failed');
    } finally {
      setWiLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#171717] tracking-[-0.01em]">Financial Tools</h1>
        <p className="text-sm text-[#6B7280] mt-1">Calculate EMI, assess health, and simulate scenarios.</p>
      </div>

      <div className="bg-white border border-[#E8E8E6] rounded-lg overflow-hidden">
        <div className="flex border-b border-[#E8E8E6]">
          <button
            type="button"
            onClick={() => setTab('emi')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center transition-colors duration-150 ${
              tab === 'emi'
                ? 'bg-[#F5F5F3] text-[#171717] border-b-2 border-[#171717]'
                : 'text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#FAFAF8]'
            }`}
          >
            <CalcIcon className="w-4 h-4 mr-2" />
            EMI Calculator
          </button>
          <button
            type="button"
            onClick={() => setTab('health')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center transition-colors duration-150 ${
              tab === 'health'
                ? 'bg-[#F5F5F3] text-[#171717] border-b-2 border-[#171717]'
                : 'text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#FAFAF8]'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            Financial Health
          </button>
          <button
            type="button"
            onClick={() => setTab('whatif')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center transition-colors duration-150 ${
              tab === 'whatif'
                ? 'bg-[#F5F5F3] text-[#171717] border-b-2 border-[#171717]'
                : 'text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#FAFAF8]'
            }`}
          >
            <Sliders className="w-4 h-4 mr-2" />
            What-If Simulator
          </button>
        </div>

        <div className="p-6 md:p-8">
          {tab === 'emi' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Loan Amount (₹ {loanAmount.toLocaleString()})
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={loanAmount}
                    onChange={e => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Interest Rate ({rate}%)
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="0.5"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    className="w-full accent-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Tenure ({tenure} Years)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenure}
                    onChange={e => setTenure(Number(e.target.value))}
                    className="w-full accent-[#171717]"
                  />
                </div>
              </div>

              <div className="bg-[#F5F5F3] border border-[#E8E8E6] rounded-lg p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm font-medium text-[#6B7280] mb-2">Monthly EMI</h3>
                <div className="text-3xl font-semibold text-[#171717] mb-6 flex items-center">
                  <IndianRupee className="w-7 h-7 mr-1" />
                  {Math.round(emi).toLocaleString()}
                </div>

                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => `₹ ${Math.round(value).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#E8E8E6',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#171717'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between w-full text-sm mt-4 text-[#171717]">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-[#171717] mr-2"></span>
                    <span className="text-sm font-medium text-[#171717]">Principal</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-[#D4D4D2] mr-2"></span>
                    <span className="text-sm font-medium text-[#171717]">Interest</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'health' && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-[#D4D4D2] mx-auto mb-4" />
              <h2 className="text-lg font-medium text-[#171717]">Financial Health Dashboard</h2>
              <p className="text-sm text-[#6B7280] mt-2 mb-6">
                Enter your income and expenses to check your FOIR (Fixed Obligation to Income Ratio).
              </p>
              <div className="inline-flex">
                <RiskBadge level="LOW" />
              </div>
            </div>
          )}

          {tab === 'whatif' && (
            <div>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Controls */}
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-[#171717] mb-2">Adjust Parameters</h3>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-1">
                      Loan Amount (₹ {wiLoanAmount.toLocaleString()})
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={wiLoanAmount}
                      onChange={e => setWiLoanAmount(Number(e.target.value))}
                      className="w-full accent-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-1">
                      Interest Rate ({wiRate}%)
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="24"
                      step="0.5"
                      value={wiRate}
                      onChange={e => setWiRate(Number(e.target.value))}
                      className="w-full accent-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-1">
                      Tenure ({wiTenure} months)
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="360"
                      step="6"
                      value={wiTenure}
                      onChange={e => setWiTenure(Number(e.target.value))}
                      className="w-full accent-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-1">
                      Moratorium ({wiMoratorium} months)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={wiMoratorium}
                      onChange={e => setWiMoratorium(Number(e.target.value))}
                      className="w-full accent-[#171717]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#171717] mb-1">Monthly Income (₹)</label>
                      <input
                        type="number"
                        value={wiIncome}
                        onChange={e => setWiIncome(Number(e.target.value))}
                        className="w-full bg-white border border-[#E8E8E6] rounded-md px-3 py-2 text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#171717] mb-1">Monthly Expenses (₹)</label>
                      <input
                        type="number"
                        value={wiExpenses}
                        onChange={e => setWiExpenses(Number(e.target.value))}
                        className="w-full bg-white border border-[#E8E8E6] rounded-md px-3 py-2 text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-1">Existing EMI (₹)</label>
                    <input
                      type="number"
                      value={wiExistingEmi}
                      onChange={e => setWiExistingEmi(Number(e.target.value))}
                      className="w-full bg-white border border-[#E8E8E6] rounded-md px-3 py-2 text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={runSimulation}
                    disabled={wiLoading}
                    className="w-full py-2.5 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#2D2D2D] transition-colors flex items-center justify-center disabled:opacity-60"
                  >
                    {wiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Simulating...
                      </>
                    ) : (
                      'Run Simulation'
                    )}
                  </button>

                  {wiError && <p className="text-sm text-[#DC2626]">{wiError}</p>}
                </div>

                {/* Results */}
                <div>
                  {wiResult ? (
                    <div className="space-y-6">
                      <h3 className="text-base font-semibold text-[#171717]">Simulation Results</h3>

                      {/* EMI Result */}
                      <div className="bg-[#F5F5F3] border border-[#E8E8E6] rounded-lg p-5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">
                          EMI Breakdown
                        </h4>
                        <div className="text-3xl font-semibold text-[#171717] flex items-center mb-4">
                          <IndianRupee className="w-7 h-7 mr-1" />
                          {Math.round(wiResult.emi.monthly_emi).toLocaleString()}
                          <span className="text-sm font-normal text-[#6B7280] ml-2">/ month</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white border border-[#E8E8E6] rounded-md p-3">
                            <div className="text-xs text-[#6B7280]">Total Payment</div>
                            <div className="font-semibold text-[#171717] mt-0.5">
                              ₹ {Math.round(wiResult.emi.total_payment).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white border border-[#E8E8E6] rounded-md p-3">
                            <div className="text-xs text-[#6B7280]">Total Interest</div>
                            <div className="font-semibold text-[#171717] mt-0.5">
                              ₹ {Math.round(wiResult.emi.total_interest).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Health Result */}
                      <div className="bg-[#F5F5F3] border border-[#E8E8E6] rounded-lg p-5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">
                          Financial Health
                        </h4>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-[#171717]">Risk Level</span>
                          <RiskBadge level={wiResult.financial_health.risk_level} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white border border-[#E8E8E6] rounded-md p-3">
                            <div className="text-xs text-[#6B7280]">EMI-to-Income</div>
                            <div className="font-semibold text-[#171717] mt-0.5">
                              {(wiResult.financial_health.emi_to_income_ratio * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-white border border-[#E8E8E6] rounded-md p-3">
                            <div className="text-xs text-[#6B7280]">Stress Score</div>
                            <div className="font-semibold text-[#171717] mt-0.5">
                              {wiResult.financial_health.financial_stress_score.toFixed(1)}
                            </div>
                          </div>
                          <div className="bg-white border border-[#E8E8E6] rounded-md p-3">
                            <div className="text-xs text-[#6B7280]">Disposable Income</div>
                            <div className="font-semibold text-[#171717] mt-0.5">
                              ₹ {Math.round(wiResult.financial_health.disposable_income).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white border border-[#E8E8E6] rounded-md p-3">
                            <div className="text-xs text-[#6B7280]">Safe EMI Range</div>
                            <div className="font-semibold text-[#059669] mt-0.5">
                              ₹ {Math.round(wiResult.financial_health.safe_emi_min).toLocaleString()} – {Math.round(wiResult.financial_health.safe_emi_max).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {wiResult.financial_health.recommendations && wiResult.financial_health.recommendations.length > 0 && (
                          <div className="mt-4 bg-[#F5F5F3] border border-[#E8E8E6] rounded-md p-3 text-sm text-[#6B7280] space-y-1">
                            {wiResult.financial_health.recommendations.map((rec: string, i: number) => (
                              <p key={i}>{rec}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Sliders className="w-12 h-12 text-[#D4D4D2] mb-4" />
                      <h3 className="text-base font-semibold text-[#171717] mb-1">Adjust & Simulate</h3>
                      <p className="text-sm text-[#6B7280] max-w-xs">
                        Set your loan parameters and financial details, then click "Run Simulation" to see how they affect your eligibility and financial health.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
