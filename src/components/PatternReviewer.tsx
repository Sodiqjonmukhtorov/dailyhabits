import React, { useState } from 'react';
import { Volume2, Check, Sparkles, HelpCircle, Star, GraduationCap } from 'lucide-react';
import { SpeechPattern } from '../types';
import { PATTERNS_DATA } from '../data';

interface PatternReviewerProps {
  completedPatterns: string[];
  onTogglePattern: (id: string) => void;
}

export default function PatternReviewer({
  completedPatterns,
  onTogglePattern
}: PatternReviewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [draftSentences, setDraftSentences] = useState<Record<string, string>>({});
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});

  const categories = ['All', 'Opinion', 'Adding', 'Reason', 'Comparing', 'Uncertainty', 'Example', 'Ending'];

  const filteredPatterns = selectedCategory === 'All' 
    ? PATTERNS_DATA 
    : PATTERNS_DATA.filter(p => p.category === selectedCategory);

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveDraft = (id: string) => {
    const text = draftInputs[id];
    if (!text || !text.trim()) return;
    setDraftSentences(prev => ({ ...prev, [id]: text }));
    if (!completedPatterns.includes(id)) {
      onTogglePattern(id);
    }
  };

  const getPercentage = () => {
    if (PATTERNS_DATA.length === 0) return 0;
    return Math.round((completedPatterns.length / PATTERNS_DATA.length) * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Primary Pattern list and Category Filter */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-gray-900 tracking-tight text-base font-sans flex items-center gap-1.5">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Pattern Training Workspace
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Quyidagi 22 ta iborani baland ovozda 10 martadan turli gaplar ichida ishlating.
            </p>
          </div>

          <div className="font-mono text-xs bg-indigo-50 border border-indigo-150 text-indigo-700 px-3 py-1 rounded-full font-bold">
            {completedPatterns.length} / {PATTERNS_DATA.length} Practiced ({getPercentage()}%)
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat === 'All' ? 'Barchasi (All)' : cat}
            </button>
          ))}
        </div>

        {/* Patterns Grid */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filteredPatterns.map((pat) => {
            const isDone = completedPatterns.includes(pat.id);
            const userDraft = draftSentences[pat.id];
            
            return (
              <div 
                key={pat.id}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  isDone 
                    ? 'border-emerald-250 bg-emerald-50/10 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-semibold">
                        {pat.category}
                      </span>
                      <button
                        onClick={() => handlePronounce(pat.phrase)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Say Phrase"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-base font-extrabold text-indigo-950 tracking-wider font-sans mt-1">
                      {pat.phrase}
                    </h4>
                    <span className="text-xs text-gray-500 block font-sans font-medium mt-0.5">
                      {pat.uzbek}
                    </span>
                  </div>

                  <button
                    onClick={() => onTogglePattern(pat.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl border transition ${
                      isDone 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-600'
                    }`}
                  >
                    <Check className={`w-3 h-3 rounded-full p-0.5 ${isDone ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'}`} />
                    {isDone ? 'Used 10x' : 'Mark Practice'}
                  </button>
                </div>

                {/* Example sentence */}
                <div className="mt-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-500 uppercase tracking-widest font-mono text-[9px] block">
                    ILLUSTRATIVE EXAMPLE:
                  </span>
                  <p className="text-gray-700 mt-1 italic leading-relaxed">
                    "{pat.example}"
                  </p>
                  <p className="text-gray-500 mt-1 leading-relaxed text-[11px] font-sans border-t border-gray-200/50 pt-1">
                    Tarjimasi: "{pat.uzbekExample}"
                  </p>
                </div>

                {/* Draft your own sentence interface */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={draftInputs[pat.id] || ''}
                    onChange={(e) => setDraftInputs(prev => ({ ...prev, [pat.id]: e.target.value }))}
                    placeholder="O'zingiz og'zaki tuzgan gapingizni yozib tekshiring..."
                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleSaveDraft(pat.id)}
                    className="bg-indigo-50 hover:bg-indigo-150 text-indigo-700 font-bold text-xs px-3 py-2 rounded-xl transition"
                  >
                    Save
                  </button>
                </div>

                {userDraft && (
                  <div className="mt-2 bg-indigo-50/30 p-2.5 rounded-xl border border-indigo-100/50 text-xs text-indigo-950 flex justify-between items-center">
                    <span>
                      <strong>Sizning gapingiz:</strong> {userDraft}
                    </span>
                    <button
                      onClick={() => handlePronounce(userDraft)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Tips panel */}
      <div className="lg:col-span-4 space-y-6">
        {/* Core methodology advice */}
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl space-y-3">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Pattern Rule (Qoidalar)
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            Miyangiz so'zlashuvda to'g'ri grammatik strukutralarni avtomatik tanlashi uchun har bir patternni kamida 10 marotaba har xil gaplar ichida ovoz chiqarib ishlatishingiz zarur!
          </p>

          <div className="bg-white p-3 rounded-2xl text-[11px] text-gray-600 border border-indigo-100 leading-relaxed">
            <strong className="block text-indigo-700 uppercase font-mono text-[9px] mb-1">Retrieval Workout:</strong>
            1. Iborani o'qing.<br />
            2. Audio talaffuzini eshiting.<br />
            3. Aynan shu iborani ishlatib 10 ta tasodifiy gap tuzing.<br />
            4. Baland ovozda gapiring!
          </div>
        </div>

        {/* Random Pattern Prompt generator */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-3 shadow-sm">
          <h4 className="font-bold text-gray-900 tracking-tight font-sans text-sm">
            Quick Speaking Challenge
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ushbu tasodifiy iborani qo‘llab navbatdagi gap tuzishni mashq qiling:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-center space-y-2">
            <h5 className="font-extrabold text-indigo-900 text-sm font-sans">
              "{PATTERNS_DATA[Math.floor(Date.now() / 86400000) % PATTERNS_DATA.length].phrase}"
            </h5>
            <p className="text-xs text-gray-650 font-sans font-medium">
              Tarjimasi: "{PATTERNS_DATA[Math.floor(Date.now() / 86400000) % PATTERNS_DATA.length].uzbek}"
            </p>
            <p className="text-[10px] text-gray-400 italic">
              Category: {PATTERNS_DATA[Math.floor(Date.now() / 86400000) % PATTERNS_DATA.length].category}
            </p>
            <button
              onClick={() => handlePronounce(PATTERNS_DATA[Math.floor(Date.now() / 86400000) % PATTERNS_DATA.length].phrase)}
              className="mt-1 mx-auto bg-white border border-gray-200 hover:border-indigo-600 text-[10px] text-indigo-600 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              <Volume2 className="w-3 h-3" /> Talaffuz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
