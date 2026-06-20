import React, { useState } from 'react';
import { Sparkles, ArrowRight, Volume2, Save, RotateCcw, Check, HelpCircle } from 'lucide-react';

interface SavedExpansion {
  id: string;
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  date: string;
}

interface SentenceExpansionWidgetProps {
  onSavedCountChange: () => void;
}

const TEMPLATE_SENTENCES = [
  "I like football.",
  "I study English.",
  "I want to drink coffee.",
  "I wake up early.",
  "I use technology.",
  "I love my hometown.",
  "I read books."
];

export default function SentenceExpansionWidget({
  onSavedCountChange
}: SentenceExpansionWidgetProps) {
  const [l1, setL1] = useState<string>("I like football.");
  const [l2, setL2] = useState<string>("");
  const [l3, setL3] = useState<string>("");
  const [l4, setL4] = useState<string>("");

  const [savedExpansions, setSavedExpansions] = useState<SavedExpansion[]>(() => {
    const saved = localStorage.getItem('fluency_flow_expansions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeExplainLevel, setActiveExplainLevel] = useState<number>(2);

  const getWordCount = (str: string) => {
    const clean = str.trim();
    return clean ? clean.split(/\s+/).length : 0;
  };

  const loadTemplate = (text: string) => {
    setL1(text);
    setL2("");
    setL3("");
    setL4("");
  };

  const handleClear = () => {
    setL1("");
    setL2("");
    setL3("");
    setL4("");
  };

  const handlePronounce = (text: string) => {
    if (!text.trim()) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    if (!l1.trim() || !l2.trim() || !l3.trim() || !l4.trim()) return;
    const newExpansion: SavedExpansion = {
      id: "exp-" + Date.now(),
      l1,
      l2,
      l3,
      l4,
      date: new Date().toLocaleDateString()
    };
    const updated = [newExpansion, ...savedExpansions];
    setSavedExpansions(updated);
    localStorage.setItem('fluency_flow_expansions', JSON.stringify(updated));
    onSavedCountChange(); // Trigger score upgrade in app parent state

    // reset fields
    setL2("");
    setL3("");
    setL4("");
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedExpansions.filter(x => x.id !== id);
    setSavedExpansions(updated);
    localStorage.setItem('fluency_flow_expansions', JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Active Expansion Workbook */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-gray-900 tracking-tight text-base font-sans flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" /> Sentence Expansion Simulator
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Practice stretching small simple structures into descriptive details.
              </p>
            </div>
            
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Quick templates choice */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest font-bold text-gray-400 uppercase">
              CHOOSE A SAMPLE TO START:
            </span>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATE_SENTENCES.map((ts, idx) => (
                <button
                  key={idx}
                  onClick={() => loadTemplate(ts)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition ${
                    l1 === ts 
                      ? 'bg-pink-50 text-pink-700 border-pink-200' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {ts}
                </button>
              ))}
            </div>
          </div>

          {/* Core Level inputs */}
          <div className="space-y-4 pt-2">
            {/* LEVEL 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1">
                  <span className="w-4 h-4 bg-gray-250 text-indigo-700 font-bold rounded-full text-[9px] flex items-center justify-center border">L1</span>
                  Level 1: Simple Sentence
                </span>
                <span className="font-mono text-gray-500 text-[10px]">
                  {getWordCount(l1)} words
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={l1}
                  onChange={(e) => setL1(e.target.value)}
                  placeholder="Enter starting simple sentence..."
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition"
                />
                <button
                  onClick={() => handlePronounce(l1)}
                  disabled={!l1.trim()}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border text-gray-600 transition"
                  title="Pronounce L1"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LEVEL 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1 cursor-pointer" onClick={() => setActiveExplainLevel(2)}>
                  <span className="w-4 h-4 bg-pink-100 text-pink-700 font-bold rounded-full text-[9px] flex items-center justify-center">L2</span>
                  Level 2: Add Reason (because...)
                </span>
                <span className="font-mono text-gray-500 text-[10px]">
                  {getWordCount(l2)} words
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={l2}
                  onChange={(e) => setL2(e.target.value)}
                  placeholder="Extend L1 by introducing a reason (e.g., '... because it is exciting')"
                  className="w-full text-xs font-semibold border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition"
                />
                <button
                  onClick={() => handlePronounce(l2)}
                  disabled={!l2.trim()}
                  className="p-3 bg-gray-50 hover:bg-gray-150 rounded-2xl border text-gray-600 transition"
                  title="Pronounce L2"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LEVEL 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1 cursor-pointer" onClick={() => setActiveExplainLevel(3)}>
                  <span className="w-4 h-4 bg-pink-100 text-pink-700 font-bold rounded-full text-[9px] flex items-center justify-center">L3</span>
                  Level 3: Add Benefit/Action (...and helps...)
                </span>
                <span className="font-mono text-gray-500 text-[10px]">
                  {getWordCount(l3)} words
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={l3}
                  onChange={(e) => setL3(e.target.value)}
                  placeholder="Extend L2 further by adding a benefit (e.g., '... and helps me relax')"
                  className="w-full text-xs font-semibold border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition"
                />
                <button
                  onClick={() => handlePronounce(l3)}
                  disabled={!l3.trim()}
                  className="p-3 bg-gray-50 hover:bg-gray-150 rounded-2xl border text-gray-600 transition"
                  title="Pronounce L3"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LEVEL 4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1 cursor-pointer" onClick={() => setActiveExplainLevel(4)}>
                  <span className="w-4 h-4 bg-pink-100 text-pink-700 font-bold rounded-full text-[9px] flex items-center justify-center">L4</span>
                  Level 4: Add Context/Situation (...after a long day)
                </span>
                <span className="font-mono text-gray-500 text-[10px]">
                  {getWordCount(l4)} words
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={l4}
                  onChange={(e) => setL4(e.target.value)}
                  placeholder="Extend L3 with time or situational context (e.g., '... after a stressful day')"
                  className="w-full text-xs font-semibold border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition"
                />
                <button
                  onClick={() => handlePronounce(l4)}
                  disabled={!l4.trim()}
                  className="p-3 bg-gray-50 hover:bg-gray-150 rounded-2xl border text-gray-600 transition"
                  title="Pronounce L4"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex gap-2">
            <button
              onClick={handleSave}
              disabled={!l1.trim() || !l2.trim() || !l3.trim() || !l4.trim()}
              className={`w-full font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 ${
                (!l1.trim() || !l2.trim() || !l3.trim() || !l4.trim())
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              <Save className="w-4 h-4" /> Drill Tugatildi & Saqlash
            </button>
          </div>
        </div>
      </div>

      {/* Guide Companion Column */}
      <div className="lg:col-span-5 space-y-6">
        {/* Dynamic educational assistant */}
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl space-y-3">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest font-mono flex items-center gap-1">
            <HelpCircle className="w-4 h-4" /> Sentence Stretching Tips
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            Miyani chet tilida murakkab bog'lovchi gaplar tuzishga o'rgatish orqali real-time speaking jarayonidagi to'xtalishlarni yo'q qilamiz.
          </p>

          <div className="space-y-2 pt-2">
            <div className="bg-white p-3 rounded-2xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block font-mono">BOSQICH 2 (Sabab):</span>
              <p className="text-[11px] text-gray-600">Bog'lovchi so'zlar: <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">because</code>, <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">since</code>, <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">as</code>.</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block font-mono">BOSQICH 3 (Foyda/Natija):</span>
              <p className="text-[11px] text-gray-600">Ibora qo'shing: <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">and helps me to...</code>, <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">allowing me to...</code>.</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block font-mono">BOSQICH 4 (Vaziyat):</span>
              <p className="text-[11px] text-gray-600">Vaqt qo'shing: <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">after a long busy day</code>, <code className="bg-gray-100 px-1 text-pink-600 font-mono font-bold rounded">in my spare time</code>.</p>
            </div>
          </div>
        </div>

        {/* Saved Drills List */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-3 shadow-sm">
          <h4 className="font-bold text-gray-900 tracking-tight font-sans text-sm">
            Saved Expansions ({savedExpansions.length})
          </h4>
          
          {savedExpansions.length > 0 ? (
            <div className="max-h-[220px] overflow-y-auto space-y-3.5 pr-1">
              {savedExpansions.map((item) => (
                <div key={item.id} className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 position relative group">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-2">
                    <span>{item.date}</span>
                    <button
                      onClick={() => handleDeleteSaved(item.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-gray-400"><strong className="text-gray-500 font-mono text-[10px]">L1:</strong> {item.l1}</p>
                    <p className="text-gray-400"><strong className="text-gray-500 font-mono text-[10px]">L2:</strong> {item.l2}</p>
                    <p className="text-gray-400"><strong className="text-gray-500 font-mono text-[10px]">L3:</strong> {item.l3}</p>
                    <p className="text-indigo-900 font-medium bg-white p-2 border border-gray-100 rounded-xl leading-relaxed flex justify-between items-start">
                      <span><strong className="text-indigo-600 font-mono text-[10px]">L4:</strong> {item.l4}</span>
                      <button
                        onClick={() => handlePronounce(item.l4)}
                        className="text-indigo-600 hover:text-indigo-800 ml-1.5 mt-0.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-400">
              Hali hech qanday kengaytirilgan gap saqlanmagan. Yuqorida mashqni yakunlab "Saqlash" tugmasini bosing!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
