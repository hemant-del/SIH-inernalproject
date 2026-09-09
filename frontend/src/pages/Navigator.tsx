import { api } from '../services/api';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, MessageCircle, ArrowRight } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import ScoreCircle from '../components/ui/ScoreCircle';

type Message = { id: string; sender: 'system' | 'user'; text: string; type?: 'text' | 'profile' | 'recommendations' };

export default function Navigator() {
  const { t } = useTranslation();
  const { isListening, startListening, stopListening, transcript, setTranscript } = useSpeech();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', text: t('aitalk.greeting'), type: 'text' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { userProfile, setUserProfile, setRecommendations, recommendations, setSelectedScheme, advanceJourney, language } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setTranscript('');
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map((msg) => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text }));
      const result = await api.extractIntent({ message: userMsg, language, conversation_history: conversationHistory });

      const updatedProfile = {
        ...userProfile,
        purpose: result.purpose ?? userProfile?.purpose,
        business_type: result.business_type ?? userProfile?.business_type,
        loan_amount: result.loan_amount ?? userProfile?.loan_amount,
        project_cost: result.project_cost ?? userProfile?.project_cost,
        annual_income: result.annual_income ?? userProfile?.annual_income,
        age: result.age ?? userProfile?.age,
        education_status: result.education_status ?? userProfile?.education_status,
        state: result.state ?? userProfile?.state,
        district: result.district ?? userProfile?.district,
      };
      setUserProfile(updatedProfile);

      const responseText = result.follow_up_question || "I've understood your requirements. I can now check suitable schemes for you.";
      const hasEnoughData = updatedProfile.purpose && updatedProfile.loan_amount && updatedProfile.annual_income;

      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'system', text: responseText, type: hasEnoughData ? 'profile' : 'text' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'system', text: t('aitalk.error') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!userProfile) return;
    setIsTyping(true);
    try {
      const result = await api.getRecommendations({
        income: userProfile.annual_income,
        loan_amount: userProfile.loan_amount,
        purpose: userProfile.purpose,
        project_cost: userProfile.project_cost || userProfile.loan_amount,
        age: userProfile.age,
        state: userProfile.state,
        district: userProfile.district,
      });
      const recs = (result.recommendations || []).map((r: any) => ({
        id: r.scheme_id, name: r.scheme_name, score: r.match_pct || r.score,
        max_loan: r.max_loan, desc: `${r.interest_rate}% interest, up to ${r.max_tenure_months} months`,
        ...r,
      }));
      setRecommendations(recs);
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'system', text: recs.length > 0 ? 'Here are the top schemes you are eligible for:' : 'No eligible schemes found for your profile. Try adjusting your requirements.', type: recs.length > 0 ? 'recommendations' : 'text' }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'system', text: t('aitalk.error') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    advanceJourney();
    navigate('/schemes');
  };

  return (
    <div className="flex-grow flex flex-col max-w-3xl mx-auto w-full p-4 sm:p-6 h-[calc(100vh-140px)]">
      <div className="flex flex-col flex-grow bg-white border border-[#E8E8E6] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="bg-white border-b border-[#E8E8E6] p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#171717] rounded-md flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#171717]">{t('aitalk.title')}</h2>
            <p className="text-[10px] text-[#059669] flex items-center font-medium">
              <span className="w-1.5 h-1.5 bg-[#059669] rounded-full mr-1.5 inline-block" />
              {t('aitalk.online')}
            </p>
          </div>
        </div>

        <div className="flex-grow bg-[#FAFAF8] p-4 overflow-y-auto" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'system' && (
                  <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[80%] ${msg.sender === 'user' ? 'bg-[#171717] text-white rounded-lg rounded-tr-sm p-3.5 text-sm' : 'bg-white border border-[#E8E8E6] text-[#171717] rounded-lg rounded-tl-sm p-3.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]'}`}>
                  {msg.type === 'text' || !msg.type ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : msg.type === 'profile' ? (
                    <div className="space-y-3">
                      <p className="font-medium text-[#171717]">{msg.text}</p>
                      <div className="bg-[#F5F5F3] border border-[#E8E8E6] rounded-md p-3 text-xs grid grid-cols-2 gap-2.5">
                        <div><span className="text-[#6B7280]">Purpose:</span> <span className="font-semibold text-[#171717]">{userProfile?.purpose || 'N/A'}</span></div>
                        <div><span className="text-[#6B7280]">Amount:</span> <span className="font-semibold text-[#171717]">{userProfile?.loan_amount ? `\u20B9${userProfile.loan_amount.toLocaleString()}` : 'N/A'}</span></div>
                        <div><span className="text-[#6B7280]">Income:</span> <span className="font-semibold text-[#171717]">{userProfile?.annual_income ? `\u20B9${userProfile.annual_income.toLocaleString()}` : 'N/A'}</span></div>
                        <div><span className="text-[#6B7280]">State:</span> <span className="font-semibold text-[#171717]">{userProfile?.state || 'N/A'}</span></div>
                      </div>
                      <button type="button" onClick={handleCheckEligibility} className="w-full py-2 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#2D2D2D] transition-colors">
                        {t('aitalk.checkEligibility')}
                      </button>
                    </div>
                  ) : msg.type === 'recommendations' ? (
                    <div className="space-y-3 w-full sm:w-80">
                      <p className="font-medium text-[#171717]">{msg.text}</p>
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="bg-white border border-[#E8E8E6] rounded-md p-3 hover:border-[#D4D4D2] transition-colors cursor-pointer" onClick={() => handleSelectScheme(rec)}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm text-[#171717]">{rec.name}</h4>
                            <ScoreCircle score={rec.score} size={36} />
                          </div>
                          <p className="text-xs text-[#6B7280] mb-2.5">{rec.desc}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-[#059669]">Up to \u20B9{(rec.max_loan / 100000).toFixed(1)}L</span>
                            <span className="flex items-center font-medium text-[#171717] hover:text-[#0D6E4F] transition-colors">View Details <ArrowRight className="w-3 h-3 ml-1" /></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex mb-4">
                <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"><MessageCircle className="w-3 h-3 text-white" /></div>
                <div className="bg-white border border-[#E8E8E6] rounded-lg rounded-tl-sm p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex space-x-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white border-t border-[#E8E8E6] p-4 flex items-center space-x-2">
          <button type="button" onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-md border transition-colors flex items-center justify-center ${isListening ? 'bg-[#FEF2F2] border-[#DC2626]/20 text-[#DC2626] animate-pulse' : 'bg-[#F5F5F3] border-[#E8E8E6] text-[#6B7280] hover:text-[#171717] hover:bg-[#E8E8E6]'}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}>
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('aitalk.placeholder')}
            className="flex-grow bg-[#F5F5F3] border border-[#E8E8E6] rounded-md px-3 py-2.5 text-sm text-[#171717] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717] transition-colors" />
          <button type="button" onClick={handleSend} disabled={!input.trim() || isTyping}
            className="p-2 bg-[#171717] text-white rounded-md hover:bg-[#2D2D2D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            title="Send message">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
