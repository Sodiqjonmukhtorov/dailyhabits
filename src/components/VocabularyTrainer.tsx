import React, { useState } from 'react';
import { Volume2, Check, RefreshCw, ChevronLeft, ChevronRight, HelpCircle, Star, ArrowRight, Play, Square, Sparkles } from 'lucide-react';
import { DayData, VocabWord } from '../types';
import { WEAK_STRONG_PAIRS } from '../data';

interface VocabularyTrainerProps {
  dayData: DayData;
  completedWords: string[];
  onToggleWord: (english: string) => void;
}

export default function VocabularyTrainer({
  dayData,
  completedWords,
  onToggleWord
}: VocabularyTrainerProps) {
  const [activeTab, setActiveTab] = useState<'day' | 'upgrade' | 'drill'>('day');
  
  // Flashcard states
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [userSentence, setUserSentence] = useState<string>('');
  const [practiceSentences, setPracticeSentences] = useState<Record<string, string>>({});

  // Drill states
  const [selectedDrillWord, setSelectedDrillWord] = useState<VocabWord | null>(null);
  const [drillStep, setDrillStep] = useState<number>(1); // 1: Read, 2: Say translation, 3: Make sentence, 4: 30s Topic
  const [drillTimer, setDrillTimer] = useState<number>(30);
  const [drillTimerRunning, setDrillTimerRunning] = useState<boolean>(false);
  const [drillTimerInterval, setDrillTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Speech synthesis speaking helper
  const handlePronounce = (wordText: string) => {
    if ('speechSynthesis' in window) {
      // Cancel previous utterances
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // clear, steady rate
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setUserSentence('');
    setCardIndex((prev) => (prev + 1) % dayData.words.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setUserSentence('');
    setCardIndex((prev) => (prev - 1 + dayData.words.length) % dayData.words.length);
  };

  const handleSaveSentence = (word: string) => {
    if (!userSentence.trim()) return;
    setPracticeSentences(prev => ({ ...prev, [word]: userSentence }));
    if (!completedWords.includes(word)) {
      onToggleWord(word);
    }
  };

  // Start 30s topic drill timer
  const startDrillTimer = () => {
    setDrillTimer(30);
    setDrillTimerRunning(true);
    const interval = setInterval(() => {
      setDrillTimer(prev => {
        if (prev <= 1) {
          setDrillTimerRunning(false);
          clearInterval(interval);
          try {
            // Beep
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.5);
          } catch (e) {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setDrillTimerInterval(interval);
  };

  const stopDrillTimer = () => {
    if (drillTimerInterval) {
      clearInterval(drillTimerInterval);
    }
    setDrillTimerRunning(false);
  };

  const currentWord = dayData.words[cardIndex];
  const isMastered = currentWord ? completedWords.includes(currentWord.english) : false;

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight font-sans">
            Vocabulary Upgrade & Drills
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Day {dayData.dayNumber} active concept: {dayData.theme}
          </p>
        </div>
        
        {/* Navigation toggles */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button 
            onClick={() => { setActiveTab('day'); stopDrillTimer(); }}
            className={`flex-1 sm:flex-none text-xs font-semibold px-4.5 py-1.5 rounded-lg transition ${
              activeTab === 'day' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Soh'zlar (Day Vocab)
          </button>
          <button 
            onClick={() => { setActiveTab('upgrade'); stopDrillTimer(); }}
            className={`flex-1 sm:flex-none text-xs font-semibold px-4.5 py-1.5 rounded-lg transition ${
              activeTab === 'upgrade' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weak → Strong
          </button>
          <button 
            onClick={() => {
              setActiveTab('drill');
              setSelectedDrillWord(dayData.words[0]);
              setDrillStep(1);
              setDrillTimer(30);
            }}
            className={`flex-1 sm:flex-none text-xs font-semibold px-4.5 py-1.5 rounded-lg transition relative ${
              activeTab === 'drill' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Eng Muhim Drill
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Day Vocabulary Flashcards */}
      {activeTab === 'day' && currentWord && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Flashcard Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-400">
              <span>CARD {cardIndex + 1} OF {dayData.words.length}</span>
              <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px]">
                {completedWords.filter(w => dayData.words.some(dw => dw.english === w)).length} / {dayData.words.length} Mastered
              </span>
            </div>

            {/* Simulated Flip Card */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className={`min-h-[220px] bg-white border rounded-3xl p-6 flex flex-col justify-between cursor-pointer select-none transition-all shadow-sm group hover:shadow-md hover:border-indigo-200 relative ${
                isFlipped ? 'bg-gradient-to-br from-indigo-50/20 to-white border-indigo-100' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePronounce(currentWord.english);
                  }}
                  className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 bg-gray-100 rounded text-gray-500Group hover:bg-indigo-50">
                  {isFlipped ? 'Tarjimasi (Click back to see word)' : 'Word (Click to flip)'}
                </div>
              </div>

              <div className="py-6 text-center">
                {isFlipped ? (
                  <div className="space-y-1 animate-fade-in">
                    <span className="text-sm font-semibold uppercase font-mono tracking-wider text-indigo-600">O'zbek tili:</span>
                    <h3 className="text-3xl font-bold font-sans text-gray-900 tracking-tight">{currentWord.uzbek}</h3>
                  </div>
                ) : (
                  <div className="space-y-1 animate-fade-in">
                    <span className="text-sm font-semibold uppercase font-mono tracking-wider text-gray-400">English:</span>
                    <h3 className="text-3xl font-black font-sans text-gray-900 tracking-wide select-text">{currentWord.english}</h3>
                  </div>
                )}
              </div>

              {/* Master Checkmark Badge */}
              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWord(currentWord.english);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isMastered 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 rounded-full p-0.5 ${isMastered ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white'}`} />
                  {isMastered ? 'Mastered' : 'Mark Mastered'}
                </button>
                <span className="text-xs text-gray-400 group-hover:text-indigo-500 font-mono">
                  Tap card to flip
                </span>
              </div>
            </div>

            {/* Pagination controls */}
            <div className="flex gap-2 justify-between items-center">
              <button
                onClick={handlePrevCard}
                className="p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 text-gray-700 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-gray-500">
                {cardIndex + 1} / {dayData.words.length}
              </span>
              <button
                onClick={handleNextCard}
                className="p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 text-gray-700 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Practice Sentence Builder Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-sm">
              <h4 className="font-bold text-gray-900 tracking-tight font-sans text-sm flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                Soh'zni gapda ishlatish (Sentence Builder)
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Wordni shunchaki yodlamang! O'zingizga mos real gap tuzib yozing va baland ovozda qaytaring.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                  ACTIVE ENGLISH WORD:
                </label>
                <span className="inline-block font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs">
                  {currentWord.english}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                  YOUR ENGLISH SENTENCE:
                </label>
                <textarea
                  value={userSentence}
                  onChange={(e) => setUserSentence(e.target.value)}
                  placeholder={`Write a customized sentence containing "${currentWord.english}"...`}
                  className="w-full min-h-[80px] p-3 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
                />
              </div>

              <button
                onClick={() => handleSaveSentence(currentWord.english)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition"
              >
                Gapni saqlash & Soh'zni tasdiqlash
              </button>

              {/* Saved Sentences checklist */}
              {Object.keys(practiceSentences).length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                    SAVED SENTENCES ({Object.keys(practiceSentences).length}):
                  </span>
                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                    {Object.entries(practiceSentences).map(([w, s]) => (
                      <div key={w} className="bg-gray-50 p-2.5 rounded-xl text-xs">
                        <span className="font-mono font-bold text-indigo-600">{w}: </span>
                        <span className="text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Phrases block */}
            <div className="bg-indigo-50/50 border border-indigo-100/50 p-5 rounded-3xl space-y-2.5">
              <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-widest font-mono">
                Bugungi Foydali Iboralar:
              </h5>
              <div className="space-y-2">
                {dayData.phrases.map((ph, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handlePronounce(ph.english)}
                    className="bg-white p-3 border border-indigo-100 rounded-2xl cursor-pointer hover:border-indigo-300 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 text-left min-w-0">
                      <span className="font-sans font-semibold text-xs text-gray-900 block">"{ph.english}"</span>
                      <span className="text-[10px] text-gray-500 block font-sans mt-0.5">{ph.uzbek}</span>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Weak to Strong Upgrades */}
      {activeTab === 'upgrade' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-bold text-gray-900 tracking-tight text-base font-sans flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-indigo-600" /> Weak → Strong Vocabulary Upgrade
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mt-1">
              Intermediate darajadagi oddiy so‘zlardan voz keching! Quyidagi upgraded kuchli so'zlardan faol gaplar ichida foydalaning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEAK_STRONG_PAIRS.map((pair, idx) => (
              <div 
                key={idx}
                className="border border-gray-100 hover:border-indigo-100 rounded-2xl p-4 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-full">
                      {pair.weak} (Weak)
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    {pair.strong.map(s => (
                      <span 
                        key={s} 
                        onClick={() => handlePronounce(s)}
                        className="text-xs font-mono font-bold px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full cursor-pointer hover:bg-indigo-50 flex items-center gap-1"
                      >
                        {s} <Volume2 className="w-3 h-3 text-indigo-500" />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono italic mt-1 bg-white p-2 border border-gray-100 rounded-xl">
                  {pair.uzbek}
                </div>
                
                {/* Auto practice example builder */}
                <div className="mt-3">
                  <button
                    onClick={() => {
                      const template = `This is ${pair.strong[0]} for my future goals.`;
                      handlePronounce(template);
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Listen Practice Example: "This is {pair.strong[0]}..."
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: "ENG MUHIM DRILL" Simulator */}
      {activeTab === 'drill' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-gray-900 tracking-tight text-base font-sans flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" /> Eng Muhim Drill (Retreival Speed Simulator)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Har kuni so'zlarni yodlagandan so'ng quyidagi 4-bosqichli mashqni bajaring.
              </p>
            </div>
            
            {/* Quick Word selector for Drill */}
            <div className="flex gap-2 items-center w-full md:w-auto">
              <span className="text-xs font-semibold text-gray-650 flex-shrink-0">Mashq uchun so'z:</span>
              <select
                value={selectedDrillWord?.english || ''}
                onChange={(e) => {
                  const w = dayData.words.find(dw => dw.english === e.target.value);
                  if (w) {
                    setSelectedDrillWord(w);
                    setDrillStep(1);
                    stopDrillTimer();
                    setDrillTimer(30);
                  }
                }}
                className="w-full md:w-48 text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-indigo-700"
              >
                {dayData.words.map((w) => (
                  <option key={w.english} value={w.english}>
                    {w.english}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDrillWord ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Drill Progress Roadmap (Steps 1 to 4) */}
              <div className="lg:col-span-5 space-y-2">
                {[
                  { step: 1, title: "1. Soh'zni baland ovozda o'qing", desc: "Read the word out loud." },
                  { step: 2, title: "2. Tarjimasini ayting", desc: "Say the Uzbek translation quickly." },
                  { step: 3, title: "3. Haqiqiy gap tuzing", desc: "Create a rich sentence out loud." },
                  { step: 4, title: "4. Wordni 30-sec gapda ishlating", desc: "Talk on a topic using this word." }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => {
                      setDrillStep(s.step);
                      stopDrillTimer();
                      setDrillTimer(30);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex gap-3 items-center ${
                      drillStep === s.step
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20'
                        : drillStep > s.step
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      drillStep === s.step
                        ? 'bg-indigo-600 text-white'
                        : drillStep > s.step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.step}
                    </span>
                    <div>
                      <span className={`block font-bold text-xs ${drillStep === s.step ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {s.title}
                      </span>
                      <span className="text-[10px] text-gray-500">{s.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Drill Step Interactive Panel */}
              <div className="lg:col-span-7 bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between min-h-[300px]">
                <div>
                  <span className="text-[10px] font-mono tracking-widest font-bold text-indigo-600 uppercase block mb-1">
                    Bajarilayotgan bosqich: BOSQICH {drillStep}
                  </span>

                  {drillStep === 1 && (
                    <div className="space-y-4 py-4 animate-fade-in">
                      <p className="text-xs text-gray-600 font-sans">
                        Ekrandagi inglizcha so‘zni diqqat bilan o'qing, so'ngra rasmda ko'rsatilgandek baland va ishonchli ovozda pronunciations (tovuq bilan) qaytaring:
                      </p>
                      <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 rounded-2xl">
                        <h4 className="text-4xl font-extrabold text-indigo-950 tracking-wider font-sans mb-3 text-center">
                          {selectedDrillWord.english}
                        </h4>
                        <button
                          onClick={() => handlePronounce(selectedDrillWord.english)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition"
                        >
                          <Volume2 className="w-4 h-4" /> Talaffuzni tinglash
                        </button>
                      </div>
                    </div>
                  )}

                  {drillStep === 2 && (
                    <div className="space-y-4 py-4 animate-fade-in">
                      <p className="text-xs text-gray-600">
                        O‘zbekcha tarjimasini so‘zlashuvda eslagandek tezda yoddan, ovoz chiqarib ayting. Tayyor bo'lgach o'zbekchasini ochib tekshiring:
                      </p>
                      <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 rounded-2xl min-h-[140px]">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-2">
                          Miyangizda o'ylang... so'ngra:
                        </span>
                        <h4 className="text-2xl font-bold text-gray-900 tracking-tight text-center">
                          {selectedDrillWord.uzbek}
                        </h4>
                      </div>
                    </div>
                  )}

                  {drillStep === 3 && (
                    <div className="space-y-4 py-4 animate-fade-in">
                      <p className="text-xs text-gray-600">
                        Ushbu so'zni o'z ichiga olgan birinchi hayolga kelgan, grammatikasi oddiy bo'lsa-da jonli inglizcha gap tuzib ovoz chiqarib ayting!
                      </p>
                      <div className="bg-white p-5 border border-indigo-100 rounded-2xl relative">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">FORMULA FORMAT:</span>
                        <p className="font-mono text-sm font-semibold text-gray-800 mt-2 italic leading-relaxed">
                          "Speaking is <span className="text-indigo-600 font-bold">{selectedDrillWord.english}</span> for my future because I want to communicate confidently."
                        </p>
                      </div>
                    </div>
                  )}

                  {drillStep === 4 && (
                    <div className="space-y-4 py-4 animate-fade-in">
                      <p className="text-xs text-gray-600">
                        <strong>30 Soniya to'xtovsiz Gapirish:</strong> Active so'zimiz <span className="font-bold text-indigo-600">"{selectedDrillWord.english}"</span>ni qo'llab, erkin mavzuda 30 soniya davomida bir soniya ham to'xtamay gapiring!
                      </p>

                      <div className="bg-white p-6 border border-gray-100 rounded-3xl flex flex-col items-center justify-center space-y-4">
                        <div className="text-5xl font-extrabold font-mono text-gray-900">
                          0:{(drillTimer < 10 ? '0' : '') + drillTimer}
                        </div>

                        <div className="flex gap-2">
                          {!drillTimerRunning ? (
                            <button
                              onClick={startDrillTimer}
                              className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Start 30s Challenge
                            </button>
                          ) : (
                            <button
                              onClick={stopDrillTimer}
                              className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:bg-red-700 transition flex items-center gap-1.5"
                            >
                              <Square className="w-3.5 h-3.5 fill-current" /> Pause
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center mt-4">
                  {drillStep > 1 ? (
                    <button
                      onClick={() => { setDrillStep(drillStep - 1); stopDrillTimer(); }}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900"
                    >
                      Orqaga
                    </button>
                  ) : <div />}

                  {drillStep < 4 ? (
                    <button
                      onClick={() => setDrillStep(drillStep + 1)}
                      className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black transition flex items-center gap-1"
                    >
                      Keyingi qadam <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onToggleWord(selectedDrillWord.english);
                        // go to next word
                        const currIdx = dayData.words.findIndex(w => w.english === selectedDrillWord.english);
                        const nextWord = dayData.words[(currIdx + 1) % dayData.words.length];
                        setSelectedDrillWord(nextWord);
                        setDrillStep(1);
                        setDrillTimer(30);
                        stopDrillTimer();
                      }}
                      className="bg-green-600 text-white hover:bg-green-700 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1"
                    >
                      Tugatish & Keyingi Soh'zga <Check className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-500">
              Soh'zni tanlang.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
