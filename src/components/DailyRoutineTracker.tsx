import React, { useState, useEffect } from 'react';
import { Check, Play, Square, RefreshCw, AlertCircle, Sparkles, ExternalLink, Moon } from 'lucide-react';
import { ScheduleItem } from '../types';
import { SCHEDULE_TEMPLATES, SHADOWING_RESOURCES } from '../data';

interface DailyRoutineTrackerProps {
  completedItems: string[];
  onToggleItem: (id: string) => void;
  selectedDay: number;
  dayTheme: string;
}

export default function DailyRoutineTracker({
  completedItems,
  onToggleItem,
  selectedDay,
  dayTheme
}: DailyRoutineTrackerProps) {
  const [activeItem, setActiveItem] = useState<ScheduleItem | null>(null);
  
  // Custom Timer State
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerGoalMinutes, setTimerGoalMinutes] = useState<number>(0);

  // Brain Activation checklist
  const [activationPrompts, setActivationPrompts] = useState({
    wokeUp: false,
    feels: false,
    plans: false,
    yesterday: false,
    noUzbek: false
  });

  // Sound cue for timer completion
  const playFinishSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.82);
    } catch (e) {
      console.warn("Audio Context warning:", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft !== null && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev !== null && prev <= 1) {
            setTimerRunning(false);
            playFinishSound();
            if (activeItem) {
              onToggleItem(activeItem.id); // auto-complete item on finish
            }
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft]);

  const startTimer = (minutes: number) => {
    setTimerGoalMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(timerGoalMinutes * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectItem = (item: ScheduleItem) => {
    setActiveItem(activeItem?.id === item.id ? null : item);
    setTimerRunning(false);
    setSecondsLeft(null);
    
    // Auto-parse duration to setup timer
    if (item.duration) {
      let mins = parseInt(item.duration);
      if (isNaN(mins)) {
        if (item.duration.includes('hour')) mins = 60;
        else mins = 15;
      }
      setTimerGoalMinutes(mins);
    }
  };

  // Helper to check what type category icon background/styling to show
  const getIconColor = (type: string) => {
    switch (type) {
      case 'routine': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'brain_activation': return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300 border';
      case 'shadowing': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'pattern': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';
      case 'speaking_topic': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'vocab_upgrade': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'expansion': return 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300';
      case 'pressure': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-400 animate-pulse';
      case 'recording': return 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getFocusAdvice = (type: string) => {
    switch (type) {
      case 'routine':
        return "Miyani jismonan uyg'otish va umumiy tetiklikni saqlashga ko'proq e'tibor bering. Telefon yoki ijtimoiy tarmoqlar kabi chalg'ituvchi narsalardan butunlay uzoq turing!";
      case 'brain_activation':
        return "To'xtovsiz, o'ylanmasdan gapirishga harakat qiling. O'zbekcha so'z mutlaqo hayolingizga ham kelmasligi kerak. Qiyinchilik bo'lib qolsa, o'rniga sinonimlar yoki maxsus filler so'zlardan ('thing', 'stuff') foydalaning.";
      case 'shadowing':
        return "Haqiqiy nativerning talaffuz ohangi, tezligi va ritmiga to'liq e'tibor bering. Har bitta so'z urg'usi va tabiiy to'xtashlarni (pauses) aynan o'zlashtirish bilan jiddiy ishlang.";
      case 'pattern':
        return "Ushbu nutq qoliplarini har xil kontekstlarda baland ovozda kamida 10 marotaba takrorlab, tilga o'tqazing. Gapning tayyor qolipiga (skeletoniga) ko'proq ahamiyat berib gapiring.";
      case 'speaking_topic':
        return "Grammatik xatolaringizga mutlaqo e'tibor bermay, faqat to'xtovsiz gapirishga (nutq oqimi - Flow) e'tibor qarating. So'z eslay olmasangiz ham jim qolmasdan aylanma gaplar bilan tushuntirish ustida ishlang.";
      case 'vocab_upgrade':
        return "Yangi so'zlarni shunchaki yodlash kifoya qilmaydi, ularni o'zingizning kundalik hayotingizga bog'lab, shaxsiy gaplar tuzing va ovoz ochib o'sha gaplarni kamida 5 marta takrorlang.";
      case 'expansion':
        return "Miyadagi faol so'zlarni eslash tezligini (active retrieval) chiniqtirish uchun gapni hajm jihatidan uzaytirishga va kengaytirishga intiling. Sabablar, tafsilotlar, vaqt va joylarni qo'shish bilan ko'proq mashq qiling.";
      case 'pressure':
        return "Har qanday mavzu yoki savol bo'yicha 3 soniya ichida o'ylamay javob berishni boshlang. Hech qanday tayyorgarliksiz, miyadagi so'zlarni zudlik bilan nutqqa chiqarish ustida mashq qiling.";
      case 'listening':
        return "Eshita turib, o'zingizga yoqqan natural gap tuzilmalarini, iboralar yoki maxsus tayyor qoliplarni darhol daftaringizga yozing va ularni o'z nutqingizga sinab, qorishib ketishi ustida ishlang.";
      case 'mirror':
        return "Oyna qarshisida tik turib, jiddiy ko'z kontakti, mimikalar va faol tana tili (gestures) bilan ishlang. Mirror speaking nutqingizga ishonch va tabiiylik bag'ishlaydi.";
      case 'recording':
        return "Ovozingizni yozib olgandan so'ng qayta eshitayotganda, nutqingizdagi tutilishlar (hesitations) va juda ko'p takrorlanadigan bir xil so'zlarni aniqlab, ularni tuzatish va qisqartirish ustida ko'proq ishlang.";
      default:
        return "Sodda va to'g'ri ishlashga e'tibor qarating, mashqlar barqarorligini tushirmang.";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 15 Step Schedule List */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">
              Kunlik Jadval (Daily Routine)
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Day {selectedDay}: {dayTheme}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
              {completedItems.length} / {SCHEDULE_TEMPLATES.length} Done
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
          {SCHEDULE_TEMPLATES.map((item) => {
            const isCompleted = completedItems.includes(item.id);
            const isActive = activeItem?.id === item.id;
            
            return (
              <div 
                key={item.id}
                className={`transition-all duration-200 border rounded-2xl p-4 cursor-pointer outline-none ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-md ring-1 ring-indigo-500/20' 
                    : isCompleted 
                    ? 'border-gray-200 bg-gray-50/80 hover:bg-gray-50' 
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
                onClick={() => handleSelectItem(item)}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleItem(item.id);
                    }}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'border-gray-300 hover:border-green-600 hover:bg-green-50 bg-white'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-indigo-600">
                        {item.time} ({item.duration || 'Flexible'})
                      </span>
                      {item.type !== 'routine' && (
                        <span className="text-[10px] uppercase tracking-wider font-mono font-semibold px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                          {item.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <h3 className={`font-semibold font-sans text-sm tracking-tight ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      {isActive && <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />}
                    </div>
                    <p className={`text-xs text-gray-600 mt-1 ${isActive ? '' : 'line-clamp-1'}`}>
                      {item.description}
                    </p>

                    {/* Interactive Expanded Detail Card Directly Below */}
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-indigo-100 space-y-4 text-xs animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        
                        {/* 1. Nima qilish kerakligi */}
                        <div className="space-y-1.5">
                          <span className="font-bold text-indigo-950 block tracking-tight uppercase text-[10px] font-mono flex items-center gap-1">
                            📋 Nima Qilish Kerak (Yo'riqnoma):
                          </span>
                          <ul className="space-y-2 pl-1 bg-white/70 p-3 rounded-xl border border-indigo-50/50">
                            {item.instructions.map((ins, index) => (
                              <li key={index} className="flex gap-2 text-gray-700 leading-relaxed">
                                <span className="flex-shrink-0 w-4 h-4 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[9px] font-black mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="font-sans font-medium">{ins}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 2. Nima bilan ko'proq ishlash kerak */}
                        <div className="space-y-1.5">
                          <span className="font-bold text-[#b45309] block tracking-tight uppercase text-[10px] font-mono flex items-center gap-1">
                            ⚡️ Nima Bilan Ko'proq Ishlash Kerak (Asosiy Focus):
                          </span>
                          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100/80 text-amber-950 leading-relaxed font-sans font-semibold text-xs flex gap-2">
                            <span className="text-sm select-none">🎯</span>
                            <div>
                              {getFocusAdvice(item.type)}
                              {item.tips && item.tips.length > 0 && (
                                <p className="mt-1.5 pt-1.5 border-t border-amber-200/50 text-[11px] text-amber-800 font-normal">
                                  <strong>Qo'shimcha maslahat:</strong> {item.tips.join(' ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tiny Complete button directly in the expanded block for convenience */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => onToggleItem(item.id)}
                            className={`w-full font-bold text-[11px] py-2 px-3 rounded-xl shadow-sm transition flex justify-center items-center gap-1.5 ${
                              isCompleted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            {isCompleted ? 'Drill Bajarildi deb Belingangan!' : 'Ushbu Drillni Yakunlash'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus & Practice Companion Panel */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
          {activeItem ? (
            <div>
              {/* Header */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50/20">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${getIconColor(activeItem.type)}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-tight font-sans text-base">
                      {activeItem.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      Vaqt: {activeItem.time} • Davomiyligi: {activeItem.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions list */}
              <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Nimalar Qilinadi (Steps):
                  </h4>
                  <ul className="space-y-2.5">
                    {activeItem.instructions.map((ins, index) => (
                      <li key={index} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specific Widgets depending on Task Type */}

                {/* 1. Timer Widget for Practice drills */}
                {activeItem.duration && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3 text-xs font-semibold text-gray-700">
                      <span>Mashg'ulot taymeri</span>
                      <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px]">
                        Target: {timerGoalMinutes} Min
                      </span>
                    </div>

                    <div className="flex flex-col items-center py-2">
                      <div className="text-4xl font-black font-mono tracking-wider text-gray-900 mb-4 select-none">
                        {secondsLeft !== null ? formatTime(secondsLeft) : `${timerGoalMinutes}:00`}
                      </div>
                      <div className="flex gap-2">
                        {!timerRunning ? (
                          <button
                            onClick={() => {
                              if (secondsLeft === null || secondsLeft === 0) {
                                startTimer(timerGoalMinutes);
                              } else {
                                setTimerRunning(true);
                              }
                            }}
                            className="bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-700 transition flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 stroke-[3]" /> Start Focus
                          </button>
                        ) : (
                          <button
                            onClick={stopTimer}
                            className="bg-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-amber-700 transition flex items-center gap-1.5"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" /> Pause
                          </button>
                        )}
                        <button
                          onClick={resetTimer}
                          className="border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Brain Activation interactive Helper */}
                {activeItem.type === 'brain_activation' && (
                  <div className="bg-rose-50/50 p-4 border border-rose-100 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-rose-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Brain Activation Prompts:
                    </h5>
                    <p className="text-[11px] text-gray-600">
                      Ovoz chiqarib gapiring. O'zbekcha so'z mutlaqo ishlatmang!
                    </p>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={activationPrompts.wokeUp} 
                          onChange={() => setActivationPrompts(p => ({...p, wokeUp: !p.wokeUp}))}
                          className="rounded text-rose-600 border-gray-300 focus:ring-rose-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-gray-700">"Today I woke up at..."</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={activationPrompts.feels} 
                          onChange={() => setActivationPrompts(p => ({...p, feels: !p.feels}))}
                          className="rounded text-rose-600 border-gray-300 focus:ring-rose-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-gray-700">"Today I feel..."</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={activationPrompts.plans} 
                          onChange={() => setActivationPrompts(p => ({...p, plans: !p.plans}))}
                          className="rounded text-rose-600 border-gray-300 focus:ring-rose-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-gray-700">"My plan today is..."</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={activationPrompts.yesterday} 
                          onChange={() => setActivationPrompts(p => ({...p, yesterday: !p.yesterday}))}
                          className="rounded text-rose-600 border-gray-300 focus:ring-rose-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-gray-700">"Yesterday, I was..."</span>
                      </label>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-rose-100 text-[10px] text-gray-600">
                      <span className="font-bold text-rose-700 uppercase">Agar stuck bo'lsangiz:</span> Ishlatishga ruxsat berilgan so'zlar: <br />
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {['thing', 'stuff', 'something', 'somehow'].map(w => (
                          <span key={w} className="font-mono bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-rose-700 font-semibold">
                            {w}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 font-mono italic">"I used some thing for..."</p>
                    </div>
                  </div>
                )}

                {/* 3. Shadowing Speeches widget */}
                {activeItem.type === 'shadowing' && (
                  <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-blue-800 flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> High-Quality Shadowing Clips:
                    </h5>
                    <p className="text-[11px] text-blue-900 leading-relaxed">
                      Select one, listen for 5 seconds, pause, and imitate the exact pitch, pacing, and emotional stress.
                    </p>

                    <div className="space-y-2 pt-1">
                      {SHADOWING_RESOURCES.map((res, i) => (
                        <a 
                          href={res.url} 
                          target="_blank" 
                          rel="noreferrer referrer" 
                          key={i}
                          className="block bg-white hover:bg-blue-50 p-3 rounded-xl border border-blue-100 transition shadow-sm hover:shadow"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-gray-900 line-clamp-1">{res.title}</span>
                            <ExternalLink className="w-3 h-3 text-blue-500 flex-shrink-0 ml-1 mt-0.5" />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">{res.description}</p>
                          <div className="flex gap-1 mt-2">
                            {res.tags.map(t => (
                              <span key={t} className="text-[9px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {activeItem.tips && activeItem.tips.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-2 text-indigo-900 text-xs leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">Yordamchi tip:</span>
                      {activeItem.tips.join(' ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Complete action footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => completedItems.includes(activeItem.id) ? null : onToggleItem(activeItem.id)}
                  disabled={completedItems.includes(activeItem.id)}
                  className={`w-full font-bold text-xs py-3 rounded-xl shadow-sm transition flex justify-center items-center gap-1.5 ${
                    completedItems.includes(activeItem.id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-500 bg-white rounded-full p-0.5 stroke-[3]" />
                  {completedItems.includes(activeItem.id) ? 'Ushbu Drill Bajarildi!' : 'Mashg\'ulotni Bajarildi deb belgilash'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 animate-bounce text-indigo-500" />
              </div>
              <h3 className="font-bold text-gray-900 tracking-tight font-sans text-base">
                Mashg'ulotni tanlang
              </h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed">
                Jadvaldan biror bir bandni bosing. Bu yerda uning batafsil yo'riqnomalari, yordamchi tip yoki focus taymerlari paydo bo'ladi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
